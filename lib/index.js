var file_extensions = require('../file_extensions');
const path = require('path')
const execSync = require('child_process').execSync;
const fs = require('fs')
const types = Object.keys(file_extensions)


module.exports = function (){

	var t = execSync("git diff --cached --name-status",{encoding:'utf8'})
	// console.log(t)
	// t.replace(/	(.*):   (.*)/g, handelFile)
	t.replace(/(.*)	(.*)/g, handelFile)
	console.log('➜','[ci skip]')

	var commit_msg = fs.readFileSync('.git/COMMIT_EDITMSG','utf8')
	if(commit_msg.search(/(\[skip ci\])|(\[ci skip\])/i) == -1){
		fs.appendFileSync('.git/COMMIT_EDITMSG',' [ci skip]')
	}
}


function handelFile(full,action,file){

		var extension = path.extname(file).toLowerCase()
		var type =getType(file,extension)

		if (type == 'meta' || 
			type == 'media' ||
			type == 'doc'){
			console.log('✓',action,file,':',type)
		}else if((extension === '.java') && action === 'M'){

			const old_version = ignoreTheFormate(execSync("git show head:"+file,{encoding:'utf8'}))
			const new_version = ignoreTheFormate(fs.readFileSync(file,'utf8'))

			const code_change = old_version !== new_version

			if(code_change){
				console.log('✗',action,file,':',type)
				console.log('➜','can not skip (changing code)')
				process.exit(0)
			}else{
				console.log('✓',action,file,':',type,'(only formating changes)')
			}			
		}else{
			console.log('✗',action,file,':',type)
			console.log('➜','can not skip')
			process.exit(0)
		}
}

function ignoreTheFormate(string_code){
	return string_code.replace(/\/\/(.*)|\/\*(\*(?!\/)|[^*])*\*\//g,'').replace(/([\\\]+<>=*(){}[,;-])/g,"\n$1\n").replace(/\s(\s*)/g,"\n").trim()
}

function getType(file,extension){
	for (var i = 0; i < types.length; i++) {
		if(file_extensions[types[i]].indexOf(extension) > -1){
			return types[i];
		}
	}
	if(extension === ''){
		var file_name = path.basename(file)
		if (file_name.indexOf('.git') == 0 ||
			file_name.indexOf('.bzr') == 0 ||
			file_name.indexOf('.svn') == 0 ||
			file_name.indexOf('.cvs') == 0) 
			return 'meta'
	}
	return "unknown"
}