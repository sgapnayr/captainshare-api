#!/bin/bash

BASE_URL="http://localhost:3000/trips"

echo "=== Get Trip by ID ==="

read -p "Enter trip ID: " tripId

# Send the GET request
response=$(curl -s -X GET "$BASE_URL/$tripId")

# Print the response
if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Trip Details (Formatted):"
  echo "$response" | jq .
else
  echo "Failed to Fetch Trip. Response:"
  echo "$response"
fi
