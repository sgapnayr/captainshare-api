#!/bin/bash

echo "=== Running End-to-End Tests ==="

# List of E2E test scripts
scripts=(
  "scripts/trips/e2e/end-to-end-flow.sh"
  "scripts/trips/e2e/full-lifecycle.sh"
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
