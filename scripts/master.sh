#!/bin/bash

# Function to pause and prompt user to continue
pause(){
  echo "Next, we will proceed to the next step."
  read -p "Press any key to continue..."
}

# Step 1: Create the owner.
echo "This step we are simulating the creation of a boat owner in the system."
read -p "Press any key to continue..."

echo "Step 1: Sign up the owner (create owner)"
OWNER_RESPONSE=$(curl -s -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Brad",
    "lastName": "Smith",
    "email": "brad.smith@gmail.com",
    "phoneNumber": "+123456789",
    "roles": ["OWNER"],
    "isGovernmentIdVerified": true,
    "isEmailVerified": true,
    "onboardingComplete": true,
    "createdAt": "2024-12-14T00:00:00.000Z",
    "updatedAt": "2024-12-14T00:00:00.000Z"
  }')

# Show the owner creation payload
echo "Owner created:"
echo "$OWNER_RESPONSE" | jq .

# Extract the owner ID from the response
OWNER_ID=$(echo "$OWNER_RESPONSE" | jq -r '.id')

# Pause for user input
pause

echo "Owner ID extracted: $OWNER_ID"

# Step 2: Post a boat for the owner.
echo "This step we are simulating the creation of a boat for the owner."
read -p "Press any key to continue..."

echo "Step 2: Post a boat (create boat for owner)"
BOAT_RESPONSE=$(curl -s -X POST "http://localhost:3000/boats" \
  -H "Content-Type: application/json" \
  -d '{
    "ownerIds": ["'$OWNER_ID'"],
    "name": "Mimosa",
    "type": "Pontoon",
    "capacity": 6,
    "location": "Lake Austin",
    "licenseRequired": ["MM", "PBO"],
    "captainShareCertificationsRequired": ["Certification A", "Certification B"],
    "rateWillingToPay": 55,
    "make": "Bentley",
    "model": "2018",
    "year": 2018,
    "color": "Maroon",
    "hin": "BENT-2018-XYZ123",
    "motorDetails": "140 HP",
    "commercialUse": false,
    "createdAt": "2024-12-14T00:00:00.000Z",
    "updatedAt": "2024-12-14T00:00:00.000Z"
  }')

# Show the boat creation payload
echo "Boat created:"
echo "$BOAT_RESPONSE" | jq .

# Extract boat ID from the response
BOAT_ID=$(echo "$BOAT_RESPONSE" | jq -r '.id')

# Pause for user input
pause

echo "Boat ID extracted: $BOAT_ID"

# Step 3: Fetch available captains (simulated)
echo "This step we are simulating the creation of 3 captains and fetching them."
read -p "Press any key to continue..."

# Generate 3 captains
CAPTAIN_1=$(curl -s -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Captain A",
    "lastName": "Smith",
    "email": "captainA@example.com",
    "phoneNumber": "+1234567890",
    "roles": ["CAPTAIN"],
    "isGovernmentIdVerified": true,
    "isEmailVerified": true,
    "onboardingComplete": true,
    "ratePerHour": 50,
    "availability": [{"day": "Monday", "startTime": "09:00", "endTime": "12:00"}],
    "certifications": ["Certification A"],
    "createdAt": "2024-12-14T00:00:00.000Z",
    "updatedAt": "2024-12-14T00:00:00.000Z"
  }')

CAPTAIN_2=$(curl -s -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Captain B",
    "lastName": "Johnson",
    "email": "captainB@example.com",
    "phoneNumber": "+1234567891",
    "roles": ["CAPTAIN"],
    "isGovernmentIdVerified": true,
    "isEmailVerified": true,
    "onboardingComplete": true,
    "ratePerHour": 60,
    "availability": [{"day": "Tuesday", "startTime": "10:00", "endTime": "14:00"}],
    "certifications": ["Certification B"],
    "createdAt": "2024-12-14T00:00:00.000Z",
    "updatedAt": "2024-12-14T00:00:00.000Z"
  }')

CAPTAIN_3=$(curl -s -X POST "http://localhost:3000/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Captain C",
    "lastName": "Williams",
    "email": "captainC@example.com",
    "phoneNumber": "+1234567892",
    "roles": ["CAPTAIN"],
    "isGovernmentIdVerified": true,
    "isEmailVerified": true,
    "onboardingComplete": true,
    "ratePerHour": 55,
    "availability": [{"day": "Wednesday", "startTime": "08:00", "endTime": "12:00"}],
    "certifications": ["Certification C"],
    "createdAt": "2024-12-14T00:00:00.000Z",
    "updatedAt": "2024-12-14T00:00:00.000Z"
  }')

# Show the captains creation payloads
echo "Captains created:"
echo "$CAPTAIN_1" | jq .
echo "$CAPTAIN_2" | jq .
echo "$CAPTAIN_3" | jq .

# Extract captain IDs from the response
CAPTAIN_1_ID=$(echo "$CAPTAIN_1" | jq -r '.id')
CAPTAIN_2_ID=$(echo "$CAPTAIN_2" | jq -r '.id')
CAPTAIN_3_ID=$(echo "$CAPTAIN_3" | jq -r '.id')

# Pause for user input
pause

echo "Captains IDs extracted: $CAPTAIN_1_ID, $CAPTAIN_2_ID, $CAPTAIN_3_ID"

# Step 4: Select a captain
echo "This step we are simulating selecting a captain for the trip."
read -p "Press any key to continue..."

# Choose a captain (hardcoded for simplicity)
CHOSEN_CAPTAIN_ID=$CAPTAIN_2_ID
echo "Chosen Captain: Captain B with rate \$60/hr"

# Pause for user input
pause

# Step 5: Create a trip proposal
echo "This step we are simulating creating a trip proposal."
read -p "Press any key to continue..."

# Create trip proposal
TRIP_RESPONSE=$(curl -s -X POST "http://localhost:3000/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": "'$OWNER_ID'",
    "boatId": "'$BOAT_ID'",
    "captainId": "'$CHOSEN_CAPTAIN_ID'",
    "timing": {
      "startTime": "2024-12-15T09:00:00.000Z",
      "endTime": "2024-12-15T13:00:00.000Z",
      "durationHours": 4
    },
    "bookingType": "OWNER_TRIP",
    "location": {
      "latitude": 25.7617,
      "longitude": -80.1918
    },
    "financialDetails": {
      "captainRate": 55,
      "captainEarnings": 220,
      "ownerRevenue": 0,
      "captainFee": 44,
      "ownerFee": 22,
      "netCaptainEarnings": 176,
      "netOwnerRevenue": 0,
      "platformRevenue": 66,
      "totalCostToOwner": 242
    }
  }')

# Show the trip creation payload
echo "Trip proposal created:"
echo "$TRIP_RESPONSE" | jq .

# Extract trip ID from response
TRIP_ID=$(echo "$TRIP_RESPONSE" | jq -r '.id')

# Pause for user input
pause

# Step 6: Captain accepts the trip (simulated)
echo "This step we are simulating a captain accepting a trip 'ACCEPTED'."
read -p "Press any key to continue..."

# Update trip status to 'ACCEPTED'
TRIP_ACCEPTED_RESPONSE=$(curl -s -X PATCH "http://localhost:3000/trips/$TRIP_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACCEPTED"
  }')

# Show the updated trip status
echo "Trip status updated to 'ACCEPTED':"
echo "$TRIP_ACCEPTED_RESPONSE" | jq .

# Pause for user input
pause

# Step 7: Update trip status to 'COMPLETED'
echo "This step we are simulating updating the trip status to 'COMPLETED'."
read -p "Press any key to continue..."

# Update trip status to 'COMPLETED'
TRIP_COMPLETED_RESPONSE=$(curl -s -X PATCH "http://localhost:3000/trips/$TRIP_ID/status" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }')

# Show the updated trip status
echo "Trip status updated to 'COMPLETED':"
echo "$TRIP_COMPLETED_RESPONSE" | jq .

# Pause for user input
pause

# Step 8: Display financial details of the trip
echo "This step we are simulating displaying the financial details for the trip."
read -p "Press any key to continue..."

# Fetch and display financial details for the trip
TRIP_DETAILS=$(curl -s -X GET "http://localhost:3000/trips/$TRIP_ID")
echo "Trip financial details:"
echo "$TRIP_DETAILS" | jq .

# Process complete
echo "Process complete."
