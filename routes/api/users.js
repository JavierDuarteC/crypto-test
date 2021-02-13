const router = require('express').Router()
const User = require('../../controllers/usersController')
const Crypto = require('../../controllers/cryptoController');
const CryptoUser = require('../../controllers/cryptoUserController');
const Utils = require('../../configs/utils');

router.route('/me').get((req, res) => {
    var token = req.headers.authorization.split(" ")[1];

    User.findOne({
        token: token
    })
        .then((user) => {
            if (!user) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid token.'
                })
            }
            Crypto.findOne({
                id: user.fav_crypto
            })
                .then(crypto => {
                    if (!crypto) {
                        res.json({
                            success: false,
                            message: 'Error: Favorite cryptocurrency not found'
                        })
                    }
                    crypto = crypto.toJSON();
                    delete crypto._id;
                    delete crypto.id;
                    delete crypto.__v;
                    delete crypto.createdAt;
                    delete crypto.updatedAt;
                    return res.json({
                        username: user.username,
                        name: user.name,
                        lastname: user.lastname,
                        fav_crypto: crypto
                    });
                })
                .catch(err => res.status(500).json('Error: ' + err));

        }).catch(err => {
            return res.status(400).json('Error: ' + err);
        });
});

router.route('/mycrypto').get((req, res) => {
    var token = req.headers.authorization.split(" ")[1];

    User.findOne({
        token: token
    })
        .then((user) => {
            if (!user) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid token.'
                })
            }

            CryptoUser.find({
                userId: user._id
            })
                .then(async cryptoUsers => {
                    if (cryptoUsers.length === 0) {
                        return res.json({
                            success: false,
                            message: 'Error: No cryptocurrencies associated with your account'
                        })
                    }

                    var cryptos = [];
                    try {
                        await Utils.asyncForEach(cryptoUsers, async (cryptoUser) => {
                            try {
                                var crypto = await Crypto.findOne({
                                    id: cryptoUser.cryptoId
                                });
                                if (!crypto) {
                                    return res.json({
                                        success: false,
                                        message: 'Error: Cryptocurrency not found'
                                    })
                                }
                                crypto = crypto.toJSON();
                                delete crypto._id;
                                delete crypto.id;
                                delete crypto.__v;
                                delete crypto.createdAt;
                                delete crypto.updatedAt;
                                crypto.quantity = cryptoUser.quantity;
                                cryptos.push(crypto);

                            } catch (err) {
                                return res.status(500).json('Error: ' + err)
                            }
                        });

                        return res.json(cryptos);

                    } catch (err) {
                        return res.status(500).json('Error: ' + err)
                    }
                })
                .catch(err => {
                    return res.status(500).json('Error: ' + err)
                });
        }).catch(err => {
            return res.status(400).json('Error: ' + err);
        });
});

router.route('/add/mycrypto').post((req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    const { body } = req
    let {
        id,
        quantity
    } = body

    if (!id) {
        return res.send({
            success: false,
            message: 'Error: crypto ID cannot be blank.'
        })
    }
    if (quantity) {
        if (typeof quantity !== 'number') {
            return res.send({
                success: false,
                message: 'Error: Quantity has to be numeric.'
            })
        }
    }

    User.findOne({
        token: token
    })
        .then((user) => {
            //invalid credentials
            if (!user) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid token.'
                })
            }

            CryptoUser.findOne({
                userId: user._id,
                cryptoId: id
            })
                .then(async cryptoUsers => {
                    if (!cryptoUsers) {
                        console.log("No crypto associated with this account");
                        const newCryptoUser = new CryptoUser();
                        newCryptoUser.userId = user._id;
                        newCryptoUser.cryptoId = id;
                        if (quantity) {
                            newCryptoUser.quantity = quantity;
                        }
                        newCryptoUser.save().then(() => {
                            return res.json({
                                success: true,
                                message: 'User associated with a cryptocurrency!'
                            });
                        })
                            .catch(err => res.status(400).json('Error: ' + err));
                    } else {
                        //change quantity
                        if (quantity) {
                            cryptoUsers.quantity += quantity;
                            cryptoUsers.save().then(() => {
                                return res.json({
                                    success: true,
                                    message: 'User updated their cryptocurrency quantity!'
                                });
                            })
                                .catch(err => res.status(400).json('Error: ' + err));
                        } else {
                            return res.json({
                                success: false,
                                message: 'Currency is already associated with this User!'
                            });
                        }
                    }
                })
                .catch(err => {
                    return res.status(500).json('Error: ' + err)
                });

        })
        .catch(err => res.status(400).json('Error: ' + err));

})

router.route('/:user').get((req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    const username = req.params.user;
    const asc = req.query.asc;
    var order = 1;
    if (asc) {
        if (asc === "true") {
            order = -1;
        }
    } User.findOne({
        token: token
    })
        .then((user) => {
            if (!user) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid token.'
                })
            }
            Crypto.findOne({
                id: user.fav_crypto
            })
                .then(mycrypto => {
                    if (!mycrypto) {
                        res.json({
                            success: false,
                            message: 'Error: Favorite cryptocurrency not found'
                        })
                    }

                    User.findOne({
                        username: username
                    })
                        .then((userFound) => {
                            if (!userFound) {
                                return res.send({
                                    success: false,
                                    message: 'Error: Invalid username.'
                                })
                            }
                            CryptoUser.find({
                                userId: userFound._id
                            }).sort({ price: order }).limit(3)
                                .then(async cryptoUsers => {
                                    if (cryptoUsers.length === 0) {
                                        return res.json({
                                            success: false,
                                            message: 'Error: No cryptocurrencies associated with this account'
                                        })
                                    }

                                    var cryptos = [];
                                    try {
                                        await Utils.asyncForEach(cryptoUsers, async (cryptoUser) => {
                                            try {
                                                var crypto = await Crypto.findOne({
                                                    id: cryptoUser.cryptoId
                                                });
                                                if (!crypto) {
                                                    return res.json({
                                                        success: false,
                                                        message: 'Error: Cryptocurrency not found'
                                                    })
                                                }
                                                crypto = crypto.toJSON();
                                                delete crypto._id;
                                                delete crypto.id;
                                                delete crypto.__v;
                                                delete crypto.createdAt;
                                                delete crypto.updatedAt;
                                                crypto.price_mycrypto = (crypto.price) / mycrypto.price;
                                                cryptos.push(crypto);

                                            } catch (err) {
                                                return res.status(500).json('Error: ' + err)
                                            }
                                        });

                                        return res.json({ currencies: cryptos });

                                    } catch (err) {
                                        return res.status(500).json('Error: ' + err)
                                    }
                                })
                                .catch(err => {
                                    return res.status(500).json('Error: ' + err)
                                });
                        }).catch(err => {
                            return res.status(400).json('Error: ' + err);
                        });

                })
                .catch(err => res.status(500).json('Error: ' + err));
        }).catch(err => {
            return res.status(400).json('Error: ' + err);
        });
});

module.exports = router