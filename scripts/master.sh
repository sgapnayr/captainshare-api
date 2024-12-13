#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Welcome to the Trip Management Workflow ==="

# Step 1: Owner Sign-Up
echo "=== Step 1: Owner Sign-Up ==="
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

ownerResponse=$(curl -s -X POST "$BASE_URL/users" \
-H "Content-Type: application/json" \
-d "$ownerPayload")
ownerId=$(echo "$ownerResponse" | jq -r '.id')

if [ "$ownerId" != "null" ]; then
  echo "Owner Created Successfully (ID: $ownerId)"
else
  echo "Failed to Create Owner. Full Response:"
  echo "$ownerResponse"
  exit 1
fi
echo ""

# Step 2: Captain Sign-Up
echo "=== Step 2: Captain Sign-Up ==="
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

captainResponse=$(curl -s -X POST "$BASE_URL/users" \
-H "Content-Type: application/json" \
-d "$captainPayload")
captainId=$(echo "$captainResponse" | jq -r '.id')

if [ "$captainId" != "null" ]; then
  echo "Captain Created Successfully (ID: $captainId)"
else
  echo "Failed to Create Captain."
  exit 1
fi
echo ""

# Step 3: Owner Posts a Boat
echo "=== Step 3: Owner Posts a Boat ==="
boatPayload=$(
  cat <<EOF
{
  "name": "Fishing Boat",
  "type": "Fishing",
  "capacity": 6,
  "location": "Miami",
  "licenseRequired": ["USCG"],
  "captainShareCertificationsRequired": ["SafetyTraining"],
  "ownerIds": ["$ownerId"],
  "rateWillingToPay": 100,
  "make": "Yamaha",
  "model": "FX Cruiser",
  "year": 2021,
  "color": "Blue"
}
EOF
)

boatResponse=$(curl -s -X POST "$BASE_URL/boats" \
-H "Content-Type: application/json" \
-d "$boatPayload")
boatId=$(echo "$boatResponse" | jq -r '.id')

if [ "$boatId" != "null" ]; then
  echo "Boat Posted Successfully (ID: $boatId)"
else
  echo "Failed to Post Boat. Full Response:"
  echo "$boatResponse" | jq .
  exit 1
fi
echo ""

# Step 4: List Captains in the Location
echo "=== Step 4: List Captains in the Location ==="
filterPayload=$(
  cat <<EOF
{
  "captainCertifications": ["SafetyTraining"],
  "captainLicenses": ["USCG"],
  "location": "Miami"
}
EOF
)

captainsListResponse=$(curl -s -X POST "$BASE_URL/boats/filter" \
-H "Content-Type: application/json" \
-d "$filterPayload")
echo "Available Captains in Location (Formatted):"
echo "$captainsListResponse" | jq .
echo ""

# Step 5: Assign Captain to Boat and Create a Trip
echo "=== Step 5: Assign Captain to Boat and Create a Trip ==="
tripPayload=$(
  cat <<EOF
{
  "name": "Fishing Adventure",
  "tripType": "OWNER_TRIP",
  "durationHours": 4,
  "captainRate": 75,
  "ownerId": "$ownerId",
  "captainId": "$captainId",
  "location": "Miami",
  "boatId": "$boatId"
}
EOF
)

tripResponse=$(curl -s -X POST "$BASE_URL/trips" \
-H "Content-Type: application/json" \
-d "$tripPayload")
tripId=$(echo "$tripResponse" | jq -r '.id')

if [ "$tripId" != "null" ]; then
  echo "Trip Created Successfully (ID: $tripId)"
else
  echo "Failed to Create Trip."
  exit 1
fi
echo ""

# Step 6: Update Trip to Ongoing
echo "=== Step 6: Update Trip to Ongoing ==="
updateToOngoingPayload='{"status": "ONGOING"}'

updateOngoingResponse=$(curl -s -X PATCH "$BASE_URL/trips/$tripId" \
-H "Content-Type: application/json" \
-d "$updateToOngoingPayload")
echo "Trip Updated to Ongoing:"
echo "$updateOngoingResponse" | jq .
echo ""

# Step 7: Update Trip to Completed
echo "=== Step 7: Update Trip to Completed ==="
updateToCompletedPayload='{"status": "COMPLETED"}'

updateCompletedResponse=$(curl -s -X PATCH "$BASE_URL/trips/$tripId" \
-H "Content-Type: application/json" \
-d "$updateToCompletedPayload")
echo "Trip Updated to Completed:"
echo "$updateCompletedResponse" | jq .
echo ""

# Step 8: Leave a Review
echo "=== Step 8: Leave a Review ==="
reviewPayload=$(
  cat <<EOF
{
  "tripId": "$tripId",
  "reviewerId": "$ownerId",
  "rating": 5,
  "comments": "Great experience with the captain and the trip!"
}
EOF
)

reviewResponse=$(curl -s -X POST "$BASE_URL/reviews" \
-H "Content-Type: application/json" \
-d "$reviewPayload")
echo "Review Submitted:"
echo "$reviewResponse" | jq .
echo ""

# Step 9: Revenue Sharing
echo "=== Step 9: Revenue Sharing ==="
revenuePayload=$(
  cat <<EOF
{
  "tripId": "$tripId"
}
EOF
)

revenueResponse=$(curl -s -X POST "$BASE_URL/revenue/share" \
-H "Content-Type: application/json" \
-d "$revenuePayload")
echo "Revenue Shared:"
echo "$revenueResponse" | jq .
echo ""

echo "=== Workflow Completed Successfully ==="
