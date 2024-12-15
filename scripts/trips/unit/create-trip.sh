#!/bin/bash

# Prompt for user inputs (optional, for dynamic data)
read -p "Enter Owner ID: " OWNER_ID
read -p "Enter Boat ID: " BOAT_ID
read -p "Enter Start Time (e.g., 2024-12-15T09:00:00.000Z): " START_TIME
read -p "Enter End Time (e.g., 2024-12-15T13:00:00.000Z): " END_TIME
read -p "Enter Latitude: " LATITUDE
read -p "Enter Longitude: " LONGITUDE
read -p "Enter Captain Rate (e.g., 55): " CAPTAIN_RATE

# Calculate durationHours
START_DATE=$(date -d "$START_TIME" +%s)
END_DATE=$(date -d "$END_TIME" +%s)
DURATION_HOURS=$(( (END_DATE - START_DATE) / 3600 ))

# Define the trip data payload
TRIP_PAYLOAD=$(cat <<EOF
{
  "ownerId": "$OWNER_ID",
  "boatId": "$BOAT_ID",
  "timing": {
    "startTime": "$START_TIME",
    "endTime": "$END_TIME",
    "durationHours": $DURATION_HOURS
  },
  "bookingType": "OWNER_TRIP",
  "location": {
    "latitude": $LATITUDE,
    "longitude": $LONGITUDE
  },
  "financialDetails": {
    "captainRate": $CAPTAIN_RATE,
    "captainEarnings": $(($CAPTAIN_RATE * $DURATION_HOURS)),
    "ownerRevenue": 0,
    "captainFee": $(($CAPTAIN_RATE * $DURATION_HOURS / 5)),  # Example fee calculation
    "ownerFee": $(($CAPTAIN_RATE * $DURATION_HOURS / 10)),  # Example fee calculation
    "netCaptainEarnings": $(($CAPTAIN_RATE * $DURATION_HOURS - $CAPTAIN_RATE * $DURATION_HOURS / 5)),
    "netOwnerRevenue": 0,
    "platformRevenue": $(($CAPTAIN_RATE * $DURATION_HOURS / 5 + $CAPTAIN_RATE * $DURATION_HOURS / 10)),
    "totalCostToOwner": $(($CAPTAIN_RATE * $DURATION_HOURS + $CAPTAIN_RATE * $DURATION_HOURS / 10))
  }
}
EOF
)

# Make the POST request with the payload
curl -X POST "http://localhost:3000/trips" \
  -H "Content-Type: application/json" \
  -d "$TRIP_PAYLOAD" | jq .
