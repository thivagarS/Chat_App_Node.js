const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from, 
        text,
        createdAt: moment().valueOf()
    };
};

const generateLocation = (from, location) => {
    return {
        from,
        sendLocation: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
        createdAt: moment().valueOf()
    };
}
 
module.exports = {generateMessage, generateLocation};