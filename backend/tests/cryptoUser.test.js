const mongoose = require('mongoose');
const Crypto = require('../controllers/cryptoController');
const User = require('../controllers/usersController');
const CryptoUser = require('../controllers/cryptoUserController');
const databaseName = 'cryptouser-test';

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true })
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close()
});

describe('CryptoUser table DB', function () {
    const dummieUser = {
        "username": "javierduartec",
        "password": "dasdabcs1A",
        "name": "Javier",
        "lastname": "Duarte",
        "fav_crypto": 2
    };
    const dummieCrypto = {
        "id": 3,
        "name": "WINk",
        "symbol": "WINK",
        "price": 7.801079268969935
    };
    it('save user´s crypto to db', async done => {

        const crypto = new Crypto(dummieCrypto);
        const ret1 = await crypto.save();
        const user = new User(dummieUser);
        const ret2 = await user.save();

        const cryptoUser = new CryptoUser({
            userId: ret2._id,
            cryptoId: ret1.id
        });
        const ret = await cryptoUser.save();

        expect(cryptoUser.userId).toBeTruthy();
        expect(cryptoUser.cryptoId).toBeTruthy();
        expect(cryptoUser.quantity).toEqual(expect.any(Number));

        done();
    });
    it('find user´s crypto in db', async done => {
        const user = await User.findOne(dummieUser);
        const cryptoUser = await CryptoUser.findOne({
            userId: user._id,
            cryptoId: dummieCrypto.id
        });

        expect(JSON.stringify(cryptoUser.userId)).toEqual(JSON.stringify(user._id));
        expect(cryptoUser.cryptoId).toBe(dummieCrypto.id);
        expect(cryptoUser.quantity).toEqual(expect.any(Number));

        done();
    });
});