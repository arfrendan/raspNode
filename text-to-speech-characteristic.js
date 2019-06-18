var util =require('util');
var exec = require('child_process').exec;
var aipSpeechClient = require('baidu-aip-sdk').speech;
var readline = require('readline');
var fs = require('fs');

var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;
let uuid = guid4();
var UUID = require('./UUID')

var APP_ID = '16502526'
var API_KEY = 'IW4SYMaGdrCA70Kb8H06lqrZ'
var SECRET_KEY = 'EsKZRFtCZkNydSYcdy3VAhIAEe7FaBU2'
var client = new aipSpeechClient(APP_ID,API_KEY,SECRET_KEY);

var TTSCharacteristic = function(){
	TTSCharacteristic.super_.call(this,{
		uuid: UUID.TEXT_TO_SPEECH_CHARACTERISTIC_ID,
		properties:['notify','read','write'],
		descriptors:[
			new Descriptor({
				uuid: '2901',
				value: 'text to voice characteristic'
			})
		]			
	});
} ;

util.inherits(TTSCharacteristic,Characteristic);

TTSCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	var request = data.toString("utf-8")
	console.log('Write request: ' + request);
	if(request){
		/*
			client.text2audio(request,{spd:12,per:4}).then(function(result){
				if(result.data){
					fs.writeFileSync('tts.mp3',result.data);
		
				}else{
					console.log(result)	
				}
			},function(e){
					console.log(e);
			});
			exec('mplayer tts.mp3',function(err,stdout,stderr){
					if(stdout.length>1){console.log(stdout)}
					if(err){console.info(stderr)}
			})	
			*/
			exec('sudo python3 /home/pi/voiceGenerator.py --readline '+request ,function(err,stdout,stderr){
                  if(stdout.length>1){console.log(stdout)}
                  if(err){console.info(stderr)}
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
module.exports = TTSCharacteristic;
