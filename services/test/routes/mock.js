var expect = require('chai').expect,
    should = require('chai').should();

module.exports = function(reqParams, reqBody, route, onSuccess, done) {
    var req = { body: reqBody, params: reqParams };
    var res = { json: onSuccess, send: function(err) { expect(err).to.not.be.ok; done();} };
    route(req, res);
}

