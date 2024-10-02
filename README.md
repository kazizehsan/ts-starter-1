# Typescript Server Boilerplate on AWS Lambda

[![Node.js CI](https://github.com/kazizehsan/ts-starter-1/actions/workflows/node.js.yml/badge.svg)](https://github.com/kazizehsan/ts-starter-1/actions/workflows/node.js.yml)

Production-ready Node.js v20 TypeScript app using MongoDB. Deployable to AWS Lambda using AWS SAM.


## Compatible with Node.js >=19
This project does not use experimental flags such as `--es-module-specifier-resolution` or any custom loaders. Instead all TypeScript files have `.js` extensions in their `import` statements. 

## Table of Contents

- [Features](#features)
- [Local Development](#local-development)
- [AWS Lambda Deployment](#aws-lambda-deployment)
- [Inspirations](#inspirations)
- [License](#license)

## Features

- **ES2022**: transpiles to ES2022 modules
- **Static Typing**: [TypeScript](https://www.typescriptlang.org/) static typing using typescript
- **Hot Reloading**: [Concurrently](https://github.com/open-cli-tools/concurrently) Hot realoding with concurrently
- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Vitest](https://vitest.dev/)
- **Error handling**: centralized error handling mechanism
- **API documentation**: automatic OpenAPI spec generation with decorators from [tsoa](https://tsoa-community.github.io/docs/), served with [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme) and AWS Secrets Manager
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **AWS Lambda**: IaC with AWS SAM
- **CI**: continuous integration with [GitHub CI](https://travis-ci.org)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)
- **Structured Commit Messages**: with [Commitizen](https://github.com/commitizen/cz-cli)
- **Commit Linting**: with [CommitLint](https://github.com/conventional-changelog/commitlint)

## Quick start

To clone this project, run:
```
npx @kazize/create-ts-starter-1
```
Or,
```
npm init @kazize/ts-starter-1
```

## Manual Installation

Clone the repo.

Install the dependencies:
```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env
```
Open .env and modify the environment variables (if needed).

Make sure you have MongoDB running. Then:
```bash
yarn dev
```

## AWS Lambda Deployment

Make sure you have AWS and SAM CLIs installed locally. 

Make sure you have MongoDB running on a cloud.

(Optional) Update the following in `config` object in `package.json` if necessary.

* s3BucketName
* region
* cloudFormationStackName

Create AWS Secrets Manager secrets like so:

* ts-starter-1/prod/JWT:secret
* ts-starter-1/prod/MONGODB_URL:url

If you change the prefix in the secrets above from `ts-starter-1` to something else, then update `sam-template.yaml` as well.

Finally, run the following. **_Warning_**, this will create an S3 bucket and a CloudFormation Stack on your configured AWS account.
```bash
yarn setup
```


## Inspirations

- [saisilinus/node-express-mongoose-typescript-boilerplate](https://github.com/saisilinus/node-express-mongoose-typescript-boilerplate.git)
- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate.git)

## License

[MIT](LICENSE)
