#!/bin/bash

BASE_URL="http://localhost:3000/trips"

echo "=== Delete a Trip ==="

read -p "Enter trip ID: " tripId

# Send the DELETE request
response=$(curl -s -X DELETE "$BASE_URL/$tripId")

# Print the response
if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Trip Deleted Successfully (Formatted):"
  echo "$response" | jq .
else
  echo "Failed to Delete Trip. Response:"
  echo "$response"
fi
