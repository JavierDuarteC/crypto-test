const router = require('express').Router();
const User = require('../../controllers/usersController');
const Crypto = require('../../controllers/cryptoController');
const CryptoUser = require('../../controllers/cryptoUserController');
const validator = require('../../utils/validator');
const varType = require('../../utils/varType');
const jwt = require('jsonwebtoken');
const config = require('../../configs/config');

router.route('/signup').post(async (req, res) => {
    try {
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
        if (password && !validator.passwordIsValid(password)) {
            return res.send({
                success: false,
                message: 'Error: Password has to contain at least 8 characters and at least 1 number.'
            });
        } else if (!password) {
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
        if (!varType.isNumeric(fav_crypto)) {
            return res.status(400).send({
                success: false,
                message: 'Error: Favorite cryptocurrency should be numeric.'
            });
        }

        const crypto = await Crypto.findOne({
            id: fav_crypto
        });
        if (!crypto) {
            res.status(400).json({
                success: false,
                message: 'Error: Favorite cryptocurrency not found'
            })
        }

        username = username.toLowerCase();
        //Find users with the same username
        const previusUser = await User.findOne({
            username: username
        });
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
        await newUser.save();

        const newCryptoUser = new CryptoUser()
        newCryptoUser.cryptoId = fav_crypto;
        newCryptoUser.userId = newUser._id;
        await newCryptoUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered with their favorite cryptocurrency!'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }

});

router.route('/login').post(async (req, res) => {
    try {
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

        var user = await User.findOne({
            username: username
        })
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
        await user.save();
        return res.json({
            success: true,
            message: 'User logged in!',
            token: token
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }

});

// router.route('/logout').get((req, res) => {
//     const { query } = req
//     const { token } = query

//     //todo find user by token and delete from db
// })

module.exports = router