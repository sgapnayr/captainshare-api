#!/bin/bash

BASE_URL="http://localhost:3000/boats"

echo "=== List All Boats ==="

response=$(curl -s "$BASE_URL")
echo "Response:"
echo "$response" | jq .
