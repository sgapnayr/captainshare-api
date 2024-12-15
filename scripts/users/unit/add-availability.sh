#!/bin/bash
# Script to add availability for a Captain

echo "=== Add Availability ==="
read -p "Captain User ID: " userId
read -p "Day of the Week (e.g., Monday): " day
read -p "Start Time (e.g., 09:00): " startTime
read -p "End Time (e.g., 17:00): " endTime

curl -X POST http://localhost:3000/users/$userId/availability \
  -H "Content-Type: application/json" \
  -d '{
    "day": "'"$day"'",
    "startTime": "'"$startTime"'",
    "endTime": "'"$endTime"'"
  }' | jq .
