var path = require('path');
var fs = require('fs');

var repo_path = process.cwd();
var hooks_path = path.join(repo_path, '.git/hooks');
var commit_msg_hook_file = path.join(hooks_path, "commit-msg");
var node_path = process.argv[0];
// var commit_msg_hook_content = "#!" + node_path
//     + "\nvar ciSkipper = require('ci-skipper');"
//     + "\nciSkipper();";
var commit_msg_hook_content = "#!/bin/sh "
    + "\nci-skipper analysis";

function install() {

    CheckRepo();

    if (!isHookExist()) {
        writeHook();
    }
    else if (isInstalled()) {
        console.log('OK!', "CI Skipper is enabled for this repository.");
    }
    else {
        makeBackupHook();
        writeHook();
    }
}

function uninstall() {

    CheckRepo();

    if (isHookExist()) {
        if (isHookModified()) {
            makeBackupHook();
        } else {
            deletHook();
        }
        console.log("ci-skipper is disabled for:", repo_path);
    } else {
        console.log('OK!', "ci-skipper seems already not active for this repository.");
    }
}

function CheckRepo() {
    if (!fs.existsSync(hooks_path)) {
        console.log('Worn!', "Cannot find git repository in this directory.");
        process.exit(1);
    }
}

function isHookExist() {
    return fs.existsSync(commit_msg_hook_file);
}

function isInstalled() {
    var hook = fs.readFileSync(commit_msg_hook_file);
    return hook.indexOf("ci-skipper analysis") > -1;
}

function isHookModified() {
    var hook = fs.readFileSync(commit_msg_hook_file);
    return hook !== commit_msg_hook_content;
}

function writeHook() {
    fs.writeFileSync(commit_msg_hook_file, commit_msg_hook_content, {mode: '777'});
    console.log("ci-skipper enabled for:", repo_path, "\n  SUCCESS!");
}

function makeBackupHook() {
    fs.renameSync(commit_msg_hook_file, commit_msg_hook_file + '_' + new Date() + '.backup');
}

function deleteHook() {
    fs.unlinkSync(commit_msg_hook_file);
}

module.exports.install = install;
module.exports.uninstall = uninstall;