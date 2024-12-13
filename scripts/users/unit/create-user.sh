#!/bin/bash

BASE_URL="http://localhost:3000/users"

echo "=== Creating Two Unique Users ==="

# Payload for the OWNER
ownerPayload=$(
  cat <<EOF
{
  "firstName": "OwnerFirstName",
  "lastName": "OwnerLastName",
  "email": "owner@example.com",
  "phoneNumber": "1234567890",
  "role": "OWNER",
  "certifications": []
}
EOF
)

# Payload for the CAPTAIN
captainPayload=$(
  cat <<EOF
{
  "firstName": "CaptainFirstName",
  "lastName": "CaptainLastName",
  "email": "captain@example.com",
  "phoneNumber": "0987654321",
  "role": "CAPTAIN",
  "ratePerHour": 75,
  "certifications": ["SafetyTraining", "FirstAid"],
  "availability": [
    {
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ],
  "userLocation": "Miami"
}
EOF
)

# Create OWNER
echo "Creating OWNER user..."
ownerResponse=$(curl -s -X POST "$BASE_URL" \
-H "Content-Type: application/json" \
-d "$ownerPayload")

if echo "$ownerResponse" | jq . > /dev/null 2>&1; then
  echo "OWNER created successfully (Formatted):"
  echo "$ownerResponse" | jq .
else
  echo "Failed to create OWNER. Response:"
  echo "$ownerResponse"
fi

echo ""

# Create CAPTAIN
echo "Creating CAPTAIN user..."
captainResponse=$(curl -s -X POST "$BASE_URL" \
-H "Content-Type: application/json" \
-d "$captainPayload")

if echo "$captainResponse" | jq . > /dev/null 2>&1; then
  echo "CAPTAIN created successfully (Formatted):"
  echo "$captainResponse" | jq .
else
  echo "Failed to create CAPTAIN. Response:"
  echo "$captainResponse"
fi

echo ""
echo "=== User Creation Completed ==="
