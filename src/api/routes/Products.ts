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
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get('/:code', controller.getProductByCode);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product to the catalog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - price
 *             properties:
 *               code:
 *                 type: string
 *                 example: "BR"
 *               name:
 *                 type: string
 *                 example: "Bread"
 *               price:
 *                 type: number
 *                 example: 3.95
 *               packagingOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                 example:
 *                   - quantity: 6
 *                     price: 20.00
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input or product already exists
 */
router.post('/', controller.createProduct);

/**
 * @swagger
 * /api/products/{code}:
 *   put:
 *     summary: Update an existing product
 *     description: Update product details and pricing
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               packagingOptions:
 *                 type: array
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/:code', controller.updateProduct);

/**
 * @swagger
 * /api/products/{code}:
 *   delete:
 *     summary: Delete a product
 *     description: Remove a product from the catalog
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:code', controller.deleteProduct);

export { router as productRouter };
