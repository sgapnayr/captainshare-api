#!/bin/bash

# Define script directory
SCRIPT_DIR=$(dirname "$0")

# Menu function
show_menu() {
  echo "=== Users Service Unit Scripts ==="
  echo "1) Create a New User"
  echo "2) Get a User by ID"
  echo "3) Update a User"
  echo "4) Delete a User"
  echo "5) List All Users"
  echo "6) Exit"
}

# Run selected script
run_script() {
  case $1 in
    1)
      bash "$SCRIPT_DIR/unit/create-user.sh"
      ;;
    2)
      bash "$SCRIPT_DIR/unit/get-user.sh"
      ;;
    3)
      bash "$SCRIPT_DIR/unit/update-user.sh"
      ;;
    4)
      bash "$SCRIPT_DIR/unit/delete-user.sh"
      ;;
    5)
      bash "$SCRIPT_DIR/unit/list-users.sh"
      ;;
    6)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo "Invalid option. Please try again."
      ;;
  esac
}

# Main loop
while true; do
  show_menu
  read -p "Choose an option: " choice
  run_script "$choice"
  echo ""
done
