import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSON from '../../specs/swagger.json' assert { type: "json" };

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerJSON, {
    explorer: true,
  })
);

export default router;
