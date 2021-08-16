/*Setup*/
var request = require('request');
var dotenv = require('dotenv').config();

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({
    defaultLayout: 'other'
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var cors = require('cors');
app.use(cors({
    origin: '*'
}));

var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.API_KEY);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
app.listen(port);

/*Functions*/
function search(tag, number) {
    //Use photo search function from Flickr API
    var result = flickr.photos.search({
        tags: tag,
        per_page: number
      }).then(function (res) {
        var content = res.body.photos.photo;
        console.log('Success', content);
        return content;
      }).catch(function (err) {
        console.error('Error', err);
        return err;
      });
    return result;
}

/*API*/
app.get('/search', function(req, res, next) {
    var tag = req.query.tag; //Tags to search by
    var number = req.query.number; //Number of results to return
    var photos = new Promise (function (resolve, reject) {
        var search = search(tag, number);
        console.log(search);
        resolve(search);
    });
    photos.then(function(result) {
        console.log(result);
        res.send(result);
    })
});

/*Error Handling*/
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

/*Port*/
app.listen(app.get('port'), function () {
    console.log('Express started. Press Ctrl-C to terminate.');
});