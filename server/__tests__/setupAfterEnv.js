const mongoose = require('mongoose');

beforeEach(async () => {
    await Promise.all(
        Object.values(mongoose.connection.collections).map(async collection => {
            await collection.deleteMany();
        })
    );
}); 