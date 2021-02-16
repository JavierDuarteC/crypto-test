const mongoose = require('mongoose');
const Crypto = require('../controllers/cryptoController');
const databaseName = 'cryptocurrency-test'

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true })
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close()
});

describe('Crypto table DB', function () {
    const dummieCrypto = {
        "id": 3,
        "name": "WINk",
        "symbol": "WINK",
        "price": 7.801079268969935
    };
    it('save crypto to db', async done => {

        const crypto = new Crypto(dummieCrypto);
        const ret = await crypto.save();

        expect(ret.name).toBeTruthy();
        expect(ret.symbol).toBeTruthy();
        expect(ret.price).toBeTruthy();
        
        done();
    });
    it('find crypto in db', async done =>{
        const crypto = await Crypto.findOne({id:dummieCrypto.id});

        expect(crypto.name).toBe(dummieCrypto.name);
        expect(crypto.symbol).toBe(dummieCrypto.symbol);
        expect(crypto.price).toBe(dummieCrypto.price);
        
        done();
    });
});