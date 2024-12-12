#!/bin/bash

echo "=== Running Analytics Scripts ==="

# List of analytics scripts
analyticsScripts=(
  "scripts/trips/analytics/total-trips.sh"
  "scripts/trips/analytics/revenue-summary.sh"
  "scripts/trips/analytics/captain-earnings-summary.sh"
)

for script in "${analyticsScripts[@]}"; do
  echo "=== Running: $script ==="
  bash "$script"
  if [ $? -ne 0 ]; then
    echo "Analytics Script Failed: $script"
    exit 1
  fi
done

echo "=== Analytics Completed Successfully ==="
