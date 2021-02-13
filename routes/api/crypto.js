const router = require('express').Router()
let Crypto = require('../../controllers/cryptoController')

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
                    message: 'Error: No cryptocurrency id found'
                })
            }
            crypto = crypto.toJSON();
            delete crypto._id;
            delete crypto.__v;
            delete crypto.createdAt;
            delete crypto.updatedAt;
            return res.json(crypto)
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    const cryptoID = req.params.id;
    const newPrice = req.body.price;
    console.log(req.body);
    if (!cryptoID) {
        return res.json({
            success: false,
            message: 'Error: No cryptocurrency id found'
        })
    }
    if (!newPrice) {
        return res.json({
            success: false,
            message: 'Error: New cryptocurrency price needed to update'
        })
    }
    Crypto.findOne({
        id: cryptoID
    })
        .then(crypto => {
            if (!crypto) {
                return res.json({
                    success: false,
                    message: 'Error: No cryptocurrency id found'
                })
            }
            crypto.price = newPrice;
            crypto.save()
                .then(() => res.json({
                    success: true,
                    message: 'Crypto updated!'
                }))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router