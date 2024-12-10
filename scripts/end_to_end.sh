#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Owner and Captain IDs
owner_id="owner123"
captain_id="captain123"
boat_id="boat123"

# Create a Trip
echo "Creating a Trip..."
trip_response=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d "{
    \"boatId\": \"$boat_id\",
    \"captainId\": \"$captain_id\",
    \"ownerId\": \"$owner_id\",
    \"startTime\": \"2024-12-17T09:00:00.000Z\",
    \"endTime\": \"2024-12-17T12:00:00.000Z\",
    \"status\": \"PENDING\"
  }" | jq)

# Extract trip ID from response
trip_id=$(echo "$trip_response" | jq -r '.id')
echo "Trip ID: $trip_id"

# Check if trip_id was successfully extracted
if [ -z "$trip_id" ] || [ "$trip_id" == "null" ]; then
  echo "Error: Failed to create trip or extract trip ID."
  exit 1
fi

# Update Trip Status to ONGOING
echo "Updating Trip Status to ONGOING..."
update_response=$(curl -s -X PATCH "$BASE_URL/trips/$trip_id" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ONGOING"
  }' | jq)
echo "$update_response"

# Update Trip Status to COMPLETED
echo "Updating Trip Status to COMPLETED..."
complete_response=$(curl -s -X PATCH "$BASE_URL/trips/$trip_id" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }' | jq)
echo "$complete_response"

# Post a Review for the Trip
echo "Posting a Review for the Trip..."
review_response=$(curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d "{
    \"tripId\": \"$trip_id\",
    \"reviewerId\": \"$owner_id\",
    \"revieweeId\": \"$captain_id\",
    \"rating\": 5,
    \"comment\": \"Great trip! Captain was excellent.\"
  }" | jq)
echo "$review_response"
