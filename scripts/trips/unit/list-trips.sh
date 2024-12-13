#!/bin/bash

BASE_URL="http://localhost:3000/trips"

echo "=== List All Trips ==="

# Send the GET request
response=$(curl -s -X GET "$BASE_URL")

# Print the response
if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Trips List (Formatted):"
  echo "$response" | jq .
else
  echo "Failed to Fetch Trips List. Response:"
  echo "$response"
fi
