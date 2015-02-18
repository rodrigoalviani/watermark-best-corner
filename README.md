#watermark-best-corner

A node.js script to calculate the best corner to watermark a image.
The script uses the color similarity in the region to determine the best corner to the watermark.
The script will return NorthEast, NorthWest, SouthEast or SouthWest. The return could be used in 'gravity' param of imagemagick.

***

###Requirement

- ImageMagick is 6.8.9+

##How to use

```
node app.js -u http://guiadossolteiros.com/wp-content/uploads/2013/08/mulher-lavando-carro-520x245.jpg
```