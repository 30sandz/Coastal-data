const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    global.__MONGO_URI__ = uri;
    global.__MONGOD__ = mongod;
}; 