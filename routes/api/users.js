const router = require('express').Router()
const User = require('../../controllers/usersController')
const Crypto = require('../../controllers/cryptoController');
const CryptoUser = require('../../controllers/cryptoUserController');

router.route('/myprofile').get((req, res) => {
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
                            message: 'Error: No cryptocurrencies associated to your account'
                        })
                    }

                    var cryptos = [];
                    try {
                        await asyncForEach(cryptoUsers, async (cryptoUser) => {
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
                                delete crypto.__v;
                                delete crypto.createdAt;
                                delete crypto.updatedAt;
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

    if (!quantity) {
        return res.send({
            success: false,
            message: 'Error: Quantity cannot be blank.'
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
                    message: 'Error: Invalid token.'
                })
            }

            CryptoUser.findOne({
                userId: user._id,
                cryptoId: id
            })
                .then(async cryptoUser => {
                    if (cryptoUser) {
                        

                    }else{
                        console.log("No crypto associated to this account");
                    }

                })
                .catch(err => {
                    return res.status(500).json('Error: ' + err)
                });

        })
        .catch(err => res.status(400).json('Error: ' + err));

})

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = router