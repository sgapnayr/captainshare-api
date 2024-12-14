#!/bin/bash

# API URL
API_URL="http://localhost:3000/users"

# Optional filters
read -p "Enter role filter (e.g., CAPTAIN, OWNER, ADMIN, or leave empty): " ROLE
read -p "Include deleted users? (true/false, default false): " IS_DELETED
read -p "Page number (default 1): " PAGE
read -p "Page limit (default 10): " LIMIT

# Apply defaults if not provided
IS_DELETED=${IS_DELETED:-false}
PAGE=${PAGE:-1}
LIMIT=${LIMIT:-10}

# Make API request
curl -G "$API_URL" \
  --data-urlencode "role=$ROLE" \
  --data-urlencode "isDeleted=$IS_DELETED" \
  --data-urlencode "page=$PAGE" \
  --data-urlencode "limit=$LIMIT" | jq .

echo -e "\nUsers listed." | jq .
