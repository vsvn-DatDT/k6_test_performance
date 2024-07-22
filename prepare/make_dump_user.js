require('dotenv').config();
const fs = require('fs');
const path = require('path');
const myHeaders = new Headers();

const URL = process.env.HOST_ENV;
const DUMP_USER_KEY = process.env.DUMP_USER_KEY;


myHeaders.append("key", DUMP_USER_KEY);
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_number": 100
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

// Ensure directory exists
const dirPath = path.join(process.cwd(), 'data/users');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

fetch(URL + "/sso/api/users/dump", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    // console.log()
    // const jsonContent = JSON.stringify(JSON.parse(result).data, null, 4);
    // Extract fields and create CSV header
    const data = JSON.parse(result).data;
    // console.log(result);
    const fields = ['email', 'user_name', 'token'];
    const header = fields.join(',') + '\n';
    
    // Create CSV rows
    const rows = data.map(item => {
      return fields.map(field => item[field] || '').join(',');
    }).join('\n');
    
    // Combine header and rows
    const csvContent = header + rows;

    // Write to CSV file
    fs.writeFile(path.join(dirPath, 'user_information.csv'), csvContent, (err) => {
      if (err) {
        console.error('Error writing CSV file', err);
      } else {
        console.log('CSV file was written successfully');
      }
    });
   })
  .catch((error) => console.error(error));
