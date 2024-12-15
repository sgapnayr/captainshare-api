#!/bin/bash
# Script to filter boats by captain qualifications

echo "=== Filter Boats by Captain Qualifications ==="
read -p "Captain Certifications (comma-separated, e.g., AdvancedSailing): " certifications
read -p "Captain Licenses (comma-separated, e.g., USCG): " licenses

curl -X POST http://localhost:3000/boats/filter \
  -H "Content-Type: application/json" \
  -d '{
    "certifications": ["'"$(echo $certifications | sed "s/,/\",\"/g")"'"],
    "licenses": ["'"$(echo $licenses | sed "s/,/\",\"/g")"'"]
  }' | jq .
