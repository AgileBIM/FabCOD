import os
import subprocess
import os.path
import shutil
import errno
import shlex
import platform
import sys
import json

def copyExecuteInAcad():	
	src = os.path.realpath(os.path.join(os.path.curdir, 'util', 'Builds'))
	dst = os.path.realpath(os.path.join(os.path.curdir, 'out', 'support'))	
	if not os.path.exists(dst):
		os.makedirs(dst)
	shutil.copy(src + '\\ExecuteInAcad.exe', dst + '\\ExecuteInAcad.exe')

def copyFabDataJson():
	src = os.path.realpath(os.path.join(os.path.curdir, 'src', 'support'))
	dst = os.path.realpath(os.path.join(os.path.curdir, 'out', 'support'))
	if not os.path.exists(dst):
		os.makedirs(dst)
	shutil.copy(src + '\\FabricationDefinition.json', dst + '\\FabricationDefinition.json')

def copyDimOptionChoices():
	src = os.path.realpath(os.path.join(os.path.curdir, 'src', 'support'))
	dst = os.path.realpath(os.path.join(os.path.curdir, 'out', 'support'))
	if not os.path.exists(dst):
		os.makedirs(dst)
	shutil.copy(src + '\\DimOptionChoices.json', dst + '\\DimOptionChoices.json')

def copySnippetDefs():
	src = os.path.realpath(os.path.join(os.path.curdir, 'configurations'))
	dst = os.path.realpath(os.path.join(os.path.curdir, 'out', 'support'))
	if not os.path.exists(dst):
		os.makedirs(dst)
	shutil.copy(src + '\\codscript-snippets.json', dst + '\\codscript-snippets.json')

if __name__ == "__main__":
	copyExecuteInAcad()
	copyFabDataJson()
	copyDimOptionChoices()
	copySnippetDefs()
