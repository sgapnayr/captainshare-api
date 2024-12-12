#!/bin/bash

echo "=== Running Unit Tests for Trips ==="

# Sequentially run all unit test scripts for trips
bash scripts/trips/unit/create-leased-trip.sh
bash scripts/trips/unit/create-owner-trip.sh
bash scripts/trips/unit/get-trip.sh
bash scripts/trips/unit/update-trip.sh
bash scripts/trips/unit/calculate-revenue.sh
bash scripts/trips/unit/delete-trip.sh
bash scripts/trips/unit/list-trips.sh

echo "=== Completed Unit Tests for Trips ==="
