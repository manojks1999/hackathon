#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/app-master

#navigate into our working directory where we have all our github files
cd /home/app-master

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
nvm use 14.17.1
npm i -g npm@7.24.2
npm install

cd /home/docker-layer
nvm use 14.17.1

pm2 kill
if [[ $DEPLOYMENT_GROUP_NAME == "evivve-node-prod-app" ]]
then # if/then branch
  npm run pm2-prod
else # else branch
  npm run staging:pm2
fi
cd /home/app-master