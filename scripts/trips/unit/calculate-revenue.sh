#!/bin/bash

BASE_URL="http://localhost:3000"

# Function to prompt the user for input
get_input() {
  local prompt=$1
  local var
  read -p "$prompt: " var
  echo "$var"
}

# Get user input for trip details
echo "=== Enter Trip Details ==="
tripType=$(get_input "Choose trip type (OWNER_TRIP or LEASED_TRIP)")

if [ "$tripType" == "OWNER_TRIP" ]; then
  durationHours=$(get_input "Enter trip duration (hours)")
  captainRate=$(get_input "Enter captain rate (per hour)")

  # Calculate derived values
  platformFeeRate=0.13
  captainFeeRate=0.08
  totalCostToOwner=$(echo "$durationHours * $captainRate" | bc)
  ownerFee=$(echo "$totalCostToOwner * $platformFeeRate" | bc)
  captainEarnings=$(echo "$durationHours * $captainRate" | bc)
  netCaptainEarnings=$(echo "$captainEarnings - ($captainEarnings * $captainFeeRate)" | bc)
  platformRevenue=$(echo "$ownerFee + ($captainEarnings * $captainFeeRate)" | bc)
  trueTotalCostToOwner=$(echo "$totalCostToOwner + $ownerFee" | bc)
  captainFee=$(echo "$captainEarnings * $captainFeeRate" | bc)

  echo "=== Revenue Calculation for OWNER_TRIP ==="
  echo "Duration: $durationHours hours"
  echo "Captain Rate: $captainRate/hour"
  echo "--- Owner Payment Details ---"
  echo "Cost to Owner: $totalCostToOwner"
  echo "Network Fee to Owner (13%): $ownerFee"
  echo "Total Cost to Owner: $trueTotalCostToOwner"
  echo "--- Captain Revenue ---"
  echo "Captain Earnings: $captainEarnings"
  echo "Network Fee to Captain (8%): $captainFee"
  echo "Net Captain Earnings: $netCaptainEarnings"
  echo "--- Platform Revenue ---"
  echo "Platform Revenue (Owner + Captain Fees): $platformRevenue"

elif [ "$tripType" == "LEASED_TRIP" ]; then
  totalPrice=$(get_input "Enter total price of the trip")
  captainShare=$(get_input "Enter captain share (fraction, e.g., 0.6) (or press Enter for default 0.6)")

  # Set default captain share if empty
  captainShare=${captainShare:-0.6}

  # Calculate derived values
  platformFeeRate=0.13
  captainFeeRate=0.08
  ownerShare=$(echo "1 - $captainShare" | bc)
  captainEarnings=$(echo "$totalPrice * $captainShare" | bc)
  ownerRevenue=$(echo "$totalPrice * $ownerShare" | bc)
  captainFee=$(echo "$captainEarnings * $captainFeeRate" | bc)
  netCaptainEarnings=$(echo "$captainEarnings - $captainFee" | bc)
  ownerFee=$(echo "$ownerRevenue * $platformFeeRate" | bc)
  netOwnerRevenue=$(echo "$ownerRevenue - $ownerFee" | bc)
  platformRevenue=$(echo "$captainFee + $ownerFee" | bc)

  echo "=== Revenue Calculation for LEASED_TRIP ==="
  echo "Total Price: $totalPrice"
  echo "--- Platform Revenue ---"
  echo "Platform Revenue (Captain + Owner Fees): $platformRevenue"
  echo "--- Captain Revenue ---"
  echo "Captain Earnings (Share $captainShare): $captainEarnings"
  echo "Captain Fee (8%): $captainFee"
  echo "Net Captain Earnings: $netCaptainEarnings"
  echo "--- Owner Revenue ---"
  echo "Owner Revenue (Share $ownerShare): $ownerRevenue"
  echo "Owner Fee (13%): $ownerFee"
  echo "Net Owner Revenue: $netOwnerRevenue"

else
  echo "Invalid trip type. Please restart and enter a valid trip type."
fi
