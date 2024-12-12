#!/bin/bash

BASE_URL="http://localhost:3000"

# List all trips
echo "=== Listing All Trips ==="
response=$(curl -s "$BASE_URL/trips")

if echo "$response" | grep -q '"id"'; then
  echo "All Trips:"
  echo "$response" | jq
else
  echo "Failed to List Trips:"
  echo "$response"
fi
