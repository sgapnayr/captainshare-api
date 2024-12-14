#!/bin/bash

# API URL
API_URL="http://localhost:3000/users"

# Get user ID and role
read -p "Enter user ID: " USER_ID
read -p "Enter role to add (CAPTAIN/OWNER): " ROLE

# Make API request
curl -X PATCH "$API_URL/$USER_ID/roles/add" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'"$ROLE"'"
  }' | jq .

echo -e "\nRole added to user." | jq .
