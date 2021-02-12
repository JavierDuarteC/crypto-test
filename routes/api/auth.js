const router = require('express').Router();
const User = require('../../controllers/usersController');
const UserSession = require('../../controllers/userSessionController');
const Crypto = require('../../controllers/cryptoController');

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
            if (crypto) {
                console.log(crypto);
            } else {
                res.json({
                    success: false,
                    message: 'Error: Favorite cryptocurrency not found'
                })
            }
        })
        .catch(err => res.status(500).json('Error: ' + err));

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
            const newUser = new User()
            newUser.username = username
            newUser.password = newUser.generateHash(password)
            newUser.name = name;
            newUser.lastname = lastname;
            newUser.fav_crypto = fav_crypto;
            newUser.save()
                .then(() => res.json({
                    success: true,
                    message: 'User added!'
                }))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err));

})

router.route('/signin').post((req, res) => {
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

    User.find({
        username: username
    })
        .then((users) => {
            //invalid credentials
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid username.'
                })
            }

            const user = users[0]
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password.'
                })
            }

            //valid credentials
            UserSession.find({
                userId: user._id
            })
                .then((sessions) => {
                    if (sessions.length > 1) {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid Session.'
                        })
                    } else if (sessions.length == 1) {
                        return res.send({
                            success: true,
                            message: 'Valid sign in.',
                            token: sessions[0]._id
                        })
                    } else {
                        const userSession = new UserSession()
                        userSession.userId = user._id
                        userSession.save()
                            .then((newSession) => {
                                return res.send({
                                    success: true,
                                    message: 'Valid sign in.',
                                    token: newSession._id
                                })
                            })
                            .catch(err => res.status(400).json('Error: ' + err))
                    }
                })
                .catch(err => res.status(400).json('Error: ' + err))

        })
        .catch(err => res.status(400).json('Error: ' + err))

})

router.route('/username').get((req, res) => {
    const { query } = req
    const { token } = query

    if (!token) {
        return res.send({
            success: false,
            message: 'Error: token cannot be blank.'
        })
    }

    UserSession.find({
        _id: token,
        isDeleted: false
    })
        .then((sessions) => {
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }
            const session = sessions[0]
            User.find({
                _id: session.userId
            })
                .then((users) => {
                    //invalid credentials
                    if (users.length != 1) {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid session user ID.'
                        })
                    }
                    const user = users[0]
                    return res.send({
                        success: true,
                        message: 'Username found.',
                        username: user.username
                    })

                })
                .catch(err => res.status(400).json('Error: ' + err))

        })
        .catch(err => res.status(400).json('Error: ' + err))

})

router.route('/verify').get((req, res) => {
    const { query } = req
    const { token } = query

    UserSession.find({
        _id: token,
        isDeleted: false
    })
        .then((sessions) => {
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }

            return res.send({
                success: true,
                message: 'Token is good.'
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/logout').get((req, res) => {
    const { query } = req
    const { token } = query

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        },
    })
        .then(() => {
            return res.send({
                success: true,
                message: 'Session closed.'
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router