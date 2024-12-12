#!/bin/bash

BASE_URL="http://localhost:3000"

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

  echo "=== Creating a $tripType ==="
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

  tripId=$(echo "$response" | jq -r '.id')
  if [ -n "$tripId" ] && [ "$tripId" != "null" ]; then
    echo "$tripType Created Successfully: $tripId"
    echo "$response" | jq
    echo "$tripId"
  else
    echo "Failed to Create $tripType:"
    echo "$response"
    exit 1
  fi
}

# Function to fetch trip details and validate revenue
fetch_revenue() {
  local tripId=$1
  echo "=== Fetching Trip Revenue Details for Trip ID: $tripId ==="
  revenueResponse=$(curl -s "$BASE_URL/trips/$tripId")
  echo "Revenue Validation Response:"
  echo "$revenueResponse" | jq
}

# Create an OWNER_TRIP
ownerTripId=$(create_trip "OWNER_TRIP" "2024-12-15T09:00:00.000Z" "2024-12-15T12:00:00.000Z" "captain123" "owner123" "boat123" null 55)

# Validate revenue for OWNER_TRIP
fetch_revenue "$ownerTripId"

# Create a LEASED_TRIP
leasedTripId=$(create_trip "LEASED_TRIP" "2024-12-16T09:00:00.000Z" "2024-12-16T12:00:00.000Z" "captain456" "owner456" "boat456" 0.3 null)

# Validate revenue for LEASED_TRIP
fetch_revenue "$leasedTripId"
