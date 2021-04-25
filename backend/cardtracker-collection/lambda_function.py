import boto3
import datetime
import json
import os
import uuid

dynamodb = boto3.client('dynamodb')


def unmarshall(items):
    """DynamoDB provides data in the following format
        {
            "name": {
                "S": "string"
            },
            etc..
        }
        This method moves the value to something like:
        {
            "name": "string",
            etc...
        }
        NOTE: makes alot of assumptions about the type (mostly, a string)
        Also takes a list and tries to unmarshall the dicts in it
    """
    return_dict = {}
    if isinstance(items, list):
        return_list = []
        for item in items:
            return_list.append(unmarshall(item))
        return return_list
    for key, value in items.items():
        return_dict[key] = list(value.values())[0]
    return return_dict


def lambda_handler(event, context):
    body = None
    status_code = 200
    headers = {
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': "*"
    }

    def four_oh_four():
        return {
            "statusCode": 404,
            "headers": headers,
            "body": json.dumps("Not found")
        }

    # build our route from the event data
    route = f"{event['httpMethod']} {event['resource']}"

    try:
        account = \
            event['requestContext']['authorizer']['claims']['cognito:username']
        # handle DELETE event
        if route == "DELETE /collection/{id}":
            collected_card = dynamodb.get_item(
                TableName="cardtracker-collection",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            if collected_card['Item']['account']["S"] != account:
                return four_oh_four()
            dynamodb.delete_item(
                TableName="cardtracker-collection",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            # TODO delete image as well from s3 bucket
            body = "Deleted"
        # handle get collection event
        elif route == "GET /collection":
            try:
                limit = int(
                    event.get('queryStringParameters', {}).get('limit', 30)
                )
            except AttributeError:
                limit = 30
            items = dynamodb.scan(
                TableName="cardtracker-collection",
                FilterExpression="account = :account",
                ExpressionAttributeValues={":account": {"S": account}},
                Limit=limit
            )
            collection = unmarshall(items['Items'])
            collection_with_cards = []
            for collect in collection:
                # get the card item
                card = dynamodb.get_item(
                    TableName="cardtracker-cards",
                    Key={"id": {"S": collect['card']}}
                )
                collection_with_cards.append(
                    {**collect, **{'card': unmarshall(card['Item'])}}
                )
            body = {'Items': collection_with_cards}
            if "LastEvaluatedKey" in items:
                body['LastEvaluatedKey'] = items['LastEvaluatedKey']
        # handle put new card event
        elif route == "PUT /collection":
            newId = str(uuid.uuid4())
            requestJSON = json.loads(event['body'])
            dynamodb.put_item(
                TableName="cardtracker-collection",
                Item={
                    "id": {"S": newId},
                    "account": {"S": account},
                    "card": {"S": requestJSON['card']['id']},
                    "count": {"S": str(requestJSON['count'])},
                    "collected": {"S": requestJSON['collected']},
                    "fontPath": {"S": requestJSON['frontPath']},
                    "backPath": {"S": requestJSON['backPath']},
                    "public": {"S": requestJSON['public']},
                    "variant": {"S": requestJSON['variant']},
                    "parrallel": {"S": requestJSON['parrallel']},
                    "parrallerlnumber": {"S": requestJSON['parrallelnumber']},
                    "added": {"S": str(datetime.datetime.now().timestamp())}
                }
            )
            body = "Added"
        # handle get specific card event
        elif route == "GET /collection/{id}":
            collected_card = dynamodb.get_item(
                TableName="cardtracker-collection",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            collected_card = unmarshall(collected_card['Item'])
            if collected_card['account'] != account:
                return four_oh_four()
            card = dynamodb.get_item(
                TableName="cardtracker-cards",
                Key={"id": {"S": collected_card['card']}}
            )
            collected_card['card'] = unmarshall(card['Item'])
            body = collected_card
        # handle update exising card event
        elif route == "PUT /collection/{id}":
            collected_card = dynamodb.get_item(
                TableName="cardtracker-collection",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            if collected_card['Item']['account'] != account:
                return four_oh_four()
            requestJSON = json.loads(event['body'])
            dynamodb.put_item(
                TableName="cardtracker-collection",
                Item={
                    "id": {"S": requestJSON['id']},
                    "account": {"S": account},
                    "card": {"S": requestJSON['card']['id']},
                    "count": {"S": str(requestJSON['count'])},
                    "collected": {"S": requestJSON['collected']},
                    "frontPath": {"S": requestJSON['frontPath']},
                    "backPath": {"S": requestJSON['backPath']},
                    "public": {"S": requestJSON['public']},
                    "variant": {"S": requestJSON['variant']},
                    "parrallel": {"S": requestJSON['parrallel']},
                    "parrallerlnumber": {"S": requestJSON['parrallelnumber']},
                    "added": {"S": str(datetime.datetime.now().timestamp())}
                }
            )
            body = "Saved"
        # handle image upload
        elif route == "POST /collection/{id}/images":
            # get pre-signed url
            collected_card = dynamodb.get_item(
                TableName="cardtracker-collection",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            if collected_card['Item']['account']['S'] != account:
                return four_oh_four()
            requestJSON = json.loads(event['body'])
            if requestJSON['side'] not in ['front', 'back']:
                raise Exception('side must be front or back')
            key = f"images/{collected_card['Item']['id']['S']}-{requestJSON['side']}-{requestJSON['imageName'].replace(' ', '')}"  # noqa
            s3 = boto3.client('s3')
            signed_data = s3.generate_presigned_post(
                Bucket=os.environ['S3_BUCKET'],
                Key=key,
                Conditions=[["stats-with", "$Content-Type", "image/"]],
                ExpiresIn=300
            )
            new_url = f"{os.environ['S3_URL']}/{key}"
            collected_card['Item'][f"{requestJSON['side']}Path"] = {"S": new_url}  # noqa
            dynamodb.put_item(
                TableName="cardtracker-collection",
                Item=collected_card['Item']
            )
            body = {
                'signedData': signed_data,
                'newURL': new_url,
                'side': requestJSON['side']
            }
        else:
            status_code = 404
            body = "Not found"
    except Exception as err:
        status_code = 400
        body = str(err)
    finally:
        body = json.dumps(body)

    return {
        'statusCode': status_code,
        'headers': headers,
        'body': body
    }
