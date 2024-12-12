#!/bin/bash

echo "=== Running All Integration Tests ==="

# Define the integration test scripts
scripts=(
  "scripts/trips/integration/create-and-update-trip.sh"
  "scripts/trips/integration/valid-and-overlapping-trip.sh"
  "scripts/trips/integration/revenue-validation.sh"
  "scripts/trips/integration/list-trips.sh"
  "scripts/trips/integration/delete-trip-flow.sh"
  "scripts/trips/integration/invalid-trip.sh"
  "scripts/trips/integration/end-to-end-flow.sh"
)

# Iterate over each script and execute it
for script in "${scripts[@]}"; do
  echo "=== Running: $script ==="
  if bash "$script"; then
    echo "--- $script: SUCCESS ---"
  else
    echo "--- $script: FAILED ---"
    echo "Exiting master script due to failure."
    exit 1
  fi
  echo
done

echo "=== All Integration Tests Completed Successfully ==="
