const expect = require('expect');

const {generateMessage} = require('./message');

describe('Generate message', () => {
    it('should return the message object', () => {
        var from = "Thivagar";
        var text = "Study Node js";
        var res = generateMessage(from, text);
        expect(res.createdAt).toBeA('number');
        expect(res).toInclude({from, text})
    })
})