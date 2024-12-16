#!/bin/bash

# Hardcoded trip details
OWNER_ID="123"
BOAT_ID="123"
START_TIME="2024-12-15T09:00:00.000Z"
END_TIME="2024-12-15T13:00:00.000Z"
LATITUDE=2
LONGITUDE=1
CAPTAIN_RATE=55

# Calculate durationHours (4 hours in this case)
DURATION_HOURS=4

# Hardcoded financial calculations
CAPTAIN_EARNINGS=$(($CAPTAIN_RATE * $DURATION_HOURS))
CAPTAIN_FEE=$(($CAPTAIN_EARNINGS / 5))  # Example fee calculation
OWNER_FEE=$(($CAPTAIN_EARNINGS / 10))   # Example fee calculation
NET_CAPTAIN_EARNINGS=$(($CAPTAIN_EARNINGS - $CAPTAIN_FEE))
PLATFORM_REVENUE=$(($CAPTAIN_FEE + $OWNER_FEE))
TOTAL_COST_TO_OWNER=$(($CAPTAIN_EARNINGS + $OWNER_FEE))

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
    "captainEarnings": $CAPTAIN_EARNINGS,
    "ownerRevenue": 0,
    "captainFee": $CAPTAIN_FEE,
    "ownerFee": $OWNER_FEE,
    "netCaptainEarnings": $NET_CAPTAIN_EARNINGS,
    "netOwnerRevenue": 0,
    "platformRevenue": $PLATFORM_REVENUE,
    "totalCostToOwner": $TOTAL_COST_TO_OWNER
  }
}
EOF
)

# Make the POST request with the hardcoded payload
curl -X POST "http://localhost:3000/trips" \
  -H "Content-Type: application/json" \
  -d "$TRIP_PAYLOAD" | jq .
