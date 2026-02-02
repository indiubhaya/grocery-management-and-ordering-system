import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// @ts-ignore
import { repository, orderService } from './shared.js';
import { OrderController } from './controllers/OrderController.js';
import { ProductController } from './controllers/ProductController.js';
import { ErrorHandler } from './middleware/ErrorHandler.js';
import { Router } from 'express';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grocery Order API',
      version: '1.0.0',
      description: 'API for managing grocery product orders with optimized packaging',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const orderController = new OrderController(orderService);
const productController = new ProductController(repository);

const orderRouter = Router();
orderRouter.post('/', orderController.processOrder);

const productRouter = Router();
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:code', productController.getProductByCode);
productRouter.post('/', productController.createProduct);
productRouter.put('/:code', productController.updateProduct);
productRouter.delete('/:code', productController.deleteProduct);

app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});

export { app };
