#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Fetching Revenue Summary ==="
response=$(curl -s "$BASE_URL/trips")
totalPlatformRevenue=$(echo "$response" | jq '[.[] | .platformRevenue] | add')

echo "Total Platform Revenue: $totalPlatformRevenue"
