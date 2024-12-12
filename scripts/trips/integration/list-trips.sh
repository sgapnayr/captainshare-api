#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Creating Sample Trips for Integration Tests ==="

# Function to create a trip
create_trip() {
  local tripType=$1
  local startTime=$2
  local endTime=$3
  local captainId=$4
  local ownerId=$5
  local boatId=$6
  local captainShare=$7
  local captainRate=$8

  response=$(curl -s -X POST "$BASE_URL/trips" \
    -H "Content-Type: application/json" \
    -d "{
          \"tripType\": \"$tripType\",
          \"startTime\": \"$startTime\",
          \"endTime\": \"$endTime\",
          \"captainId\": \"$captainId\",
          \"ownerId\": \"$ownerId\",
          \"boatId\": \"$boatId\",
          \"captainShare\": $captainShare,
          \"captainRate\": $captainRate
    }")

  echo "$response" | jq
}

# Create sample trips
create_trip "OWNER_TRIP" "2024-12-15T09:00:00.000Z" "2024-12-15T12:00:00.000Z" "captain123" "owner123" "boat123" null 55
create_trip "LEASED_TRIP" "2024-12-16T13:00:00.000Z" "2024-12-16T15:00:00.000Z" "captain456" "owner456" "boat456" 0.3 null
create_trip "OWNER_TRIP" "2024-12-17T10:00:00.000Z" "2024-12-17T12:00:00.000Z" "captain789" "owner789" "boat789" null 70
create_trip "LEASED_TRIP" "2024-12-18T08:00:00.000Z" "2024-12-18T11:00:00.000Z" "captain101" "owner101" "boat101" 0.25 null

echo "=== Sample Trips Created Successfully ==="
