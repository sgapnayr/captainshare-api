#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Captain signup
echo "Signing up Captain..."
captain_response=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "123-456-7890",
    "role": "CAPTAIN",
    "ratePerHour": 50,
    "certifications": ["USCG"],
    "availability": [
      { "day": "Sunday", "startTime": "08:00", "endTime": "18:00" }
    ]
  }' | jq)
echo "$captain_response"
