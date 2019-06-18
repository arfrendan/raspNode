var util =require('util');
var os =require('os');
const exec = util.promisify(require('child_process').exec);
var readline = require('readline');
var fs = require('fs');
var UUID = require('./UUID')

var bleno = require('bleno');
var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

let uuid = guid4();
var MerchandiseListCharacteristic = function(){
	MerchandiseListCharacteristic.super_.call(this,{
		uuid: UUID.MERCHANDISE_LIST_CHARACTERISTIC_ID,
		properties:['read'],
		descriptors:[
			new Descriptor({
				uuid: '2901',
				value: 'read your list'
			})
		]			
	});
} ;


util.inherits(MerchandiseListCharacteristic,Characteristic);
async function readList(){
	const {stdout, stderr} = await exec('cat  /home/pi/test/input.txt');
	//console.log(stdout)
	return stdout;
	}
MerchandiseListCharacteristic.prototype.onReadRequest = async function(offset,callback){
	console.log("Read request received");
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
		return 'xxxx'.replace(/[xy]/g,function(c){
			let r = Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8)
			return v.toString(16);
			})
}


module.exports = MerchandiseListCharacteristic;
