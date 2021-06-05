import boto3
import json
import traceback

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
        if list(value.keys())[0] == "N":
            return_dict[key] = int(return_dict[key])
    return return_dict


def lambda_handler(event, context):
    body = None
    status_code = 200
    headers = {
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': "*"
    }

    # build our route from the event data
    route = f"{event['httpMethod']} {event['resource']}"

    try:
        # handle DELETE event
        if route == "DELETE /cards/{id}":
            if ('admin' not in event['requestContext']
                    ['authorizer']['claims']['cognito:groups']):
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps("Not Allowed")
                }
            dynamodb.delete_item(
                TableName="cardtracker-cards",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            body = "Deleted"
        # handle GET event
        elif route == "GET /cards/{id}":
            item = dynamodb.get_item(
                TableName="cardtracker-cards",
                Key={"id": {"S": event['pathParameters']['id']}}
            )
            # unmarshall the body
            body = unmarshall(item['Item'])
        # handle GET (list) event
        elif route == "GET /cards":
            params = {
                'TableName': "cardtracker-cards",
                'Limit': 30
            }
            lastEvaluatedKey = {}
            if 'queryStringParameters' in event:
                params['Limit'] = int(
                    event['queryStringParameters'].get('limit', 30)
                )
                lastEvaluatedKey = event['queryStringParameters'].get(
                    'LastEvaluatedKey', None
                )
            if lastEvaluatedKey:
                params['ExclusiveStartKey'] = {"id": {'S': lastEvaluatedKey}}

            items = dynamodb.scan(**params)
            # unmarshall the body
            body = {'Items': unmarshall(items['Items'])}
            if "LastEvaluatedKey" in items:
                body['LastEvaluatedKey'] = items['LastEvaluatedKey']['id']['S']
        # handle PUT event
        elif route == "PUT /cards":
            if ('cognito:groups' not in event['requestContext']
                    ['authorizer']['claims'] or
                    'admin' not in event['requestContext']
                    ['authorizer']['claims']['cognito:groups']):
                return {
                    'statusCode': 403,
                    'headers': headers,
                    'body': json.dumps("Not Allowed")
                }
            requestJSON = json.loads(event['body'])
            # TODO validate data
            dynamodb.put_item(
                TableName="cardtracker-cards",
                Item={
                    "id": {"S": requestJSON['id']},
                    "name": {"S": requestJSON['name']},
                    "team": {"S": requestJSON['team']},
                    "position": {"S": requestJSON['position']},
                    "manufacturer": {"S": requestJSON['manufacturer']},
                    "year": {"S": requestJSON['year']},
                    "series": {"S": requestJSON['series']},
                    "set": {"S": requestJSON['set']},
                    "subset": {"S": requestJSON['subset']},
                    "cardnumber": {"S": requestJSON['cardnumber']},
                    "tcdb": {"S": requestJSON['tcdb']},
                    "sortnumber": {"N": requestJSON['sortnumber']}
                }
            )
            body = "Added card"
        else:
            status_code = 404
            body = "Not found"
    except Exception as err:
        status_code = 400
        body = f"{str(err)}: {traceback.print_tb(err.__traceback__)}"
    finally:
        body = json.dumps(body)

    return {
        'statusCode': status_code,
        'headers': headers,
        'body': body
    }
