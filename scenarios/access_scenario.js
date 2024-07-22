// import necessary modules
import { check, sleep } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// define configuration
export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true }], // availability threshold for error rate
    http_req_duration: ['p(99)<1000'], // Latency threshold for percentile
  },
  // define scenarios
  scenarios: {
    breaking: {
      executor: 'ramping-vus',
      stages: [
        { duration: '0.5s', target: 10 },
        // { duration: '50s', target: 20 },
        // { duration: '50s', target: 30 },
        // { duration: '50s', target: 50 },
        // { duration: '50s', target: 70 },
        // { duration: '50s', target: 100 },
      ],
    },
  },
};

const URL = __ENV.HOST_ENV;

export default function () {
  // define URL and request body
  const url = URL + '/sso/login';
  const res = http.get(url);

  // check that response is 200
  check(res, {
    'response code was 200': (res) => res.status == 200,
  });
}

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
