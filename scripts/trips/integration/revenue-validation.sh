#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Creating a Trip for Revenue Validation ==="
tripResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat456",
    "captainId": "captain456",
    "ownerId": "owner456",
    "startTime": "2024-12-16T09:00:00.000Z",
    "endTime": "2024-12-16T12:00:00.000Z",
    "tripType": "LEASED_TRIP",
    "captainShare": 0.3
  }')

tripId=$(echo "$tripResponse" | jq -r '.id')
echo "Trip Created for Revenue Validation: $tripId"

# Fetch and validate revenue
echo "=== Fetching Trip Revenue Details ==="
revenueResponse=$(curl -s "$BASE_URL/trips/$tripId")

echo "Revenue Validation Response:"
echo "$revenueResponse" | jq
