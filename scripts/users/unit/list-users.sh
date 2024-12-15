#!/bin/bash
# Script to list all users

echo "=== List All Users ==="
curl -X GET http://localhost:3000/users \
  -H "Content-Type: application/json" | jq .
