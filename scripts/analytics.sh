#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Fetch all boats by owner
echo "Fetching all boats for Owner ID owner123..."
boats_response=$(curl -s -X GET "$BASE_URL/boats?ownerId=owner123" | jq)
echo "$boats_response"

# Fetch trips by captain
echo "Fetching trips for Captain ID captain123..."
captain_trips=$(curl -s -X GET "$BASE_URL/trips?captainId=captain123" | jq)
echo "$captain_trips"

# Fetch captain reviews
echo "Fetching reviews for Captain ID captain123..."
captain_reviews=$(curl -s -X GET "$BASE_URL/reviews?captainId=captain123" | jq)
echo "$captain_reviews"

# Fetch trips by status
echo "Fetching COMPLETED trips..."
completed_trips=$(curl -s -X GET "$BASE_URL/trips?status=COMPLETED" | jq)
echo "$completed_trips"

# Fetch analytics for owners
echo "Fetching total captains hired by Owner ID owner123..."
total_captains=$(curl -s -X GET "$BASE_URL/trips?ownerId=owner123" | jq)
echo "$total_captains"
