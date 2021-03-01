const router = require('express').Router()
const User = require('../../controllers/usersController')
const Crypto = require('../../controllers/cryptoController');
const CryptoUser = require('../../controllers/cryptoUserController');
const varType = require('../../utils/varType');
const asyncFor = require('../../utils/asyncFor');

router.route('/me').get(async (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    try {
        const user = await User.findOne({
            token: token
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Error: Invalid token.'
            })
        }
        let crypto = await Crypto.findOne({
            id: user.fav_crypto
        });
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
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        })
    }
});

router.route('/mycrypto').get(async (req, res) => {
    try {
        var token = req.headers.authorization.split(" ")[1];

        const user = await User.findOne({
            token: token
        });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'Error: Invalid token.'
            })
        }

        const cryptoUsers = await CryptoUser.find({
            userId: user._id
        });
        if (cryptoUsers.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error: No cryptocurrencies associated with your account'
            })
        }

        var cryptos = [];

        await asyncFor.asyncForEach(cryptoUsers, async (cryptoUser) => {
            var crypto = await Crypto.findOne({
                id: cryptoUser.cryptoId
            });
            if (!crypto) {
                return res.status(500).json({
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
        });

        return res.json(cryptos);

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }
});

router.route('/add').post(async (req, res) => {
    try {
        var token = req.headers.authorization.split(" ")[1];
        const { body } = req
        let {
            id,
            quantity
        } = body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Error: crypto ID cannot be blank.'
            })
        } else if (!varType.isNumeric(id)) {
            return res.status(400).json({
                success: false,
                message: 'Error: Crypto ID has to be numeric.'
            })
        }
        if (quantity) {
            if (!varType.isNumeric(quantity)) {
                return res.status(400).json({
                    success: false,
                    message: 'Error: Quantity has to be numeric.'
                })
            }
        }

        const user = await User.findOne({
            token: token
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Error: Invalid token.'
            })
        }

        const cryptoUsers = await CryptoUser.findOne({
            userId: user._id,
            cryptoId: id
        })

        if (!cryptoUsers) {
            //associates the logged user with this cryptocurrency
            const newCryptoUser = new CryptoUser();
            newCryptoUser.userId = user._id;
            newCryptoUser.cryptoId = id;
            if (quantity) {
                newCryptoUser.quantity = quantity;
            }
            await newCryptoUser.save();
            return res.json({
                success: true,
                message: 'User associated with a cryptocurrency!'
            });
        } else {
            //changes the quantity of this cryptocurrency for the logged user
            if (quantity) {
                cryptoUsers.quantity += quantity;
                await cryptoUsers.save();
                return res.json({
                    success: true,
                    message: 'User updated their cryptocurrency quantity!'
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Currency is already associated with this User!'
                });
            }
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }

})

router.route('/:user').get(async (req, res) => {
    try {
        var token = req.headers.authorization.split(" ")[1];
        const username = req.params.user;
        const asc = req.query.asc;
        var order = 1;
        if (asc) {
            if (asc === "true") {
                order = -1;
            }
        }
        const user = await User.findOne({
            token: token
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Error: Invalid token.'
            })
        }
        const mycrypto = await Crypto.findOne({
            id: user.fav_crypto
        });
        if (!mycrypto) {
            res.status(500).json({
                success: false,
                message: 'Error: Favorite cryptocurrency not found'
            })
        }

        const userFound = await User.findOne({
            username: username
        });
        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: 'Error: Invalid username.'
            })
        }
        const cryptoUsers =  await CryptoUser.find({
            userId: userFound._id
        }).sort({ price: order }).limit(3);

        if (cryptoUsers.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Error: No cryptocurrencies associated with this account'
            })
        }

        var cryptos = [];
        await asyncFor.asyncForEach(cryptoUsers, async (cryptoUser) => {

            var crypto = await Crypto.findOne({
                id: cryptoUser.cryptoId
            });
            if (!crypto) {
                return res.status(500).json({
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
        });

        return res.json(cryptos);

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }
});

module.exports = router