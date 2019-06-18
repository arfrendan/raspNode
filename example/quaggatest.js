/*var exec = require('child_process').exec,child;

child = exec('zbarcam /dev/video0  --prescale=640x480 ',function(error,stdout,stderr){
	if(error){
		console.log(error.stack);
		console.log('error code'+ error.code);
		console.log('Signal received:'+error.signal);
	}
	
	console.log('code:'+stdout);
	console.log(stderr);
	});
	child.on('exit',function(code){
		console.log('child process with exit code'+code);
		
		});
*/

var zbar = require('zbar')

c/*

function capture(){
	zbar.on('data',function(buf){
	
	console.log('data scanned: '+ buf.toString())
})
	setTimeout(capture,1000)
	
	
}
*/

function capture(){
	zbar.stdout.on('data', function(buf) {
  console.log(buf.toString());
});
}
setTimeout(capture,1)


/*
setTimeout(capture,1000)
zbar.stderr.on('data',function(buf){
	
	console.log('error' + buf.toString())
	
});
*/

