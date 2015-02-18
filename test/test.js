'use strict';

var should = require('should')
  , request = require('request')
  , corner = require('../lib/corner');

describe('corner', function () {
  it('should return a corner', function () {
  request('http://guiadossolteiros.com/wp-content/uploads/2013/08/mulher-lavando-carro-520x245.jpg')
    .on('response', function (img) {
      corner(img, function (err, c) {
        if (err) throw err;
        c.should.equal('SouthEast');
      });
    });
  });
});