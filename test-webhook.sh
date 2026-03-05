#!/bin/bash

echo "🧪 Probando webhook localmente..."

# Test GET
echo -e "\n📡 Testing GET request:"
curl -X GET http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -v

# Test POST (MercadoPago test notification)
echo -e "\n📡 Testing POST request:"
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "action": "payment.updated",
    "api_version": "v1", 
    "data": {"id":"123456"},
    "date_created": "2021-11-01T02:02:02Z",
    "id": "123456",
    "live_mode": false,
    "type": "payment",
    "user_id": 723863383
  }' \
  -v

echo -e "\n✅ Tests completed!"