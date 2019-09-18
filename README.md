# DynamoDB HFC KeyValueStore

This node module provides KeyValueStore implementation backed by DynamoDB for Hyperledger Fabric Client SDK. This allows the nodejs clients of hyperledger to store the ECerts in DynamoDB.

## Installation

```bash
$ npm install --save dynamodb-hfc-kvs
```

## Code Example

```javascript
const DynamoDBKeyValueStore = require('dynamodb-hfc-kvs');

// Default
const DKVS = new DynamoDBKeyValueStore({tablename: 'ECertTable'});

// Use Amazon DynamoDB Accelerator(DAX)
const DKVS = new DynamoDBKeyValueStore({tablename: 'ECertTable', daxEndpoint: 'https://DAXHostName:PortNumber'});

// Use DynamoDB Local
const DKVS = new DynamoDBKeyValueStore({tablename: 'ECertTable', localEndpoint: 'http://DynamoDBLocalHostName:PortNumber', region: 'us-east-1'});
```
