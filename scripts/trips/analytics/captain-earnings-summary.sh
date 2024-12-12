#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Fetching Captain Earnings Summary ==="
response=$(curl -s "$BASE_URL/trips")
totalCaptainEarnings=$(echo "$response" | jq '[.[] | .netCaptainEarnings] | add')

echo "Total Captain Earnings: $totalCaptainEarnings"
