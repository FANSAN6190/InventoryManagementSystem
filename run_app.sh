#!/bin/bash
root_dir=$(pwd)

if [ "$1" == "dev" ]; then
    echo "Running in Development mode"
    cd ims_client/ 
    npm start &
    cd "$root_dir"
    cd ims_server/ 
    npm run dev
    cd "$root_dir"
    exit 0
else
    echo "Running in Production mode"
    cd ims_client/ 
    node "reactProdServer.js" &
    cd "$root_dir"
    cd ims_server/ 
    node "server.js" &
    cd "$root_dir"
    exit 0
fi

