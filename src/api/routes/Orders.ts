import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
// @ts-ignore
import { orderService } from '../shared.js';

const router = Router();
const controller = new OrderController(orderService);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Process a grocery order
 *     description: Calculate optimal packaging and pricing for an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productCode
 *                     - quantity
 *                   properties:
 *                     productCode:
 *                       type: string
 *                       example: "CE"
 *                     quantity:
 *                       type: integer
 *                       example: 10
 *           example:
 *             items:
 *               - productCode: "CE"
 *                 quantity: 10
 *               - productCode: "HM"
 *                 quantity: 14
 *               - productCode: "SS"
 *                 quantity: 3
 *     responses:
 *       200:
 *         description: Order processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                 totalCost:
 *                   type: number
 *             example:
 *               items:
 *                 - productCode: "CE"
 *                   productName: "Cheese"
 *                   quantity: 10
 *                   totalCost: 41.90
 *                   totalPackages: 2
 *                   packageBreakdown:
 *                     - packageSize: 5
 *                       noOfPackages: 2
 *                       totalCost: 41.90
 *               totalCost: 156.60
 *       400:
 *         description: Invalid request or product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/', controller.processOrder);

export { router as orderRouter };
