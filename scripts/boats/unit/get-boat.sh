#!/bin/bash
# Script to get a boat by ID

echo "=== Get Boat Details ==="
read -p "Boat ID: " boatId

curl -X GET http://localhost:3000/boats/"$boatId" \
  -H "Content-Type: application/json" | jq .
