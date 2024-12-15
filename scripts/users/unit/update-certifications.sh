#!/bin/bash
# Script to update certifications for a Captain

echo "=== Update Certifications ==="
read -p "Captain User ID: " userId
read -p "Enter Certifications (comma-separated, e.g., CPR,FirstAid): " certifications

curl -X PATCH http://localhost:3000/users/$userId/certifications \
  -H "Content-Type: application/json" \
  -d '{
    "certifications": ["'"$(echo $certifications | sed 's/,/","/g')"'"]
  }' | jq .
