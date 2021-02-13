const router = require('express').Router();
const User = require('../../controllers/usersController');
const Crypto = require('../../controllers/cryptoController');
const CryptoUser = require('../../controllers/cryptoUserController');
const jwt = require('jsonwebtoken');
const config = require('../../configs/config');

router.route('/signup').post((req, res) => {
    const { body } = req
    let {
        username,
        password,
        name,
        lastname,
        fav_crypto,
    } = body

    if (!username) {
        return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }
    if (!name) {
        return res.send({
            success: false,
            message: 'Error: Name cannot be blank.'
        });
    }
    if (!lastname) {
        return res.send({
            success: false,
            message: 'Error: Lastname cannot be blank.'
        });
    }
    if (!fav_crypto) {
        return res.send({
            success: false,
            message: 'Error: Favorite cryptocurrency cannot be blank.'
        });
    }
    //Verify user's fav_crypto
    if (typeof fav_crypto !== 'number') {
        return res.send({
            success: false,
            message: 'Error: Favorite cryptocurrency should be numeric.'
        });
    }

    Crypto.findOne({
        id: fav_crypto
    })
        .then(crypto => {
            if (!crypto) {
                res.json({
                    success: false,
                    message: 'Error: Favorite cryptocurrency not found'
                })
            }

            username = username.toLowerCase();
            //Find users with the same username
            User.findOne({
                username: username
            })
                .then(previusUser => {
                    if (previusUser) {
                        return res.send({
                            success: false,
                            message: 'Error: Account already exists.'
                        })
                    }

                    //Save new user
                    const newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.name = name;
                    newUser.lastname = lastname;
                    newUser.fav_crypto = fav_crypto;
                    newUser.save()
                        .then((user) => {
                            const newCryptoUser = new CryptoUser()
                            newCryptoUser.cryptoId = fav_crypto;
                            newCryptoUser.userId = user._id;
                            newCryptoUser.save().then(() => {
                                res.json({
                                    success: true,
                                    message: 'User registered with their favorite cryptocurrency!'
                                });
                            })
                                .catch(err => res.status(400).json('Error: ' + err));
                        })
                        .catch(err => res.status(400).json('Error: ' + err))
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(500).json('Error: ' + err));

})

router.route('/login').post((req, res) => {
    const { body } = req
    let {
        username,
        password
    } = body

    if (!username) {
        return res.send({
            success: false,
            message: 'Error: username cannot be blank.'
        })
    }

    if (!password) {
        return res.send({
            success: false,
            message: 'Error: password cannot be blank.'
        })
    }

    username = username.toLowerCase()

    User.findOne({
        username: username
    })
        .then((user) => {
            //invalid credentials
            if (!user) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid username.'
                })
            }

            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password.'
                })
            }

            const payload = {
                check: true
            };
            const token = jwt.sign(payload, config.key, {
                expiresIn: 1440
            });

            //valid credentials
            user.token = token;
            user.save().then(() => {
                res.json({
                    success: true,
                    message: 'User logged in!',
                    token: token
                });
            })
                .catch(err => res.status(400).json('Error: ' + err));

        })
        .catch(err => res.status(400).json('Error: ' + err));

})

router.route('/logout').get((req, res) => {
    const { query } = req
    const { token } = query

    //todo find user by token and delete from db
})

module.exports = router