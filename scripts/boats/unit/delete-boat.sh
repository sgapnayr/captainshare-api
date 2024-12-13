#!/bin/bash

BASE_URL="http://localhost:3000/boats"

echo "=== Delete a Boat ==="

read -p "Enter boat ID: " id

response=$(curl -s -X DELETE "$BASE_URL/$id")
echo "Response:"
echo "$response" | jq .