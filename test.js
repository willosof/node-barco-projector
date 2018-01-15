var barcoProjector = require('./index');
var pj = new barcoProjector();


pj.on('connect', function(ip) {
	console.log("CONNECT:",ip);
})

pj.on('disconnect', function() {
	console.log('DISCONNECT');
});

pj.connect('10.20.34.46')

pj.request('temperatures', function(err, res) {
	console.log("err", err);
	console.log("res", res);
});
