# Nexus Trading Platform - Data Schema

This document defines the core entities and their relationships for both frontend mock APIs and backend microservices.

## Users
```jsonc
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "hashedPassword": "string",
  "balance": "number",
  "role": "string", // e.g. user, trader, admin
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## PortfolioItems
```jsonc
{
  "id": "uuid",
  "userId": "uuid",
  "symbol": "string",
  "quantity": "number",
  "avgBuyPrice": "number",
  "currentPrice": "number",
  "currentValue": "number",
  "unrealizedPnl": "number"
}
```

## Orders
```jsonc
{
  "id": "uuid",
  "userId": "uuid",
  "symbol": "string",
  "type": "buy | sell",
  "quantity": "number",
  "price": "number",  // limit or market
  "status": "pending | executed | cancelled",
  "placedAt": "datetime",
  "filledAt": "datetime"?
}
```

## Executions / Trades
```jsonc
{
  "id": "uuid",
  "orderId": "uuid",
  "symbol": "string",
  "executedPrice": "number",
  "executedQuantity": "number",
  "executedAt": "datetime"
}
```

## MarketData
```jsonc
{
  "symbol": "string",
  "name": "string",
  "price": "number",
  "change": "number",
  "changePercent": "number",
  "volume": "number",
  "timestamp": "datetime"
}
```

## Notifications
```jsonc
{
  "id": "uuid",
  "userId": "uuid",
  "type": "order_filled | price_threshold | system",
  "message": "string",
  "meta": { },
  "sentAt": "datetime",
  "isRead": "boolean"
}
```

---
### Relationships
- A **User** has many **PortfolioItems**.
- A **User** places many **Orders**.
- An **Order** results in one or more **Executions**.
- **MarketData** updates drive recalculation of **PortfolioItems** and trigger alerts/notifications.
