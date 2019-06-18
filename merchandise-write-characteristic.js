var util =require('util');
var os =require('os');
var exec = require('child_process').exec;
var readline = require('readline');
var fs = require('fs');
var UUID = require('./UUID')

var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

let uuid = guid4();
var MerchandiseWriteCharacteristic = function(){
	MerchandiseWriteCharacteristic.super_.call(this,{
		uuid: UUID.MERCHANDISE_WRITE_CHARACTERISTIC_ID,
		properties:['write'],
		descriptors:[
			new Descriptor({
				uuid: '2901',
				value: 'write your marchandise'
			})
		]			
	});
} ;
util.inherits(MerchandiseWriteCharacteristic,Characteristic);

MerchandiseWriteCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
                            var request = data.toString("utf-8")
                            console.log('Write request: ' + request);
                            switch(request){
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
                                    fs.appendFile('/home/pi/test/output.txt', request+';',function(err){
                                        if(err){
                                            console.err(err)
                                        }
                                    })
                            }                                                    
                            callback(this.RESULT_SUCCESS);
 }





function guid4(){
		return 'xxxx'.replace(/[xy]/g,function(c){
			let r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8)
			return v.toString(16);
			})
}


module.exports = MerchandiseWriteCharacteristic;
