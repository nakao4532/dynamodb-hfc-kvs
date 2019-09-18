const aws = require('aws-sdk');
const AmazonDaxClient = require('amazon-dax-client');
const api = require('fabric-client/lib/api.js');

class DynamoDBKeyValueStore extends api.KeyValueStore {
  constructor(options) {
    if (!options || !options.tablename) {
      throw new Error('Invalid Arguments: options.tablename');
    }
    super();
    this.tablename = options.tablename;

    if (options.daxEndpoint) {
      const dax = new AmazonDaxClient({endpoints: [options.daxEndpoint]});
      this.documentClient = new aws.DynamoDB.DocumentClient({service: dax});
    }
    if (options.localEndpoint && options.region && !this.documentClient) {
      this.documentClient = new aws.DynamoDB.DocumentClient({
          region: options.region,
          endpoint: options.localEndpoint,
      });
    }
    if (!this.documentClient) {
        this.documentClient = new aws.DynamoDB.DocumentClient();
    }
    const self = this;
    return new Promise((resolve) => resolve(self));
  }

  getValue(name) {
    const tablename = this.tablename;
    const documentClient = this.documentClient;
    const params = {
      TableName: tablename,
      Key: {
          name,
      }
    }
    return new Promise((resolve, reject) => {
      documentClient.get(params, (err, data) => {
        if (err) {
            return reject(err);
        }
        if (!Object.keys(data).length || !data.Item || !data.Item.value) {
            return resolve(null);
        }
        return resolve(data.Item.value);
      });
    });
  }

  setValue(name, value) {
    const tablename = this.tablename;
    const documentClient = this.documentClient;
    const params = {
      TableName: tablename,
      Item: {
          name,
          value,
      },
    }
    return new Promise((resolve, reject) => {
      this.getValue(name)
        .then(() => {
          documentClient.put(params, (err) => {
            if (err) {
              return reject(err);
            }
            return resolve(value);
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
}

module.exports = DynamoDBKeyValueStore;
