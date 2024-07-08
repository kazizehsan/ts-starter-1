import config from '../../config/config.js';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ts-prac-3 API documentation',
    version: '0.0.1',
    description: 'This is a node express mongoose boilerplate in typescript',
    license: {
      name: 'MIT',
      url: 'https://github.com/kazizehsan/ts_prac_3.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
