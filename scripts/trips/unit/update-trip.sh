#!/bin/bash

# Accepting user input for trip ID and status
read -p "Enter Trip ID: " TRIP_ID
echo "Updating trip status to 'Group On'..."
STATUS="GROUP_ON"

# Create the update payload
UPDATE_PAYLOAD=$(cat <<EOF
{
  "status": "$STATUS"
}
EOF
)

# Send the request to update the trip status
UPDATE_RESPONSE=$(curl -s -X PATCH "http://localhost:3000/trips/$TRIP_ID/status" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

# Format the response using jq
echo "$UPDATE_RESPONSE" | jq .

# Now updating to "Completed"
STATUS="COMPLETED"
UPDATE_PAYLOAD=$(cat <<EOF
{
  "status": "$STATUS"
}
EOF
)

# Send the request to update the trip status to "Completed"
UPDATE_RESPONSE=$(curl -s -X PATCH "http://localhost:3000/trips/$TRIP_ID/status" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

# Format the response using jq
echo "$UPDATE_RESPONSE" | jq .
