#!/bin/bash
root_dir=$(pwd)
cd ims_client/ 
npm start &
cd "$root_dir"
cd ims_server/ 
npm start &
cd "$root_dir"
