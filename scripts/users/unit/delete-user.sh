#!/bin/bash

BASE_URL="http://localhost:3000/users"

echo "=== Delete a User ==="

read -p "Enter user ID: " id

response=$(curl -s -X DELETE "$BASE_URL/$id")

if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Response (Formatted):"
  echo "$response" | jq .
else
  echo "Invalid JSON Response:"
  echo "$response"
fi
