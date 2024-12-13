#!/bin/bash

BASE_URL="http://localhost:3000/boats"

echo "=== Get a Boat by ID ==="

read -p "Enter boat ID: " id

response=$(curl -s "$BASE_URL/$id")
echo "Response:"
echo "$response" | jq .
