#!/bin/bash

zip -j cardtracker-cards.zip cardtracker-cards/lambda_function.py

aws lambda update-function-code --function-name cardtracker-cards --zip-file fileb://cardtracker-cards.zip

rm cardtracker-cards.zip