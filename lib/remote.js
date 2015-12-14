var cli = module.exports;
var port = 8080;

function executeCmd(cmd) {
	var exec = require('child_process').exec;
	var child = exec(cmd, function (error, stdout, stderr) {
		//console.log("[OK]");
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

function renderView(res, action) {
	res.writeHead(200, { 'content-type': 'text/html' });

	var style = "<style>*{margin: 0;} html, body{height: 100%;} form{height: 100%; display:flex} input{-webkit-appearance: none;} .btn{width: 300px; height: 200px; margin: auto; background: white; border: 2px solid green; font-size: 3rem}</style>";
	var meta = '<meta name="viewport" content="width=device-width"><meta name="viewport" content="initial-scale=1.0">';

	res.end(
		'<html><head>' + meta + style + '</head><body><form action="/" method="post">' +
		'<input type="hidden" name="action" value="' + action + '">' +
		'<button class="btn"><img src="http://pix.iemoji.com/images/emoji/apple/ios-9/33/0294.png">'+ action +'</button>' +
		'</form></body></html>'
		);
}

function createServer(action, cmd) {
	http.createServer(function (req, res) {
		if (req.method.toLowerCase() == 'post') {
			var form = new formidable.IncomingForm();
			form.parse(req, function (err, fields) {
				if (action === fields.action) {
					executeCmd(cmd);
				}
				renderView(res, action);
			});
			return;
		}

		renderView(res, action);

	}).listen(port);
	var qrcode = require('qrcode-terminal');
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		var url = 'http://' + add + ':'+ port +'/';
		console.log(url);
		qrcode.generate(url);
	})
}

cli.exec = function (action, cmd) {
	createServer(action, cmd);
}

