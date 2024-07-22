require('dotenv').config();

const myHeaders = new Headers();

const URL = process.env.HOST_ENV;
const DUMP_USER_KEY = process.env.DUMP_USER_KEY;

myHeaders.append("key", DUMP_USER_KEY);
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch(URL + "/sso/api/users/dump", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    console.log(result)
   })
  .catch((error) => console.error(error));
