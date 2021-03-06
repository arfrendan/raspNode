
var util = require('util')
var bleno = require('bleno');
var exec = require('child_process').exec;
var os = require('os')
var BarcodeScannerService = require('./barcode-scanner-service')

var primaryService = new BarcodeScannerService();

process.env['BLENO_DEVICE_NAME'] = 'raspberrypi'
console.log(os.hostname())
  
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('raspberrypi', [primaryService.uuid]);
    console.log(primaryService.uuid)
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('accept', function(clientAddress) {
  console.log('on -> accept, client: ' + clientAddress)
  bleno.updateRssi()
})

bleno.on('disconnect', function(clientAddress) {
  //bleno.stopAdvertising( );
  console.log('advertising stop')
  /*
  var BarcodeScannerService = require('./barcode-scanner-service')
  var newService = new BarcodeScannerService();
  bleno.setServices([newService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
    });
  bleno.startAdvertising('rasp pi', [newService.uuid]);
  console.log(newService.uuid)
  */ 
  console.log('on -> disconnect, client: ' + clientAddress)
})


bleno.on('rssiUpdate', function(rssi) {
  console.log('on -> rssiUpdate: ' + rssi)
})

bleno.on('mtuChange', function(mtu) {
  console.log('on -> mtuChange: ' + mtu)
})


bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([primaryService], function(error){
      console.log('setServices: '  + (error ? 'error ' + error : 'success'));
      
      var proc = exec('python3 /home/pi/httpRequest.py',function(err,stdout,stderr){
              console.log('executing')
              if(err){
                  console.log(err) 
                  console.log(stderr)
              }
      })
      
    });
  }
})


bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop')
})

bleno.on('servicesSet', function(error) {
  console.log('on -> servicesSet: ' + (error ? 'error ' + error : 'success'))
});

