# Grocery Management and Ordering System

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

## REST API

### Endpoints

#### Process Order
**POST** `/api/orders`

Process a grocery order with optimal packaging.

**Request:**
```json
{
  "items": [
    {"productCode": "CE", "quantity": 10},
    {"productCode": "HM", "quantity": 14},
    {"productCode": "SS", "quantity": 3}
  ]
}
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "productCode": "CE",
      "productName": "Cheese",
      "quantity": 10,
      "totalCost": 41.90,
      "totalPackages": 2,
      "packageBreakdown": [
        {
          "packageSize": 5,
          "noOfPackages": 2,
          "totalCost": 41.90
        }
      ]
    },
    {
      "productCode": "HM",
      "productName": "Ham",
      "quantity": 14,
      "totalCost": 78.85,
      "totalPackages": 3,
      "packageBreakdown": [
        {"packageSize": 8, "noOfPackages": 1, "totalCost": 40.95},
        {"packageSize": 5, "noOfPackages": 1, "totalCost": 29.95},
        {"packageSize": 1, "noOfPackages": 1, "totalCost": 7.95}
      ]
    },
    {
      "productCode": "SS",
      "productName": "Soy Sauce",
      "quantity": 3,
      "totalCost": 35.85,
      "totalPackages": 3,
      "packageBreakdown": [
        {"packageSize": 1, "noOfPackages": 3, "totalCost": 35.85}
      ]
    }
  ],
  "totalCost": 156.60
}
```

**Error Response (400):**
```json
{
  "error": "Product INVALID not found"
}
```

**curl Example:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productCode": "CE", "quantity": 10},
      {"productCode": "HM", "quantity": 14},
      {"productCode": "SS", "quantity": 3}
    ]
  }' | python -m json.tool
```

---

#### Get All Products
**GET** `/api/products`

List all available products with pricing.

**Response (200 OK):**
```json
{
  "products": [
    {
      "code": "CE",
      "name": "Cheese",
      "price": 5.95,
      "packagingOptions": [
        {"quantity": 3, "price": 14.95},
        {"quantity": 5, "price": 20.95}
      ]
    },
    {
      "code": "HM",
      "name": "Ham",
      "price": 7.95,
      "packagingOptions": [
        {"quantity": 2, "price": 13.95},
        {"quantity": 5, "price": 29.95},
        {"quantity": 8, "price": 40.95}
      ]
    },
    {
      "code": "SS",
      "name": "Soy Sauce",
      "price": 11.95,
      "packagingOptions": []
    }
  ]
}
```

**curl Example:**
```bash
curl http://localhost:3000/api/products
```

---

#### Get Product by Code
**GET** `/api/products/:code`

Get details of a specific product.

**Response (200 OK):**
```json
{
  "code": "CE",
  "name": "Cheese",
  "price": 5.95,
  "packagingOptions": [
    {"quantity": 3, "price": 14.95},
    {"quantity": 5, "price": 20.95}
  ]
}
```

**Response (404 Not Found):**
```json
{
  "error": "Product CE not found"
}
```

**curl Example:**
```bash
curl http://localhost:3000/api/products/CE | python -m json.tool
```

---

## Available Products

| Code | Product | Unit Price | Packaging Options |
|------|---------|------------|-------------------|
| CE | Cheese | $5.95 | 3 for $14.95, 5 for $20.95 |
| HM | Ham | $7.95 | 2 for $13.95, 5 for $29.95, 8 for $40.95 |
| SS | Soy Sauce | $11.95 | No bulk options |

---

## Development Approach

Test-Driven Development with Domain-Driven Design.


## Assumptions

1. In-memory storage sufficient for this assessment scope and no database required
2. Product catalog is pre-seeded (CE, HM, SS) to support efficient testing
3. The shop does not ship more than requested items even if the total cost is reduced by doing so.
4. The shop would choose to use larger package sizes over smaller sizes of there is more than one way to pack if the minimum number of package requirement is satisfied.
e.g. 
Say CE price guide is
1 for $5.95
3 for $14.95
5 for $20.95
The order of six CE would be shipped in three packs as one 5-CE-pack & one 1-CE-pack (total cost is $26.90) over two 3-CE packs (total cost is $29.90). The total cost is minimum in this selection. 

In addition, this implementation have not spent time on considering alternate price arrangements in which the total cost will be lower picking the second option.

Say CE price guide is
1 for $5.95
3 for $14.95
5 for $24.95

Still, the order of six CE would be shipped in three packs as one 5-CE-pack & one 1-CE-pack (total cost is $30.90) over two 3-CE packs (total cost is $29.90) even though the total cost is minimum in second combination. 

## Design Decisions

1. To optimize within a selected timeframe, I have decided to implement and greedy algorithm which does not pick the optimal packaging always but works for the given packaging options in the assessment and would work for most of the real world scenarios. But, this would fail for hypothetical products outside problem statement in which it would sometimes reduce packaging by going for smaller package sizes as demonstrated in below hypothetical scenario.

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

TestProduct has packaging options are 6, 9, 20

Ordering 12 items:

i. will result in 9 + 1 + 1 + 1 = 4 packages in greedy (current) algorithm.
ii. will result in 6 + 6 = 2 packages in an optimal algorithm.

## Complicated Scenarios

1. The customer orders 7 HM. The 8 HM pack is 40.95. But the 7 HM order would compose of one 5-HM-pack & one 2-HM-pack which would cost 29.95 + 13.95 =   43.90. But the shop would adhere to Assumption 1 and ship one 5-HM-pack & one 2-HM-pack.
