#!/bin/bash

# API URL
API_URL="http://localhost:3000/users"

# User data (modify as needed)
read -p "Enter first name: " FIRST_NAME
read -p "Enter last name: " LAST_NAME
read -p "Enter email: " EMAIL
read -p "Enter phone number: " PHONE_NUMBER
read -p "Enter roles (e.g., CAPTAIN,OWNER): " ROLES

# Make API request
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "'"$FIRST_NAME"'",
    "lastName": "'"$LAST_NAME"'",
    "email": "'"$EMAIL"'",
    "phoneNumber": "'"$PHONE_NUMBER"'",
    "roles": ["'"${ROLES//,/\",\"}"'"]
  }' | jq .

echo -e "\nUser created." | jq .
