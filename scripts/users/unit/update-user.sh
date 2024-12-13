#!/bin/bash

BASE_URL="http://localhost:3000/users"

echo "=== Updating Two Users ==="

# Hardcoded updates for OWNER
ownerId="1734074861806" # Replace with the actual OWNER user ID
ownerUpdatePayload=$(
  cat <<EOF
{
  "email": "updated.owner@example.com",
  "phoneNumber": "5555555555",
  "certifications": []
}
EOF
)

# Hardcoded updates for CAPTAIN
captainId="67890" # Replace with the actual CAPTAIN user ID
captainUpdatePayload=$(
  cat <<EOF
{
  "email": "updated.captain@example.com",
  "phoneNumber": "4444444444",
  "certifications": ["UpdatedCertification"],
  "availability": [
    {
      "day": "Tuesday",
      "startTime": "10:00",
      "endTime": "18:00"
    }
  ],
  "userLocation": "UpdatedLocation"
}
EOF
)

# Update OWNER
echo "Updating OWNER with ID: $ownerId..."
ownerResponse=$(curl -s -X PATCH "$BASE_URL/$ownerId" \
-H "Content-Type: application/json" \
-d "$ownerUpdatePayload")

if echo "$ownerResponse" | jq . > /dev/null 2>&1; then
  echo "OWNER update response (Formatted):"
  echo "$ownerResponse" | jq .
else
  echo "Failed to update OWNER. Response:"
  echo "$ownerResponse"
fi

echo ""

# Update CAPTAIN
echo "Updating CAPTAIN with ID: $captainId..."
captainResponse=$(curl -s -X PATCH "$BASE_URL/$captainId" \
-H "Content-Type: application/json" \
-d "$captainUpdatePayload")

if echo "$captainResponse" | jq . > /dev/null 2>&1; then
  echo "CAPTAIN update response (Formatted):"
  echo "$captainResponse" | jq .
else
  echo "Failed to update CAPTAIN. Response:"
  echo "$captainResponse"
fi

echo ""
echo "=== Update Completed ==="
