#!/bin/bash

echo "=== Running All Master Scripts ==="

# List of master scripts
masterScripts=(
  "scripts/trips/master-unit.sh"
  "scripts/trips/master-integration.sh"
  "scripts/trips/master-e2e.sh"
  "scripts/trips/master-analytics.sh"
)

# Iterate over each script and execute it
for script in "${masterScripts[@]}"; do
  echo "=== Running: $script ==="
  if bash "$script"; then
    echo "--- $script: SUCCESS ---"
  else
    echo "--- $script: FAILED ---"
    echo "Exiting master-all script due to failure."
    exit 1
  fi
  echo
done

echo "=== All Master Scripts Completed Successfully ==="
