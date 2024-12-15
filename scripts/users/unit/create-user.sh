#!/bin/bash
# Script to create a new user

echo "=== Create a New User ==="
read -p "First Name: " firstName
read -p "Last Name: " lastName
read -p "Email: " email
read -p "Roles (CAPTAIN, OWNER, ADMIN): " roles

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "'"$firstName"'",
    "lastName": "'"$lastName"'",
    "email": "'"$email"'",
    "roles": ["'"$roles"'"]
  }' | jq .
