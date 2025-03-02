const {MongoClient, DBRef} = require('mongodb')


const url = 'mongodb://localhost:27017'

const client =  new MongoClient(url)


const dbName = "chat";

async function main() {
    await client.connect();
    console.log('Connected successfully to serve')

    const db = client.db(dbName);

    const collection = db.collection('documents');

    

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally( () => client.close()) ;

module.exports = {
 main
}

