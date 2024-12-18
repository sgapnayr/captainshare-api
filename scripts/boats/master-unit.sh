#!/bin/bash

# Define script directory
SCRIPT_DIR=$(dirname "$0")

# Menu function
show_menu() {
  echo "=== Boats Service Core Functionality ==="
  echo "1) Create a New Boat"
  echo "2) Delete a Boat"
  echo "3) Filter Boats by Captain Qualifications"
  echo "4) Get a Boat by ID"
  echo "5) List All Boats"
  echo "6) Exit"
}

# Run selected script
run_script() {
  case $1 in
    1) bash "$SCRIPT_DIR/unit/create-boat.sh" ;;
    2) bash "$SCRIPT_DIR/unit/delete-boat.sh" ;;
    3) bash "$SCRIPT_DIR/unit/filter-boats.sh" ;;
    4) bash "$SCRIPT_DIR/unit/get-boat.sh" ;;
    5) bash "$SCRIPT_DIR/unit/list-boats.sh" ;;
    6) echo "Exiting..."; exit 0 ;;
    *) echo "Invalid option. Please try again." ;;
  esac
}

# Main loop
while true; do
  show_menu
  read -p "Choose an option: " choice
  run_script "$choice"
  echo ""
done
