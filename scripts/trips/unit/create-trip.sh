#!/bin/bash

BASE_URL="http://localhost:3000/trips"

echo "=== Create a New Trip ==="

read -p "Enter trip name: " name
read -p "Enter trip type (OWNER_TRIP or LEASED_TRIP): " tripType
read -p "Enter duration in hours: " durationHours
read -p "Enter captain rate per hour: " captainRate
read -p "Enter owner ID: " ownerId
read -p "Enter captain ID: " captainId
read -p "Enter location: " location

# Build the JSON payload
payload=$(
  cat <<EOF
{
  "name": "$name",
  "tripType": "$tripType",
  "durationHours": $durationHours,
  "captainRate": $captainRate,
  "ownerId": "$ownerId",
  "captainId": "$captainId",
  "location": "$location"
}
EOF
)

# Send the POST request
response=$(curl -s -X POST "$BASE_URL" \
-H "Content-Type: application/json" \
-d "$payload")

# Print the response
if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Trip Created Successfully (Formatted):"
  echo "$response" | jq .
else
  echo "Failed to Create Trip. Response:"
  echo "$response"
fi
