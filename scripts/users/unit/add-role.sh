#!/bin/bash
# Script to add a role to an existing user

echo "=== Add Role to User ==="
read -p "User ID: " userId
read -p "Role to Add (CAPTAIN, OWNER, ADMIN): " role

curl -X PATCH http://localhost:3000/users/$userId/roles/add \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'"$role"'"
  }' | jq .
