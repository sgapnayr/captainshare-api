#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Attempt to book a captain without certifications
echo "Attempting to create a Trip with wrong certifications..."
wrong_cert_response=$(curl -s -X POST "$BASE_URL/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "boatId": "boat123",
    "captainId": "captain_without_cert",
    "ownerId": "owner123",
    "startTime": "2024-12-17T09:00:00.000Z",
    "endTime": "2024-12-17T12:00:00.000Z",
    "status": "PENDING"
  }' | jq)
echo "$wrong_cert_response"
