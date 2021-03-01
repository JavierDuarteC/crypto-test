module.exports = {
    passwordIsValid: function (input) {
        return input.match(/^(?=.*[0-9])(?=.*[a-z])([a-zA-Z0-9]{8,})$/);
    },
}