#!/usr/bin/env node

var ROOT_DIR = process.argv[2];
var DIRS_TO_COPY = [{
	srcDir: "resources/other/android/res/",
	destDir: "platforms/android/res/"
}];

var fs = require('fs');
var path = require('path');

function copyFileSync(srcFile, target) {
	var destFile = target;

	//if target is a directory a new file with the same name will be created inside it
	if (fs.existsSync(target)) {
		if (fs.lstatSync(target).isDirectory()) {
			destFile = path.join(target, path.basename(srcFile));
		}
	}

	//console.log('copying ' + srcFile + ' to ' + destFile);
	fs.writeFileSync(destFile, fs.readFileSync(srcFile));
}

function copyFolderRecursiveSync(sourceFolder, targetFolder) {
	var files = null;

	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder);
	}

	//copy
	if (fs.lstatSync(sourceFolder).isDirectory()) {
		files = fs.readdirSync(sourceFolder) || [];

		files.forEach(function(curSource) {
			var curSourceFull = path.join(sourceFolder, curSource);

			if (fs.lstatSync(curSourceFull).isDirectory()) {
				var curTargetFolder = path.join(targetFolder, path.basename(curSource));
				copyFolderRecursiveSync(curSourceFull, curTargetFolder);
			} else {
				copyFileSync(curSourceFull, targetFolder);
			}
		});
	}
}

DIRS_TO_COPY.forEach(function(dirInfo) {
	var srcDirFull = path.join(ROOT_DIR, dirInfo.srcDir);
	var destDirFull = path.join(ROOT_DIR, dirInfo.destDir);
	copyFolderRecursiveSync(srcDirFull, destDirFull);
});