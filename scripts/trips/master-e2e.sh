#!/bin/bash

echo "=== Running End-to-End Tests ==="

# List of E2E test scripts
scripts=(
  "scripts/trips/e2e/create-owner-trip-e2e.sh"
  "scripts/trips/e2e/create-leased-trip-e2e.sh"
  "scripts/trips/e2e/validate-revenue-e2e.sh"
  "scripts/trips/e2e/update-trip-e2e.sh"
  "scripts/trips/e2e/delete-trip-e2e.sh"
  "scripts/trips/e2e/overlapping-trip-e2e.sh"
)

for script in "${scripts[@]}"; do
  echo "=== Running: $script ==="
  bash "$script"
  if [ $? -ne 0 ]; then
    echo "Test Failed: $script"
    exit 1
  fi
done

echo "=== End-to-End Tests Completed Successfully ==="
