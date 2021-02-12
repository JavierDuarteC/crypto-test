const router = require('express').Router();
const Crypto = require('../../controllers/cryptoController');
const http = require("https");

router.route('/').get((req, res) => {

    const options = {
        "method": "GET",
        "hostname": "bravenewcoin.p.rapidapi.com",
        "port": null,
        "path": "/asset?status=ACTIVE&type=CRYPTO",
        "headers": {
            "x-rapidapi-key": "d89074f7admsh13cf1be25abc07ap18c247jsnb4f298baab67",
            "x-rapidapi-host": "bravenewcoin.p.rapidapi.com",
            "useQueryString": false
        }
    };

    const requestBNC = http.request(options, function (responseBNC) {
        const chunks = [];
        responseBNC.on("data", function (chunk) {
            chunks.push(chunk);
        });
        responseBNC.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
            return res.json({
                success: true,
                message: 'Database loaded!'
            });
        });
    });

    requestBNC.end();

});

module.exports = router