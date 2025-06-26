#!/bin/bash

# Backend base URL
URL="http://localhost:5000/tasks"

# 1. Create a new task
echo "Creating a new task..."
curl -s -X POST $URL \
  -H "Content-Type: application/json" \
  -d '{"title": "CLI Task", "description": "Task from bash", "status": "Pending", "dueDate": "2025-06-30"}'
echo -e "\n"

# 2. Get all tasks
echo "Fetching all tasks..."
curl -s $URL | jq .
echo -e "\n"

# 3. Get specific task by ID
TASK_ID="68591b0f26fab24515a1d0ae"

echo "Fetching task with ID: $TASK_ID"
curl -s $URL/$TASK_ID | jq .
echo -e "\n"

# 4. Update task status to Completed
echo "Updating task status to Completed..."
curl -s -X PUT $URL/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "Completed"}' | jq .
echo -e "\n"

# 5. Delete the task
echo "Deleting task with ID: $TASK_ID"
curl -s -X DELETE $URL/$TASK_ID | jq .
echo -e "\n"

echo "Test completed."

