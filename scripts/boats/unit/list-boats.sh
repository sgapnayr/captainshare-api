#!/bin/bash
# Script to list all boats

echo "=== List All Boats ==="

curl -X GET http://localhost:3000/boats \
  -H "Content-Type: application/json" | jq .
