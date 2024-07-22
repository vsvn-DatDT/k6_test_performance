## Prepare
Install NPM

https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Install K6

https://k6.io/docs/get-started/installation/

```bash
cp .env.example .env
npm i
```

## Dump user
```bash
npm run dump-user:make
```

## Remove dump user
```bash
npm run dump-user:delete
```

## Run access test
Scenarios 01: Concurrency Test
```bash
npm run access_test:concurrency
```

## Check report in folder reports
