#!/bin/bash
# liveDesktop
source ~/.nvm/nvm.sh
cd /home/gopal/projects/my/bulktool
nvm install stable && nvm use stable && rm urls.csv && cp urls/url_live_bigSet.csv urls.csv && export DEVICE=desktop && export TEST=20 && export CHUNK=20 && npm start