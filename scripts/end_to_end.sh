#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Sign up Captain
echo "=== SIGNING UP CAPTAIN ==="
captain_response=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "123-456-7890",
    "role": "CAPTAIN",
    "ratePerHour": 55,
    "certifications": ["USCG"],
    "availability": [{"day": "Sunday", "startTime": "08:00", "endTime": "18:00"}]
  }' | jq)
echo "$captain_response"
captain_id=$(echo "$captain_response" | jq -r '.id')

# Sign up Owner
echo "=== SIGNING UP OWNER ==="
owner_response=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "987-654-3210",
    "role": "OWNER"
  }' | jq)
echo "$owner_response"
owner_id=$(echo "$owner_response" | jq -r '.id')

# Post a Boat
echo "=== POSTING A BOAT ==="
boat_response=$(curl -s -X POST "$BASE_URL/boats" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Sea Breeze\",
    \"type\": \"Yacht\",
    \"capacity\": 10,
    \"location\": \"Miami\",
    \"licenseRequired\": [\"USCG\"],
    \"certificationsRequired\": [\"AdvancedSailing\"],
    \"ownerIds\": [\"$owner_id\"],
    \"rateWillingToPay\": 695
  }" | jq)
echo "$boat_response"
boat_id=$(echo "$boat_response" | jq -r '.id')

# Create a Trip
echo "=== CREATING A TRIP ==="
trip_response=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{
    \"boatId\": \"$boat_id\",
    \"captainId\": \"$captain_id\",
    \"ownerId\": \"$owner_id\",
    \"startTime\": \"2024-12-17T09:00:00.000Z\",
    \"endTime\": \"2024-12-17T12:00:00.000Z\",
    \"status\": \"PENDING\",
    \"durationHours\": 3,
    \"captainEarnings\": 165,
    \"ownerRevenue\": 630,
    \"captainFee\": 13.20,
    \"ownerFee\": 81.90,
    \"netCaptainEarnings\": 151.80,
    \"netOwnerRevenue\": 548.10,
    \"platformRevenue\": 95.10
  }" | jq)
echo "$trip_response"
trip_id=$(echo "$trip_response" | jq -r '.id')


# Update Trip Status to ONGOING
echo "=== UPDATING TRIP STATUS TO ONGOING ==="
curl -s -X PATCH "$BASE_URL/trips/$trip_id" \
  -H "Content-Type: application/json" \
  -d '{"status": "ONGOING"}' | jq

# Update Trip Status to COMPLETED
echo "=== UPDATING TRIP STATUS TO COMPLETED ==="
curl -s -X PATCH "$BASE_URL/trips/$trip_id" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED"}' | jq

# Post a Review
echo "=== POSTING A REVIEW ==="
curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d "{
    \"tripId\": \"$trip_id\",
    \"reviewerId\": \"$owner_id\",
    \"revieweeId\": \"$captain_id\",
    \"rating\": 5,
    \"comment\": \"Great trip! Captain was excellent.\"
  }" | jq

# Fetch Revenue Data
echo "=== FETCHING TRIP DETAILS ==="
trip_details=$(curl -s "$BASE_URL/trips/$trip_id" | jq)
echo "$trip_details"

# Output Revenue Analytics
duration_hours=$(echo "$trip_details" | jq -r '.durationHours')
captain_earnings=$(echo "$trip_details" | jq -r '.captainEarnings')
net_captain_earnings=$(echo "$trip_details" | jq -r '.netCaptainEarnings')
owner_revenue=$(echo "$trip_details" | jq -r '.ownerRevenue')
net_owner_revenue=$(echo "$trip_details" | jq -r '.netOwnerRevenue')
platform_revenue=$(echo "$trip_details" | jq -r '.platformRevenue')

echo "Revenue Analytics:"
echo "Trip Duration: $duration_hours hours"
echo "Captain's Earnings: \$$captain_earnings"
echo "Net Captain Earnings: \$$net_captain_earnings"
echo "Owner's Revenue: \$$owner_revenue"
echo "Net Owner Revenue: \$$net_owner_revenue"
echo "Platform Revenue: \$$platform_revenue"
