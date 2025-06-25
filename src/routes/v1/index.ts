import express, { Router } from 'express';
import docsRoute from '@/routes/v1/swagger.route.js';
import config from '@/config/config.js';

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
