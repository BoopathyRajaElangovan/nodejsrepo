var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;

var org = nforce.createConnection({
  clientId: '3MVG9n_HvETGhr3ABKR7E1noRUVVJ33Z.NKg.62uo1eyjoSudwaJxMue6_PIgVpAkl6cBuJ3pUA==',
  clientSecret: 'B95335BD2BACE042D0D73716E22729A877F978CF7651257AA29EA6DD591B9268',
  redirectUri: 'https://testnodejsdemoapp.herokuapp.com/oauth/_callback',
  apiVersion: 'v34.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

/*Allow CORS*/
app.use(function(req, res, next) {
	 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization,X-Authorization'); 
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
	res.setHeader('Access-Control-Max-Age', '1000');
	  
	next();
});


app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://mylwcstudio-dev-ed.lightning.force.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);