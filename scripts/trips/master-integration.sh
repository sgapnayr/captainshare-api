#!/bin/bash

echo "=== Running All Integration Tests ==="

bash scripts/trips/integration/create-and-update-trip.sh
bash scripts/trips/integration/overlapping-trip-validation.sh
bash scripts/trips/integration/revenue-validation.sh
bash scripts/trips/integration/full-lifecycle.sh
bash scripts/trips/integration/edge-cases.sh

echo "=== Integration Tests Completed ==="
