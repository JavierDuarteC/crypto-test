const mongoose = require('mongoose');
const User = require('../controllers/usersController');
const databaseName = 'test'

beforeAll(async () => {
    const url = `mongodb://localhost/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close()
});

describe('User table DB', function () {
    const dummieUser = {
        "username": "javierduartec",
        "password": "dasdabcs1A",
        "name": "Javier",
        "lastname": "Duarte",
        "fav_crypto": 2
    };
    it('save user to db', async done => {

        const user = new User(dummieUser);
        const ret = await user.save();
        expect(ret.name).toBeTruthy();
        expect(ret.lastname).toBeTruthy();
        expect(ret.username).toBeTruthy();
        expect(ret.password).toBeTruthy();
        expect(ret.fav_crypto).toBeTruthy();

        done();
    });
    it('find user in db', async done => {
        const user = await User.findOne({ username: dummieUser.username });

        expect(user.name).toBe(dummieUser.name);
        expect(user.lastname).toEqual(dummieUser.lastname);
        expect(user.username).toEqual(dummieUser.username);
        expect(user.password).toEqual(dummieUser.password);
        expect(user.fav_crypto).toEqual(dummieUser.fav_crypto);

        done();
    });
    it('hash password', () => {
        const user = new User(dummieUser);
        expect(user.password).toEqual(dummieUser.password);
        const hash = user.generateHash(user.password);
        expect(hash).not.toEqual(dummieUser.password);
    });
    it('password validation', () => {
        const user = new User(dummieUser);
        user.password = user.generateHash(user.password);

        expect(user.validPassword(dummieUser.password)).toBeTruthy();
    });

    //expect(user.validPassword(dummieUser.password)).toBe(true);
});