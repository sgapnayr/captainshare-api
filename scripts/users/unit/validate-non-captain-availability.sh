#!/bin/bash
# Script to validate that only Captains can add availability

echo "=== Validate Non-CAPTAIN Adding Availability ==="
read -p "User ID: " userId
read -p "Day of the Week: " day
read -p "Start Time: " startTime
read -p "End Time: " endTime

curl -X POST http://localhost:3000/users/$userId/availability \
  -H "Content-Type: application/json" \
  -d '{
    "day": "'"$day"'",
    "startTime": "'"$startTime"'",
    "endTime": "'"$endTime"'"
  }' | jq .
