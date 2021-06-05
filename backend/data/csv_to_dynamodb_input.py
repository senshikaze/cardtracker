#! /usr/bin/env python3
import boto3
import argparse
import csv

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('input_file', type=str)
    args = parser.parse_args()

    csv_contents = []
    with open(args.input_file, newline='') as csv_file:
        reader = csv.reader(csv_file)
        for r in reader:
            csv_contents.append(r)
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('cardtracker-cards')
    with table.batch_writer() as batch:
        for row in csv_contents[1:]:
            batch.put_item(
                Item={
                    'id': str(row[0]),
                    'cardnumber': str(row[1]),
                    'name': str(row[2]),
                    'team': str(row[3]),
                    'position': str(row[4]),
                    'series': str(row[5]),
                    'manufacturer': str(row[6]),
                    'year': str(row[7]),
                    'set': str(row[8]),
                    'tcdb': str(row[9]),
                    'sortnumber': int(row[10])
                }
            )
