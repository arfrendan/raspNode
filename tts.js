var aipSpeechClient = require('baidu-aip-sdk').speech;
var fs = require('fs')
var exec = require('child_process').exec

var APP_ID = '16502526'
var API_KEY = 'IW4SYMaGdrCA70Kb8H06lqrZ'
var SECRET_KEY = 'EsKZRFtCZkNydSYcdy3VAhIAEe7FaBU2'
var client = new aipSpeechClient(APP_ID,API_KEY,SECRET_KEY);

client.text2audio('GitLab 是一个用于仓库管理系统的开源项目, Github 是一个用于仓库管理系统的开源项目',{spd:12,per:4}).then(function(result){
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

