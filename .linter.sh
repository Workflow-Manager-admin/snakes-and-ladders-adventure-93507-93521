#!/bin/bash
cd /home/kavia/workspace/code-generation/snakes-and-ladders-adventure-93507-93521/main_container_for_snakes_and_ladders_adventure
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

