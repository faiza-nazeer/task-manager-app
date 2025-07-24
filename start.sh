#!/bin/bash

# Paths (update if needed)
BACKEND_DIR=~/task-manager/backend
FRONTEND_DIR=~/task-manager/frontend

# Start Backend in Terminal 1
gnome-terminal -- bash -c "cd $BACKEND_DIR && npx nodemon server.js; exec bash"

# Start Frontend in Terminal 2
gnome-terminal -- bash -c "cd $FRONTEND_DIR && npm start; exec bash"

# Start Frontend in Terminal 3 (for testing second tab or shared tasks etc)
gnome-terminal -- bash -c "cd $FRONTEND_DIR && npm start; exec bash"

