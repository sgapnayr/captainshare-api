#!/bin/bash

BASE_URL="http://localhost:3000/boats/filter"

echo "=== Filter Boats by Captain Certifications and Licenses ==="

read -p "Enter captain certifications (comma-separated): " certifications
read -p "Enter captain licenses (comma-separated): " licenses

data=$(cat <<EOF
{
  "captainCertifications": [$(echo $certifications | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')],
  "captainLicenses": [$(echo $licenses | sed 's/,/","/g' | sed 's/^/"/' | sed 's/$/"/')]
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
