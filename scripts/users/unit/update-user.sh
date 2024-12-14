#!/bin/bash

# Define the API endpoint
API_URL="http://localhost:3000/users"

# Prompt for User ID
read -p "Enter the User ID to update: " USER_ID
if [ -z "$USER_ID" ]; then
  echo "User ID is required."
  exit 1
fi

# Prompt for fields to update
echo "Enter the fields you want to update (leave blank to skip):"

read -p "First Name: " FIRST_NAME
read -p "Last Name: " LAST_NAME
read -p "Phone Number: " PHONE_NUMBER
read -p "Email: " EMAIL
read -p "Roles (comma-separated, e.g., CAPTAIN,OWNER): " ROLES

# Construct the JSON payload
JSON_PAYLOAD="{"
if [ ! -z "$FIRST_NAME" ]; then
  JSON_PAYLOAD+="\"firstName\": \"$FIRST_NAME\","
fi
if [ ! -z "$LAST_NAME" ]; then
  JSON_PAYLOAD+="\"lastName\": \"$LAST_NAME\","
fi
if [ ! -z "$PHONE_NUMBER" ]; then
  JSON_PAYLOAD+="\"phoneNumber\": \"$PHONE_NUMBER\","
fi
if [ ! -z "$EMAIL" ]; then
  JSON_PAYLOAD+="\"email\": \"$EMAIL\","
fi
if [ ! -z "$ROLES" ]; then
  JSON_PAYLOAD+="\"roles\": [$(echo $ROLES | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],"
fi
# Remove the trailing comma and close the JSON
JSON_PAYLOAD=$(echo "$JSON_PAYLOAD" | sed 's/,$//')
JSON_PAYLOAD+="}"

# Display the payload to the user for confirmation
echo "The following payload will be sent:"
echo "$JSON_PAYLOAD" | jq .
read -p "Proceed with the update? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
  echo "Update canceled."
  exit 0
fi

# Send the PATCH request
RESPONSE=$(curl -s -o /tmp/response.json -w "%{http_code}" -X PATCH "$API_URL/$USER_ID" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Check the response status
if [ "$RESPONSE" -eq 200 ]; then
  echo "User updated successfully. Response:"
  cat /tmp/response.json | jq .
elif [ "$RESPONSE" -eq 404 ]; then
  echo "Error: User not found. Response:"
  cat /tmp/response.json | jq .
elif [ "$RESPONSE" -eq 400 ]; then
  echo "Error: Bad request. Please check the input data. Response:"
  cat /tmp/response.json | jq .
else
  echo "Error: Unexpected response (HTTP $RESPONSE). Response:"
  cat /tmp/response.json | jq .
fi

# Clean up
rm -f /tmp/response.json
