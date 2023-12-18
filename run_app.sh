#!/bin/bash
root_dir=$(pwd)
cd ims_client/ 
node "reactProdServer.js" &
cd "$root_dir"
cd ims_server/ 
node "server.js" &
cd "$root_dir"
