#!/bin/bash

BASE_URL="http://localhost:3000/trips"

echo "=== Update a Trip ==="

read -p "Enter trip ID: " tripId
read -p "Enter updated trip name (leave blank to skip): " name
read -p "Enter updated trip type (OWNER_TRIP or LEASED_TRIP, leave blank to skip): " tripType
read -p "Enter updated duration in hours (leave blank to skip): " durationHours
read -p "Enter updated captain rate (leave blank to skip): " captainRate
read -p "Enter updated location (leave blank to skip): " location

# Build the JSON payload with only updated fields
payload="{"
[ -n "$name" ] && payload="$payload\"name\":\"$name\","
[ -n "$tripType" ] && payload="$payload\"tripType\":\"$tripType\","
[ -n "$durationHours" ] && payload="$payload\"durationHours\":$durationHours,"
[ -n "$captainRate" ] && payload="$payload\"captainRate\":$captainRate,"
[ -n "$location" ] && payload="$payload\"location\":\"$location\","
payload="${payload%,}}"

# Send the PATCH request
response=$(curl -s -X PATCH "$BASE_URL/$tripId" \
-H "Content-Type: application/json" \
-d "$payload")

# Print the response
if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Trip Updated Successfully (Formatted):"
  echo "$response" | jq .
else
  echo "Failed to Update Trip. Response:"
  echo "$response"
fi
