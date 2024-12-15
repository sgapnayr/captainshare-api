#!/bin/bash

echo "=== Delete a Trip ==="
read -p "Enter Trip ID to delete: " tripId

# Here we would normally send a DELETE request to your backend API
# For now, we're just echoing the request
echo "Deleting Trip ID: $tripId..."

# Example curl request (replace with actual endpoint):
# curl -X DELETE http://localhost:3000/trips/$tripId
