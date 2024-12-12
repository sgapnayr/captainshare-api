#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Fetching Total Number of Trips ==="
response=$(curl -s "$BASE_URL/trips")
totalTrips=$(echo "$response" | jq '. | length')

echo "Total Trips: $totalTrips"
