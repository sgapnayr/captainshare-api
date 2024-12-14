#!/bin/bash

# API URL
API_URL="http://localhost:3000/users"

# Get user ID
read -p "Enter user ID to delete: " USER_ID

# Make API request
curl -X DELETE "$API_URL/$USER_ID" | jq .

echo -e "\nUser deleted (soft delete)." | jq .
