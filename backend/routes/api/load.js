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
            "x-rapidapi-key": "d89074f7admsh13cf1be25abc07ap18c247jsnb4f298baab67",//todo remove this token
            "x-rapidapi-host": "bravenewcoin.p.rapidapi.com",
            "useQueryString": false
        }
    };

    const requestBNC = http.request(options, function (responseBNC) {
        const chunks = [];
        try {
            responseBNC.on("data", function (chunk) {
                chunks.push(chunk);
            });
            responseBNC.on("end", async function () {
                const body = Buffer.concat(chunks);
                const content = JSON.parse(body.toString()).content;
                let cryptos = [];
                for (var index in content) {
                    const newCrypto = new Crypto();
                    newCrypto.id = index;
                    newCrypto.name = content[index].name;
                    newCrypto.symbol = content[index].symbol;
                    newCrypto.price = Math.random() * 10; //price is a random number, not real
                    cryptos.push(newCrypto);
                }
                await Crypto.create(cryptos);
                return res.send({ success: true, message: "Crypto loaded to DB" });
            });
        } catch (err) {
            return res.send({
                success: false,
                message: "Error: Could not add crypto to DB " + err
            });
        }
    });
    requestBNC.end();
});

module.exports = router