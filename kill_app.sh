#!/bin/bash

ports=(5600 5800)
for port in "${ports[@]}"; do
  pid=$(lsof -t -i:$port)

  if [ -n "$pid" ]; then
    echo "Killing process on port $port with PID $pid"
    kill -9 $pid
  else
    echo "No process running on port $port"
  fi
done