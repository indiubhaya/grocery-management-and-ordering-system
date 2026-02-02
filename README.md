# Grocery Management and Ordering System

This is a simple TypeScript backend solution for managing products and optimizing order packaging.

## Problem
1. Facilitate product creation, retrieval, deletion, and modification.
2. Facilitate packaging option introduction, modification, and deletion 
3. Optimize packaging for grocery orders to minimize package count.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Start REST API
```bash
npm run api
```

API will be available at:
- **Base URL:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

## REST API


| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:code` | Get product by code |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:code` | Update product |
| DELETE | `/api/products/:code` | Delete product |
| POST | `/api/orders` | Process order with optimal packaging |

**Full API documentation with examples:** http://localhost:3000/api-docs


### CLI (Alternative)
```bash
npm run dev "10 CE,14 HM,3 SS"
```

#### Expected Output

```bash
------------------------------------------------------------
ORDER SUMMARY
------------------------------------------------------------

10 CE for $41.90
  Breakdown:
    - 2 packages of 5 ($41.90)

14 HM for $78.85
  Breakdown:
    - 1 packages of 8 ($40.95)
    - 1 packages of 5 ($29.95)
    - 1 package of 1 ($7.95)

3 SS for $35.85
  Breakdown:
    - 3 package of 1 ($35.85)

TOTAL: $156.60
PACKAGE COUNT: 8 packages
```

## Available Products in Seeded Repository

| Code | Product | Unit Price | Packaging Options |
|------|---------|------------|-------------------|
| CE | Cheese | $5.95 | 3 for $14.95, 5 for $20.95 |
| HM | Ham | $7.95 | 2 for $13.95, 5 for $29.95, 8 for $40.95 |
| SS | Soy Sauce | $11.95 | No bulk options |

---

## Development Approach

Test-Driven Development with Domain-Driven Design.

## Architecture

### Layers
```
API Layer (Express)
    ↓
Service Layer (OrderService, PackageOptimizer)
    ↓
Repository Layer (ProductRepository)
    ↓
Domain Layer (Product, Order)
```

### Technology Stack
- **Runtime:** Node.js 18+
- **Language:** TypeScript (strict mode)
- **API Framework:** Express
- **Testing:** Vitest
- **Documentation:** Swagger/OpenAPI
- **Package Manager:** npm

## Assumptions

1. In-memory storage sufficient for this assessment scope and no database required
2. Product catalog is pre-seeded (CE, HM, SS) to support efficient testing. But product create, update, delete end points are given to alter the product repository.
3. The shop does not ship more than requested items even if the total cost is reduced by doing so.

   > **Example:** The customer orders 7 HM. The 8 HM pack is $40.95. But the 7 HM order would compose of one 5-HM-pack & one 2-HM-pack which would cost $29.95 + $13.95 = $43.90. But the shop would adhere to Assumption 1 and ship one 5-HM-pack & one 2-HM-pack.

4. The shop would choose to use larger package sizes over smaller sizes if there is more than one way to pack when the minimum number of package requirement is satisfied.

   > **Example:** Say CE price guide is:
   > - 1 for $5.95
   > - 3 for $14.95
   > - 5 for $20.95
   >
   > The order of six CE would be shipped in three packs as one 5-CE-pack & one 1-CE-pack (total cost is $26.90) over two 3-CE packs (total cost is $29.90).

## Design Decisions

1. To optimize within a selected timeframe, it was decided to implement a greedy algorithm which satisfies the requirements for the given packaging options in the assessment and would work for most of the real world scenarios. However, it is not guaranteed to pick the optimal packaging always. As an example, this would fail for hypothetical products outside problem statement in which it would sometimes reduce packaging by going for smaller package sizes as demonstrated in below hypothetical scenario.

Say TestProduct has packaging options 6, 9, 20.

Ordering 12 items:

i. will result in 9 + 1 + 1 + 1 = 4 packages in greedy (current) algorithm.
ii. will result in 6 + 6 = 2 packages in an optimal (dynamic programming) algorithm.
