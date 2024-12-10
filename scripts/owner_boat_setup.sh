#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Owner signup
echo "Signing up Owner..."
owner_response=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "987-654-3210",
    "role": "OWNER"
  }' | jq)
echo "$owner_response"

# Extract Owner ID
owner_id=$(echo "$owner_response" | jq -r '.id')

# Post a boat
echo "Posting a Boat..."
boat_response=$(curl -s -X POST "$BASE_URL/boats" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Sea Breeze\",
    \"type\": \"Yacht\",
    \"capacity\": 10,
    \"location\": \"Miami\",
    \"licenseRequired\": [\"USCG\"],
    \"certificationsRequired\": [\"AdvancedSailing\"],
    \"ownerIds\": [\"$owner_id\"],
    \"rateWillingToPay\": 80
  }" | jq)
echo "$boat_response"
