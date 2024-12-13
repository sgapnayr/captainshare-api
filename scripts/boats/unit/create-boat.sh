#!/bin/bash

BASE_URL="http://localhost:3000/boats"

echo "=== Create a New Boat ==="

read -p "Enter boat name: " name
read -p "Enter boat type: " type
read -p "Enter boat capacity: " capacity
read -p "Enter boat location: " location
read -p "Enter rate willing to pay: " rateWillingToPay
read -p "Enter owner IDs (comma-separated): " ownerIds
read -p "Enter licenses required (comma-separated): " licenses
read -p "Enter certifications required (comma-separated): " certifications
read -p "Enter boat make: " make
read -p "Enter boat model: " model
read -p "Enter boat year: " year
read -p "Enter boat color: " color

data=$(cat <<EOF
{
  "name": "$name",
  "type": "$type",
  "capacity": $capacity,
  "location": "$location",
  "rateWillingToPay": $rateWillingToPay,
  "ownerIds": [$(echo $ownerIds | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "licenseRequired": [$(echo $licenses | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "captainShareCertificationsRequired": [$(echo $certifications | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "make": "$make",
  "model": "$model",
  "year": $year,
  "color": "$color"
}
EOF
)

response=$(curl -s -X POST "$BASE_URL" -H "Content-Type: application/json" -d "$data")

if echo "$response" | jq . > /dev/null 2>&1; then
  echo "Response (Formatted):"
  echo "$response" | jq .
else
  echo "Invalid JSON Response:"
  echo "$response"
fi
