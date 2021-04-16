import boto3
import json

dynamodb = boto3.client('dynamodb')


def lambda_handler(event, context):
    body = None
    status_code = 200
    headers = {
        'Content-Type': "application/json"
    }

    # build our route from the event data
    route = f"{event['httpMethod']} {event['resource']}"

    try:
        # handle DELETE event
        if route == "DELETE /cards/{id}":
            dynamodb.delte_item(
                TableName="cardtracker-cards",
                Key={"id": event['pathParameters']['id']}
            )
            body = "Deleted"
        # handle GET event
        elif route == "GET /cards/{id}":
            body = dynamodb.get_item(
                TableName="cardtracker-cards",
                Key={"id": event['pathParameters']['id']}
            )
        # handle GET (list) event
        elif route == "GET /cards":
            body = dynamodb.scan(TableName="cardtracker-cards")
        # handle PUT event
        elif route == "PUT /cards":
            requestJSON = json.loads(event.body)
            # TODO validate data
            dynamodb.put_item(
                TableName="cardtracker-cards",
                Item={
                    "id": requestJSON['id'],
                    "name": requestJSON['name'],
                    "team": requestJSON['team'],
                    "position": requestJSON['position'],
                    "manufacturer": requestJSON['manufacturer'],
                    "year": requestJSON['year'],
                    "tcdb": requestJSON['tcdb']
                }
            )
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
