#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

echo "=== Trips Service Unit Scripts ==="
echo "1) Create a New Trip"
echo "2) Get a Trip by ID"
echo "3) Update a Trip"
echo "4) Delete a Trip"
echo "5) List All Trips"
echo "6) Exit"

while true; do
  read -p "Choose an option: " choice
  case $choice in
    1) bash "$SCRIPT_DIR/unit/create-trip.sh" ;;
    2) bash "$SCRIPT_DIR/unit/get-trip.sh" ;;
    3) bash "$SCRIPT_DIR/unit/update-trip.sh" ;;
    4) bash "$SCRIPT_DIR/unit/delete-trip.sh" ;;
    5) bash "$SCRIPT_DIR/unit/list-trips.sh" ;;
    6) echo "Exiting..."; exit 0 ;;
    *) echo "Invalid option. Please try again." ;;
  esac
  echo ""
done
