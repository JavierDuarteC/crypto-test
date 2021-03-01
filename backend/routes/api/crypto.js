const router = require('express').Router()
const Crypto = require('../../controllers/cryptoController')

router.route('/:id').get(async (req, res) => {
    try {
        const cryptoID = req.params.id;
        if (!cryptoID) {
            return res.status(400).json({
                success: false,
                message: 'Error: No cryptocurrency id found'
            })
        }

        var crypto = await Crypto.findOne({
            id: cryptoID
        });
        if (!crypto) {
            return res.status(404).json({
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

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error: ' + err
        });
    }
})

module.exports = router