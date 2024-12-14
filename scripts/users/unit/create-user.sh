#!/bin/bash

BASE_URL="http://localhost:3000/users"

echo "=== User Creation Script ==="

# Function to get user input
get_user_input() {
  local label="$1"
  local var
  read -p "$label: " var
  echo "$var"
}

# Function to create a user
create_user() {
  local payload="$1"
  local role="$2"

  echo "Creating $role user..."
  response=$(curl -s -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "$payload")

  if echo "$response" | jq . > /dev/null 2>&1; then
    echo "$role created successfully (Formatted):"
    echo "$response" | jq .
  else
    echo "Failed to create $role. Response:"
    echo "$response"
  fi
}

# Ask if the user is a Captain or Owner
userRole=$(get_user_input "Are you creating a Captain or an Owner? (Type 'Captain' or 'Owner')")

if [[ "$userRole" == "Owner" || "$userRole" == "owner" ]]; then
  # Get input for the OWNER
  echo "Enter details for the OWNER:"
  ownerFirstName=$(get_user_input "First Name")
  ownerLastName=$(get_user_input "Last Name")
  ownerEmail=$(get_user_input "Email")
  ownerPhoneNumber=$(get_user_input "Phone Number")

  ownerPayload=$(
    cat <<EOF
{
  "firstName": "$ownerFirstName",
  "lastName": "$ownerLastName",
  "email": "$ownerEmail",
  "phoneNumber": "$ownerPhoneNumber",
  "role": "OWNER",
  "certifications": []
}
EOF
  )

  create_user "$ownerPayload" "OWNER"

elif [[ "$userRole" == "Captain" || "$userRole" == "captain" ]]; then
  # Get input for the CAPTAIN
  echo "Enter details for the CAPTAIN:"
  captainFirstName=$(get_user_input "First Name")
  captainLastName=$(get_user_input "Last Name")
  captainEmail=$(get_user_input "Email")
  captainPhoneNumber=$(get_user_input "Phone Number")
  captainRatePerHour=$(get_user_input "Rate Per Hour")
  captainCertifications=$(get_user_input "Certifications (comma-separated)")
  captainAvailabilityDay=$(get_user_input "Availability Day")
  captainAvailabilityStart=$(get_user_input "Availability Start Time (HH:MM)")
  captainAvailabilityEnd=$(get_user_input "Availability End Time (HH:MM)")
  captainUserLocation=$(get_user_input "User Location")

  captainPayload=$(
    cat <<EOF
{
  "firstName": "$captainFirstName",
  "lastName": "$captainLastName",
  "email": "$captainEmail",
  "phoneNumber": "$captainPhoneNumber",
  "role": "CAPTAIN",
  "ratePerHour": $captainRatePerHour,
  "certifications": ["$(echo $captainCertifications | sed 's/,/","/g')"],
  "availability": [
    {
      "day": "$captainAvailabilityDay",
      "startTime": "$captainAvailabilityStart",
      "endTime": "$captainAvailabilityEnd"
    }
  ],
  "userLocation": "$captainUserLocation"
}
EOF
  )

  create_user "$captainPayload" "CAPTAIN"

else
  echo "Invalid role. Please restart the script and choose either 'Captain' or 'Owner'."
  exit 1
fi

echo "=== User Creation Completed ==="
