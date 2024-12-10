#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Trip ID to analyze revenue
trip_id="1733823613662" # Replace with a valid trip ID

# Fetch the trip details
echo "Fetching trip details for ID: $trip_id..."
trip_response=$(curl -s "$BASE_URL/trips/$trip_id" | jq)

# Extract trip details
captain_id=$(echo "$trip_response" | jq -r '.captainId // empty')
boat_id=$(echo "$trip_response" | jq -r '.boatId // empty')
start_time=$(echo "$trip_response" | jq -r '.startTime // empty')
end_time=$(echo "$trip_response" | jq -r '.endTime // empty')

# Validate trip details
if [ -z "$captain_id" ] || [ -z "$boat_id" ] || [ -z "$start_time" ] || [ -z "$end_time" ]; then
  echo "Error: Missing or invalid trip details."
  echo "$trip_response"
  exit 1
fi

# Fetch captain details
echo "Fetching captain details for ID: $captain_id..."
captain_response=$(curl -s "$BASE_URL/users/$captain_id" | jq)
rate_per_hour=$(echo "$captain_response" | jq -r '.ratePerHour // empty')

# Validate captain details
if [ -z "$rate_per_hour" ]; then
  echo "Error: Missing or invalid captain details."
  echo "$captain_response"
  exit 1
fi

# Fetch boat details
echo "Fetching boat details for ID: $boat_id..."
boat_response=$(curl -s "$BASE_URL/boats/$boat_id" | jq)
rate_willing_to_pay=$(echo "$boat_response" | jq -r '.rateWillingToPay // empty')

# Validate boat details
if [ -z "$rate_willing_to_pay" ]; then
  echo "Error: Missing or invalid boat details."
  echo "$boat_response"
  exit 1
fi

# Calculate trip duration in hours
start_seconds=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$(echo "$start_time" | sed 's/Z//')" "+%s")
end_seconds=$(date -j -f "%Y-%m-%dT%H:%M:%S%z" "$(echo "$end_time" | sed 's/Z//')" "+%s")
duration_seconds=$((end_seconds - start_seconds))
duration_hours=$(echo "scale=2; $duration_seconds / 3600" | bc)

# Calculate earnings
captain_earnings=$(echo "scale=2; $rate_per_hour * $duration_hours" | bc)
owner_revenue=$(echo "scale=2; $rate_willing_to_pay * $duration_hours" | bc)

# Deduct platform fees
captain_fee=$(echo "scale=2; $captain_earnings * 0.08" | bc)
owner_fee=$(echo "scale=2; $owner_revenue * 0.13" | bc)

# Net earnings
net_captain_earnings=$(echo "scale=2; $captain_earnings - $captain_fee" | bc)
net_owner_revenue=$(echo "scale=2; $owner_revenue - $owner_fee" | bc)

# Platform revenue
platform_revenue=$(echo "scale=2; $captain_fee + $owner_fee" | bc)

# Output results
echo "Revenue Analytics:"
echo "-------------------"
echo "Trip Duration: $duration_hours hours"
echo "Captain's Earnings Before Fee: \$$captain_earnings"
echo "Captain's Booking Fee (8%): \$$captain_fee"
echo "Net Captain's Earnings: \$$net_captain_earnings"
echo "Owner's Revenue Before Fee: \$$owner_revenue"
echo "Owner's Booking Fee (13%): \$$owner_fee"
echo "Net Owner's Revenue: \$$net_owner_revenue"
echo "Platform Revenue: \$$platform_revenue"
