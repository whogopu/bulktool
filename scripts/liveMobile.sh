#!/bin/bash
#liveMobile
source ~/.nvm/nvm.sh
cd /home/gopal/projects/my/bulktool
nvm install stable && nvm use stable && rm urls.csv && cp urls/url_live_bigSet.csv urls.csv && export DEVICE=mobile && export TEST=10 && export CHUNK=20 && npm start