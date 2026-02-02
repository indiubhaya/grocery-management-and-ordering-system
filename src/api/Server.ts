import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { orderRouter } from './routes/Orders.js';
import { productRouter } from './routes/Products.js';
import { ErrorHandler } from './middleware/ErrorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

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
  apis: ['./src/api/routes/*.ts'], // API docs PATH
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(ErrorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});

export { app };
