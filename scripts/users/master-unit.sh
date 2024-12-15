#!/bin/bash

# Define script directory
SCRIPT_DIR=$(dirname "$0")

# Menu function
show_menu() {
  echo "=== Users Service Core Functionality ==="
  echo "1) Create a New User (Owner or Captain)"
  echo "2) Add Role to a User"
  echo "3) Add Availability to a Captain"
  echo "4) Update Certifications for a Captain"
  echo "5) List All Users"
  echo "6) Validate Non-CAPTAIN Adding Availability"
  echo "7) Exit"
}

# Run selected script
run_script() {
  case $1 in
    1) bash "$SCRIPT_DIR/unit/create-user.sh" ;;
    2) bash "$SCRIPT_DIR/unit/add-role.sh" ;;
    3) bash "$SCRIPT_DIR/unit/add-availability.sh" ;;
    4) bash "$SCRIPT_DIR/unit/update-certifications.sh" ;;
    5) bash "$SCRIPT_DIR/unit/list-users.sh" ;;
    6) bash "$SCRIPT_DIR/unit/validate-non-captain-availability.sh" ;;
    7) echo "Exiting..."; exit 0 ;;
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
