# cardtracker
A web-app to track trading cards

# Requirements
* python3.8
* aws account with deploy permissions to lamdba, api gateway, s3

## Backend
* AWS gateway (must create from api spec)
* AWS lambda (must create)
* dynamo db (must create)
* To Deploy:
* * cd backend/ && ./deploy-backend.sh

## Frontend 
* svelte spa from s3 bucket
* To Deploy:
* * cd cardtracker-web/ && ./deploy-frontend.sh
