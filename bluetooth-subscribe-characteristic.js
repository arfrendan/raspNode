var util =require('util');
var os =require('os');
var exec = require('child_process').exec;
var readline = require('readline');
var fs = require('fs');
var UUID = require('./UUID')
var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var base64arraybuffer = require('./base64-arraybuffer')
var gb2312ToBase64 = require('./gb2312ToBase64')

const execS = util.promisify(require('child_process').exec);

var express = require('express')
var bodyParse = require('body-parser')

let uuid = UUID.BLUETOOTH_SUBSCRIBE_CHARACTERISTIC_ID ;
var rl = readline.createInterface(
{   input : process.stdin,
    output : process.stdout
});

async function readList(){
	const {stdout, stderr} = await exec('cat  /home/pi/test/input.txt');
	//console.log(stdout)
	return stdout;
	}
	
	
function bufferToArray(buf){
	let ab = new ArrayBuffer(buf.length);
	var view = new Uint8Array(ab);
	for(var i = 0;i<buf.length;++i){
		view[i] = buf[i]
		}
	return ab;
	}
var server = express()
	server.use(bodyParse.json())
	server.use(bodyParse.urlencoded({extended:false}))
server.listen(3000)
console.log('port 3000')
	
var BluetoothSubscribeCharacteristic = function(){
	BluetoothSubscribeCharacteristic.super_.call(this,{
		uuid: uuid ,
		properties:['notify','write','read'],
		descriptors:[
			new Descriptor({
				uuid: '2901',
				value: 'subscribe on device'
			})
		]			
	});
} ;

util.inherits(BluetoothSubscribeCharacteristic,Characteristic);

BluetoothSubscribeCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback){
	console.log("Device subscribed");
    updateValueCallback(new Buffer("ready for barcode scanning!"));
    exec('mplayer /home/pi/subscribe.mp3',function(err,stdout,stderr){
		 console.log('subscribe request notifying...')
		 if(err){
			 console.log(err) 
			 console.log(stderr)
		 }
	 })
    
    
	server.post('/',function(request,response){
		//console.log(request.hostname)
		//console.log(request.body)
		
		var code = request.body
		updateValueCallback(new Buffer(code.code));
		//console.log(request.hostname)
		response.send('post')
	})
    
	this.changeInterval = setInterval(function(){
		exec('/home/pi/weight',function(err,stdout,stderr){
			if(err){
				console.log(err)}
			let data = new Buffer(stdout)
			console.log(stdout)	
			}
			)
		//
		}.bind(this),500)
    /*
    exec('python3 /home/pi/evdevTest.py',function(err,stdout,stderr){
		 console.log('executing')
		 if(err){
			 console.log(err) 
			 console.log(stderr)
		 }
		 if(stdout){
				console.log(stdout);
				updateValueCallback(new Buffer(stdout));
				var code = stdout;
				 exec('python3 /home/pi/printerTest.py  --command '+code,function(err,stdout,stderr){
                        if(stdout.length>1){console.log(stdout)}
                        if(err){console.info(stderr)}
          })
	 
		 } 
		 }) 
    
    */
    
    /*
	rl.on('line',function(line){
		
         let code = line
         console.log("the barcode is: " + code)
         updateValueCallback(new Buffer("code: " + (code? code : "")+'\n'));
                                
         fs.appendFile("input.txt",line+';',function(err){
			if(err){ return console.error(err)}
         })
	 
         fs.readFile("input.txt",function(err,data){
			if(err){ return console.error(err)}
			console.log("infile: " +data.toString())
         })
	 }
         */
     
		 
	/*
         if(line.trim() == 'close'){ 
			rl.close(); 
         }
         if(line.trim() == 'clear'){ 
			fs.unlink('input.txt',function(err){
				if(err){
					console.err(err)
				}
			})
			fs.writeFile('input.txt','',function(err){
				if(err){
					console.err(err)
				}
			})
         }
     */                       
     }
      
 

BluetoothSubscribeCharacteristic.prototype.onUnsubscribe = function() {
          console.log("Device unsubscribed ");
          exec('mplayer /home/pi/exit.mp3',function(err,stdout,stderr){
			if(err){
			 console.log(err) 
			 console.log(stderr)
			}
			})
          clearInterval(this.intervalId);
          if(this.changeInterval){
			  clearInterval(this.changeInterval)
			  this.changeInterval = null
			}
}
BluetoothSubscribeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
							var self = this; 
                            //var request = data.toString("utf-8")
                            
                            //var arr = bufferToArray(data)
                            //var base2 = base64arraybuffer.encode(arr);
                            //var info2 = gb2312ToBase64.decode64(base2);
                            
                            
                            
                            var base = base64arraybuffer.encode(data);
                            var info = gb2312ToBase64.decode64(base);
                            
                            
                            console.log('base:'+base)
                            console.log('gb:'+info)
                            
                            //console.log('Write request: ' + request);
                            exec('mplayer /home/pi/receive.mp3',function(err,stdout,stderr){
								 console.log('write request notifying...')
								 if(err){
									 console.log(err) 
									 console.log(stderr)
								 }
							 })
                            
                            switch(info){
                                case 'clear':
                                    fs.unlink('input.txt',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                                    fs.writeFile('input.txt','',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                                    break;
                                
                                
                                case 'clearout':
                                    fs.unlink('output.txt',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                                    fs.writeFile('output.txt','',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                                    break;
                                                                                                
                                default:
                                    fs.appendFile('/home/pi/test/input.txt', info+"\n",function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                                    exec('python3 /home/pi/printer2.py "'+info+'"',function(err,stdout,stderr){
                                            if(stdout.length>1){console.log(stdout)}
                                            if(err){console.info(stderr)}
                                    })
                                    break;
                            }    
                                                      
                            //self._updateValueCallback(data) ;                     
                            callback(this.RESULT_SUCCESS);
}
 
BluetoothSubscribeCharacteristic.prototype.onReadRequest = async function(offset,callback){
	console.log("Read request received");
	exec('mplayer /home/pi/read.mp3',function(err,stdout,stderr){
		 console.log('read request notifying...')
		 if(err){
			 console.log(err) 
			 console.log(stderr)
		 }
	 })
	var rl = await readList();
	callback(this.RESULT_SUCCESS, new Buffer("Echo: "+rl) );
        exec('cat ./list.txt',function(err,stdout,stderr){
		var data = stdout.toString();
		//console.log(data);
		callback(this.RESULT_SUCCESS, new Buffer("Echo: " + data));
		// return data;
		}) 
}

function guid4(){
		return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			let r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8)
			return v.toString(16);
			})
}

module.exports = BluetoothSubscribeCharacteristic;
