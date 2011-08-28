/**
 * Unicorn Easy Restart
 * (c)2011 Matt Farmer
 * http://farmdawgnation.com/
 *
 * Written against node.js v0.4.11.
 * Requires the optimist module.
 *
 * Released under the terms of the Apache License. This software
 * does not come with a warrany of any kind.
**/

//Retrieve the arguments.
var argv = require('optimist')
			.usage('Usage: $0 -p [rails_root]')
			.demand(['p'])
			.argv;

//load file system
var fs = require('fs');

//Determine if p is an array.
if(argv.p instanceof Array) {
	//Then just set it equal to
	var rails_roots = argv.p;
} else {
	//Build a ficticious array.
	var rails_roots = Array(argv.p);
}

for(root in rails_roots) {
	//Watch for changes to the restart.txt file that will signal that
	//the unicorn application server needs to be restarted.
	console.log("Watching " + rails_roots[root] + "/tmp/restart.txt");
	fs.watchFile(rails_roots[root] + "/tmp/restart.txt", function(curr, prev) {
		//Output to console
		console.log(rails_roots[root] + "/tmp/restart.txt changed.");

		//Read the unicorn pid from the unicorn.pid file
		var unicornpid = fs.readFileSync(rails_roots[root] + "/tmp/unicorn.pid", 'utf8');

		//Output to console
		console.log("Sending USR2 to unicorn process " + unicornpid);

		//Send USR2 signal to the unicorn process, starting the reboot
		//cycle.
		process.kill(unicornpid, 'SIGUSR2');
	});
}
