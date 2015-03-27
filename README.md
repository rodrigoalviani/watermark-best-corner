#watermark-best-corner

A node.js script to calculate the best corner to apply watermark in a image.
The script uses the color similarity to determine the best corner to apply watermark.
The script will return NorthEast, NorthWest, SouthEast or SouthWest. The return could be used as 'gravity' parameter of imagemagick.

***

###Requirement

- ImageMagick is 6.8.9+

##How to use

Require lib
```
var corner = require('./lib/corner');
```

Send a image to corner function
```
request({
    url: encodeURI('http://www.website.com/image.jpg')
  })
  .on('response', function (img) {
    corner(img, function (c) {
      console.log(c);
    });
  });
```

Or try a command line
```
node app.js -u http://guiadossolteiros.com/wp-content/uploads/2013/08/mulher-lavando-carro-520x245.jpg
```
