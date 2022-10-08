import json
import os

from memcache import Client 

MEMCACHED_ENDPOINT = os.environ.get('MEMCACHED_ENDPOINT')
MC = Client([MEMCACHED_ENDPOINT], debug=0)

def lambda_handler(event, context):
    MC.set("some_key", "Some value")
    value = MC.get("some_key")
    print(value)
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }