# Grocery Management and Ordering System

## Problem
1. Facilitate product creation, retrieval, deletion, and modification.
2. Facilitate packaging option introduction, modification, and deletion 
3. Optimize packaging for grocery orders to minimize package count.

## Setup
```bash
npm install
```

## Run Tests
```bash
npm test
```

## Run Example
```bash
npm run dev <user input> # Run example order with user inputs as a string e.g. npm run dev "10 CE,14 HM,3 SS"
npm test       # Run unit tests
``

## Development Approach

Test-Driven Development with Domain-Driven Design.

## Assumptions

1. The shop does not ship more than requested items even if the total cost is reduced by doing so.

2. The shop would choose to use larger package sizes over smaller sizes of there is more than one way to pack if the minimum number of package requirement is satisfied.
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

## Complicated Scenarios

1. The customer orders 7 HM. The 8 HM pack is 40.95. But the 7 HM order would compose of one 5-HM-pack & one 2-HM-pack which would cost 29.95 + 13.95 =   43.90. But the shop would adhere to Assumption 1 and ship one 5-HM-pack & one 2-HM-pack.
