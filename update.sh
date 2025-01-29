#!/bin/bash

sudo apt-get install expect

# Run the expect script
expect git_pull_with_credentials.expect

# Run Docker Compose
docker-compose up -d --build front-prod
