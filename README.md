# cardtracker
A web-app to track trading cards

# Requirements
* python3.8
* aws account with deploy permissions to lamdba, api gateway, s3

## Backend
* AWS gateway
* AWS lambda
* dynamo db
* To Deploy:
* * cd backend/ && ./deploy-backend.sh

## Frontend 
* svelte spa from s3 bucket
* To Deploy:
* * cd cardtracker-web/ && ./deploy-frontend.sh
