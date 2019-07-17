var bleno = require('bleno');
var count = 100;
var readline = require('readline')
var code
var fs = require('fs')
var exec = require('child_process').exec
////    the readline part   ////
var rl = readline.createInterface(
{   input : process.stdin,
    output : process.stdout
});


/*
rl.on('line',function(line){
    code = line
    console.log("the barcode is: " + code)
    fs.appendFile("input.txt",line+';',function(err){
        if(err){ return console.error(err)}
    })
    fs.readFile("input.txt",function(err,data){
        if(err){ return console.error(err)}
        console.log("infile: " +data.toString())
    })
    
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
})
*/
rl.on('close',function(){
   process.exit(0); 
});


////     the bleno part     /////
bleno.on('stateChange', function(state) {
    console.log('State change: ' + state);
    if (state === 'poweredOn') {
        bleno.startAdvertising('MyDevice',['12ab']);
    } else {
        bleno.stopAdvertising();
    }
});
 

bleno.on('accept', function(clientAddress) {
    console.log("Accepted connection from address: " + clientAddress);
});
 

bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected from address: " + clientAddress);
});
 
bleno.on('advertisingStart', function(error) {
    if (error) {
        console.log("Advertising start error:" + error);
    } else {
        console.log("Advertising start success");
        bleno.setServices([
            
            // Define a new service
            new bleno.PrimaryService({
                uuid : '12ab',
                characteristics : [
                    
                    new bleno.Characteristic({
                        value : null,
                        uuid : '34cd',
                        properties : ['notify', 'read', 'write'],
                        
                        onSubscribe : function(maxValueSize, updateValueCallback) {
                            console.log("Device subscribed");
                            updateValueCallback(new Buffer("ready for barcode scanning!"));
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
                                
                            })
                            
                        },

                        onNotify : function(){
                                console.log('notify')
                        },
                        
                        onUnsubscribe : function() {
                            console.log("Device unsubscribed");
                            clearInterval(this.intervalId);
                        },
                        

                        onReadRequest : function(offset, callback) {
                            console.log("Read request received");
                             exec('cat ./list.txt',function(err,stdout,stderr){
                            var data = stdout.toString();
                            console.log(data);
                            callback(this.RESULT_SUCCESS, new Buffer("Echo: "));
                            }) 
                            //callback(this.RESULT_SUCCESS, new Buffer("Echo: " + 
                            //(this.value ? this.value.toString("utf-8") : "")));
                        },
                        
                        onWriteRequest : function(data, offset, withoutResponse, callback) {
                            this.value = data;
                            console.log('Write request: value = ' + this.value.toString("utf-8"));
                            
                            var writeCase = this.value.toString("utf-8")
                            switch(writeCase){
                                case 'clearin':
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
                                
                                case 'play':
                                    exec('python3 /home/pi/voiceGenerator.py',function(err,stdout,stderr){
                                            if(stdout.length>1){console.log(stdout)}
                                            if(err){console.info(stderr)}
                                        
                                    })
                                    break;
                                    
                                default:
                                    fs.appendFile('output.txt', this.value.toString("utf-8")+';',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                            }
                            
                            /*
                            if(this.value.toString("utf-8") == 'clearin' ){
                                 
                            }
                            
                            if(this.value.toString("utf-8") == 'clearout' ){
                                 
                            }
                            */
                            
                            callback(this.RESULT_SUCCESS);
                        }

                        
                    })
                    
                    
                ]
            })
        ]);
    }
});
