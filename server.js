var express    = require('express');
var superagent = require('superagent');
var bodyParser = require('body-parser');
var app 	   	 = express();


app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/deals', function(req, res) {
	
	var baseURL ="https://mobile.ctrlio.com/dealengine/v2/deals/product/paym",
			clickAndCollect    = req.query.clickAndCollect 	  || false,
			contractLength     = req.query.contractLength  	  || "",
			data 					     = req.query.data  						  || 1024,
			dedup 					   = req.query.dedup            	|| true,
			includeRefurbished = req.query.includeRefurbished || true,
			includeResellers 	 = req.query.includeResellers   || true,
			limit 					   = req.query.limit 					    || 10,
			mins 							 = req.query.mins 							|| 250,
			only4g 					   = req.query.only4g 						|| false,
			page 							 = req.query.page 							|| 1,
			sortOrder 				 = req.query.sortOrder 				  || "asc",
			sortProperty 			 = req.query.sortProperty 			|| "averaged_monthly",
  		texts 						 = req.query.texts 						  || 200;

  superagent
  	.get(baseURL + 
  							"?clickAndCollect=" + clickAndCollect +
  							"&contractLength=" + contractLength	+
  							"&data=" + data  +
  							"&dedup=" + dedup +
  							"&includeRefurbished=" + includeRefurbished +
								"&includeResellers=" + includeResellers +
								"&limit=" + limit +
								"&mins=" + mins +
								"&only4g=" + only4g +
								"&page=" + page +
								"&sortOrder=" + sortOrder +
								"&sortProperty=" + sortProperty +
					  		"&texts=" + texts)  						
		.set({Accept: 'application/json'})
		.end(function(e, response) {
			if(response.status != 200){
				console.log(response);
				return;
			}

			return res.send(response.text);
		});
});

app.get('/networkProviders', function(req, res) {
	
	var baseURL ="https://mobile.ctrlio.com/dealengine/v2/networkProviders";

  superagent
  	.get(baseURL)  						
		.set({Accept: 'application/json'})
		.end(function(e, response) {
			if(response.status != 200){
				console.log(response);
				return;
			}

			return res.send(response.text);
		});
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
