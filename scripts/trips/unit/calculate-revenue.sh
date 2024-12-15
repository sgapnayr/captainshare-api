#!/bin/bash

# Accepting user input for trip ID
read -p "Enter Trip ID: " TRIP_ID

# Send the request to get the trip details
TRIP_DETAILS=$(curl -s -X GET "http://localhost:3000/trips/$TRIP_ID" \
  -H "Content-Type: application/json")

# Extract and display the values from the response
CAPTAIN_EARNINGS=$(echo $TRIP_DETAILS | jq '.financialDetails.netCaptainEarnings')
PLATFORM_REVENUE=$(echo $TRIP_DETAILS | jq '.financialDetails.platformRevenue')
OWNER_COST=$(echo $TRIP_DETAILS | jq '.financialDetails.totalCostToOwner')

# Display the calculated values
echo "Captain Earnings: $CAPTAIN_EARNINGS"
echo "Platform Revenue: $PLATFORM_REVENUE"
echo "Owner Costs: $OWNER_COST"
