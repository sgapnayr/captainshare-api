#!/bin/bash

# Define the API endpoint
API_URL="http://localhost:3000/users"

# Prompt for User ID
read -p "Enter the User ID to add availability to: " USER_ID
if [ -z "$USER_ID" ]; then
  echo "User ID is required."
  exit 1
fi

# Prompt for availability details
read -p "Enter the day (e.g., Monday): " DAY
if [ -z "$DAY" ]; then
  echo "Day is required."
  exit 1
fi

read -p "Enter the start time (e.g., 09:00): " START_TIME
if [ -z "$START_TIME" ]; then
  echo "Start time is required."
  exit 1
fi

read -p "Enter the end time (e.g., 17:00): " END_TIME
if [ -z "$END_TIME" ]; then
  echo "End time is required."
  exit 1
fi

# Construct the JSON payload
JSON_PAYLOAD=$(jq -n \
  --arg day "$DAY" \
  --arg startTime "$START_TIME" \
  --arg endTime "$END_TIME" \
  '{day: $day, startTime: $startTime, endTime: $endTime}')

# Display the payload to the user for confirmation
echo "The following availability will be added:"
echo "$JSON_PAYLOAD" | jq .
read -p "Proceed with adding availability? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Operation canceled."
  exit 0
fi

# Send the POST request
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/$USER_ID/availability" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Separate the response body and status code
BODY=$(echo "$RESPONSE" | head -n -1)
STATUS=$(echo "$RESPONSE" | tail -n 1)

# Handle the response
if [ "$STATUS" -eq 200 ]; `then`
  echo "Availability added successfully. Response:"
  echo "$BODY" | jq .
elif [ "$STATUS" -eq 404 ]; then
  echo "Error: User not found."
elif [ "$STATUS" -eq 400 ]; then
  echo "Error: Bad request. Please check the input data."
else
  echo "Error: Unexpected response (HTTP $STATUS)."
  echo "Response body:"
  echo "$BODY" | jq .
fi