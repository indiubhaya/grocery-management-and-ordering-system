import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve list of all available products with pricing
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       packagingOptions:
 *                         type: array
 *             example:
 *               products:
 *                 - code: "CE"
 *                   name: "Cheese"
 *                   price: 5.95
 *                   packagingOptions:
 *                     - quantity: 3
 *                       price: 14.95
 *                     - quantity: 5
 *                       price: 20.95
 */
router.get('/', controller.getAllProducts);

/**
 * @swagger
 * /api/products/{code}:
 *   get:
 *     summary: Get product by code
 *     description: Retrieve details of a specific product
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Product code
 *         example: "CE"
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:code', controller.getProductByCode);

export { router as productRouter };