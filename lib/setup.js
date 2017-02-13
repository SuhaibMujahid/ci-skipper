var path = require('path');
var fs = require('fs');

var repo_path = process.cwd();
var hooks_path = path.join(repo_path,'.git/hooks');
var commit_msg_hook_file = path.join(hooks_path,"commit-msg");
var node_path = process.argv[0];
var commit_msg_hook_content = "#!"+node_path
							+ "\nvar ciSkipper = require('/Users/sm/Desktop/Projects/ci-skip/ci-skipper');"
							+ "\nciSkipper();";


function install(){
	

	if(!isGitRepo()) {
		console.log('Worn!',"Can't find git repository in this directory.");
	}
	else if(!isHookExist()){
		writeHook();
	}
	else if (isInstalled()) {
		console.log('OK!',"ci-skipper seems already `Enabled` for this repository.");
	}
	else{
		makeBackupHook();
		writeHook();
	}	
}



function uninstall(){
	if (isHookExist() && isInstalled()) {
		 makeBackupHook();
		console.log("ci-skipper disenabled for:",repo_path);
	}else{
		console.log('OK!',"ci-skipper seems already is not active for this repository.");
	}
}


function isGitRepo(){
	return fs.existsSync(hooks_path);
}

function isHookExist(){
	return fs.existsSync(commit_msg_hook_file);
}

function isInstalled(){
	 var hook =fs.readFileSync(commit_msg_hook_file);
	 if(hook.indexOf(commit_msg_hook_content) == -1) return false;

	 return true;
}

function writeHook(){
		fs.writeFileSync(commit_msg_hook_file,commit_msg_hook_content,{ mode: '777' });
		console.log("ci-skipper enabled for:",repo_path);
}	

function makeBackupHook(){
	fs.renameSync(commit_msg_hook_file,commit_msg_hook_file+'_'+new Date()+'.backup')
}




module.exports.install = install;
module.exports.uninstall = uninstall;
