import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { SharedArray } from "k6/data";
import { VERIGENCHAT_ACTION, USER_NUMBER } from '../../config/constants.js';

// Metrics to track successful and failed requests, and the total time for each case
const successCount = new Counter('successful_requests');
const errorCount = new Counter('failed_requests');
const caseDuration = new Trend('case_duration');

// Read the CSV file
const userList = new SharedArray("user data", () => {
  return papaparse.parse(open('../../data/users/user_information.csv'), { header: true }).data;
});

const replicateUrls = (steps, count) => {
  let replicated = [];
  for (let i = 0; i < count; i++) {
    steps.forEach((step) => {
      let url = {
        method: step.method,
        url: step.url
      };
      if (step.is_auth) {
        url.params = {
          headers: {
            Authorization: `Bearer ${userList[i].token}` 
          }
        }
      }
      replicated.push(url);
    });
  }
  return replicated;
};

export default function () {
  VERIGENCHAT_ACTION.forEach((action, urlIndex) => {
    USER_NUMBER.forEach((count) => {
      group(`Test with ${count} users on ${action.name}`, function () {
        console.log(`Testing with ${count} users on ${action.name}`);
        
        let urlCase = replicateUrls(action.step, count);
        let startTime = new Date().getTime();

        let responses = http.batch(urlCase);

        let successfulRequests = 0;
        let failedRequests = 0;

        responses.forEach(response => {
          let success = check(response, {
            'Status is 200': (r) => r.status === 200,
          });
          if (success) {
            successfulRequests++;
            successCount.add(1);
          } else {
            failedRequests++;
            errorCount.add(1);
            console.error(`Error for ${action.name}: status ${response.status}`);
          }
        });

        let endTime = new Date().getTime();
        let duration = (endTime - startTime) / 1000; // Convert to seconds
        caseDuration.add(duration);

        console.log(`Case with ${count} users finished: ${successfulRequests} successful, ${failedRequests} failed, duration: ${duration} seconds`);

        // Sleep for a short duration to ensure the requests are not overlapping
        sleep(1);
      });
    });
  });
}

export function handleSummary(data) {
  return {
    "reports/result_concurrency.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
