#!/bin/bash

source <(cat cache)

cardsnew=`sha256sum cardtracker-cards/lambda_function.py | awk '{print $1}'`
collectionnew=`sha256sum cardtracker-collection/lambda_function.py | awk '{print $1}'`

if [[ $cards != $cardsnew ]]; then
    zip -j cardtracker-cards.zip cardtracker-cards/lambda_function.py
    aws lambda update-function-code --function-name cardtracker-cards --zip-file fileb://cardtracker-cards.zip
    rm cardtracker-cards.zip
    sed -i "s/^cards=.*$/cards=$cardsnew/g" cache
fi

if [[ $collection != $collectionnew ]]; then
    zip -j cardtracker-collection.zip cardtracker-collection/lambda_function.py
    aws lambda update-function-code --function-name cardtracker-collection --zip-file fileb://cardtracker-collection.zip
    rm cardtracker-collection.zip
    sed -i "s/^collection=.*$/collection=$collectionnew/g" cache
fi
