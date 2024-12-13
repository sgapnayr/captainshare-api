#!/bin/bash

BASE_URL="http://localhost:3000/users"

echo "=== List All Users ==="

response=$(curl -s "$BASE_URL")

if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Response (Formatted):"
  echo "$response" | jq .
else
  echo "Invalid JSON Response:"
  echo "$response"
fi
