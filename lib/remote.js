var cli = module.exports;

function executeCmd(cmd){
	var exec = require('child_process').exec;
	var child = exec(cmd, function(error, stdout, stderr){
		console.log("[OK]");
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}

cli.exec = function(action, cmd){
	executeCmd(cmd);
}

