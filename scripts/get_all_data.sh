#!/bin/bash

echo "Fetching all users..."
curl -s http://localhost:3000/users | jq || echo "Failed to fetch users."

echo "Fetching all boats..."
curl -s http://localhost:3000/boats | jq || echo "Failed to fetch boats."

echo "Fetching all trips..."
curl -s http://localhost:3000/trips | jq || echo "Failed to fetch trips."

echo "Fetching all captains..."
curl -s http://localhost:3000/users | jq '.[] | select(.role == "CAPTAIN")' || echo "Failed to fetch captains."

echo "Fetching all owners..."
curl -s http://localhost:3000/users | jq '.[] | select(.role == "OWNER")' || echo "Failed to fetch owners."

echo "All data retrieved successfully!"
