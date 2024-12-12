#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Creating a Trip with Invalid Data ==="
invalidTripResponse=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "",
    "captainId": "",
    "ownerId": "",
    "startTime": "",
    "endTime": "",
    "tripType": "INVALID_TYPE"
  }')

echo "Invalid Trip Creation Response:"
echo "$invalidTripResponse" | jq
