#!/bin/bash

BASE_URL="http://localhost:3000"

# Check if trip ID exists
if [ ! -f tripId.tmp ]; then
  echo "Trip ID not found. Please create a trip first."
  exit 1
fi

# Read the trip ID from the file
tripId=$(cat tripId.tmp)

# Fetch the trip details
echo "=== Fetching Trip Details for Revenue Calculation ==="
response=$(curl -s "$BASE_URL/trips/$tripId")

# Check if the trip exists
if echo "$response" | jq -e '.id' >/dev/null 2>&1; then
  echo "Trip Details Fetched Successfully."
  echo "$response" | jq

  # Extract common trip data
  tripType=$(echo "$response" | jq -r '.tripType')
  durationHours=$(echo "$response" | jq -r '.durationHours')
  captainRate=$(echo "$response" | jq -r '.captainRate')
  captainEarnings=$(echo "$response" | jq -r '.captainEarnings')
  netCaptainEarnings=$(echo "$response" | jq -r '.netCaptainEarnings')
  ownerFee=$(echo "$response" | jq -r '.ownerFee')
  platformRevenue=$(echo "$response" | jq -r '.platformRevenue')
  totalCostToOwner=$(echo "$response" | jq -r '.totalCostToOwner')

  echo "=== Revenue Calculation for Trip ID: $tripId ==="
  echo "Trip Type: $tripType"
  echo "Duration: $durationHours hours"

  if [ "$tripType" == "OWNER_TRIP" ]; then
    echo "--- Owner Payment Details ---"
    echo "Captain Rate: $captainRate/hour"
    echo "Total Cost to Owner: $totalCostToOwner"
    echo "Owner Fee (13%): $ownerFee"

    echo "--- Captain Revenue ---"
    echo "Captain Earnings: $captainEarnings"
    echo "Net Captain Earnings: $netCaptainEarnings"

    echo "--- Platform Revenue ---"
    echo "Platform Revenue (Owner + Captain Fees): $platformRevenue"
  elif [ "$tripType" == "LEASED_TRIP" ]; then
    # Existing leased trip calculation logic
    ...
  fi
else
  echo "Failed to Fetch Trip Details:"
  echo "$response"
fi
