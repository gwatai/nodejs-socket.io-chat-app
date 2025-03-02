const { MongoClient} = require('mongodb')


const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)

const dbName = "chat";

const storeChat = async (message) => {

    try {
        //await client.connect();

        console.log('Connected successfully to store chats')

        const db = client.db(dbName)

        const collection = db.collection('messages')

        const storeMessage = await collection.insertOne(message)
        
        console.log("Messages store successfully",storeMessage)
    } catch (err) {
        console.log("Store messages error", err)
    }

}


async function  retrieveChats()  {


    let messages = []
    try {
    const db =  client.db(dbName)

    const collection = db.collection('messages')

    const cursor = collection.find({}, {user: 1, message: 1})

    
    for await(const doc of cursor)
    {
        messages.push( {
            user: doc.user,
            message: doc.message
        }
        )
    }


    return messages;

    }catch(err)
    {
        console.log("Retrieve chat messages error", err)
    }

}
async function run() {
const chats =  await retrieveChats()
return chats
}



module.exports = {
    storeChat,
    retrieveChats, 
    run
}

