const helpers = {};

helpers.randomNumber = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0912345678';
    var randomNumber = 0;
    for (let i = 0; i < 15; i++){
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return randomNumber;
}

module.exports = helpers;