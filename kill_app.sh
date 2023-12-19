#!/bin/bash

ports=(5600 5800)
for port in "${ports[@]}"; do
  pid=$(lsof -t -i:$port)
  
  if [ -n "$pid" ]; then
    echo "Killing process on port $port with PID $pid"
    kill $pid
  else
    echo "No process running on port $port"
  fi
done

if pgrep -f "nodemon server" > /dev/null
  then
    echo "Nodemon server is running, killing it now"
    pkill -f "nodemon server"
fi
  