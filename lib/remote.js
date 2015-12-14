var cli = module.exports;

function executeCmd(cmd) {
	var exec = require('child_process').exec;
	var child = exec(cmd, function (error, stdout, stderr) {
		console.log("[OK]");
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

function renderView(res, action) {
	res.writeHead(200, { 'content-type': 'text/html' });

	var style = "<style>*{margin: 0;} html, body{height: 100%;} form{height: 100%; display:flex} input{-webkit-appearance: none;} button{width: 200px; height: 200px; margin: auto; background: white; border: 2px solid green; border-radius: 300px; font-size: 10rem}</style>";
	var meta = '<meta name="viewport" content="width=device-width"><meta name="viewport" content="initial-scale=1.0">';

	res.end(
		'<html><head>' + meta + style + '</head><body><form action="/" method="post">' +
		'<input type="hidden" name="action" value="' + action + '">' +
		'<button>&#127843;</button>' +
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

	}).listen(8080);
	var qrcode = require('qrcode-terminal');
	require('dns').lookup(require('os').hostname(), function (err, add, fam) {
		qrcode.generate('http://' + add + ':8080/');
	})
}

cli.exec = function (action, cmd) {
	createServer(action, cmd);
}

