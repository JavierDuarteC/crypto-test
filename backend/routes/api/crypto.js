const router = require('express').Router()
const Crypto = require('../../controllers/cryptoController')

router.route('/:id').get((req, res) => {
    const cryptoID = req.params.id;
    if (!cryptoID) {
        return res.json({
            success: false,
            message: 'Error: No cryptocurrency id found'
        })
    }

    Crypto.findOne({
        id: cryptoID
    })
        .then(crypto => {
            if (!crypto) {
                return res.json({
                    success: false,
                    message: 'Error: No cryptocurrency found'
                })
            }
            crypto = crypto.toJSON();
            delete crypto._id;
            delete crypto.__v;
            delete crypto.id;
            delete crypto.createdAt;
            delete crypto.updatedAt;
            return res.json(crypto)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router