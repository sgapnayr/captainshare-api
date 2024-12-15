#!/bin/bash
# Script to delete a boat

echo "=== Delete a Boat ==="
read -p "Boat ID: " boatId
read -p "User ID: " userId

curl -X DELETE http://localhost:3000/boats/"$boatId" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'"$userId"'"
  }' | jq .
