#!/bin/bash
# Script to create a new boat

echo "=== Create a New Boat ==="
read -p "Name: " name
read -p "Type (e.g., Yacht, Fishing Boat): " type
read -p "Capacity: " capacity
read -p "Location: " location
read -p "License Required (comma-separated, e.g., USCG): " licenseRequired
read -p "Captain Certifications Required (comma-separated, e.g., AdvancedSailing): " certifications
read -p "Rate Willing to Pay: " rate
read -p "Make: " make
read -p "Model: " model
read -p "Year: " year
read -p "Color: " color
read -p "HIN (Optional): " hin
read -p "Commercial Use (true/false, default false): " commercialUse
read -p "User Role (OWNER/ADMIN): " userRole
read -p "User ID: " userId

curl -X POST http://localhost:3000/boats \
  -H "Content-Type: application/json" \
  -d '{
    "name": "'"$name"'",
    "type": "'"$type"'",
    "capacity": '"$capacity"',
    "location": "'"$location"'",
    "licenseRequired": ["'"$(echo $licenseRequired | sed "s/,/\",\"/g")"'"],
    "captainShareCertificationsRequired": ["'"$(echo $certifications | sed "s/,/\",\"/g")"'"],
    "rateWillingToPay": '"$rate"',
    "make": "'"$make"'",
    "model": "'"$model"'",
    "year": '"$year"',
    "color": "'"$color"'",
    "hin": "'"$hin"'",
    "commercialUse": '"${commercialUse:-false}"',
    "userRole": "'"$userRole"'",
    "userId": "'"$userId"'"
  }' | jq .
