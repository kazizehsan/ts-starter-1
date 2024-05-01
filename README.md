# Typescript Server Boilerplate on AWS Lambda with AWS SAM

[![Node.js CI](https://github.com/kazizehsan/ts_prac_3/actions/workflows/node.js.yml/badge.svg)](https://github.com/kazizehsan/ts_prac_3/actions/workflows/node.js.yml)

By running a single command, you will get a production-ready Node.js TypeScript app installed and fully configured on your machine. The app comes with many built-in features, such as authentication using JWT, request validation, unit and integration tests, continuous integration, docker support, API documentation, pagination, etc. For more details, check the features list below.

## Not Compatible with Node.js v19

Node.js has deprecated the `--es-module-specifier-resolution=node` flag, used in this app, in the release of [Node.js v19](https://nodejs.org/en/blog/announcements/v19-release-announce/#custom-esm-resolution-adjustments) in favor of [custom loaders](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader). You can check out the PR [here](https://github.com/nodejs/node/pull/44859).

As a result, this app is not compatible with Node.js >=19. You can add support to your app using this [loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader)

## Manual Installation

Clone the repo:

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Deployment

Prior to deployment with `yarn setup`, create AWS Secrets Manager secrets like so:

* ts_prac_3/prod/JWT:secret
* ts_prac_3/prod/MONGODB_URL:url

## Table of Contents

- [Inspirations](#inspirations)
- [License](#license)


## Inspirations

- [saisilinus/node-express-mongoose-typescript-boilerplate](https://github.com/saisilinus/node-express-mongoose-typescript-boilerplate.git)
- [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate.git)

## License

[MIT](LICENSE)
