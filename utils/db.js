const { MongoClient } = require('mongodb');
const URI = 'mongodb+srv://herus2006cripto:Amir2006@cluster0.2lq51go.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

class ConnectionOnce {
    static instance = null;
    #collection = null;

    constructor() {
        if (ConnectionOnce.instance) {
            return ConnectionOnce.instance;
        }
        ConnectionOnce.instance = this;
    }

    async connectToDB() {
        const client = new MongoClient(URI);
        await client.connect();
        this.#collection = client.db('test').collection('ali');
    }

    async getConnect() {
        if (!this.#collection) {
            await this.connectToDB();
        }
        return this.#collection;
    }
}

module.exports = new ConnectionOnce();
