import os
import subprocess
import os.path
import shutil
import errno
import shlex
import platform
import sys
import json

def copyFile(src, dst, description):
    try:
        shutil.copy(src, dst)
        print("===============================================")
        print("          " + description)
        print("===============================================")
        print("\n\n")
    except IOError as e:
        print("Unable to copy file. %s" % e)
    return 0

def copyExecuteInAcad():
    src = os.path.join(os.path.curdir, 'util', 'Builds', 'ExecuteInAcad.exe')
    dst = os.path.join(os.path.curdir, 'out', 'support', 'ExecuteInAcad.exe')
    copyFile(src, dst, 'copied ExecuteInAcad.exe')

def makepackage_vsix():    
    with open('package.json', 'r') as jfile:
        data = jfile.read()
    jobj = json.loads(data)
    suffix = jobj['version']
    vsixPath = os.path.join(os.path.curdir, 'util', 'Builds', 'agilebim.fabcod-' + suffix + '.vsix')
    print("===============================================")
    if (os.path.exists(vsixPath)):
        os.remove(vsixPath)
        print("Deleted stale fabcod.vsix")

    print("start to make vsix package")
    vsce = os.path.join(os.path.curdir, 'node_modules', '.bin', 'vsce')
    output_opt = " -o " + vsixPath
    os.system(vsce + " package" + output_opt) # nosec
    if (os.path.exists(vsixPath)):
        print("It created fabcod.vsix file sucessfully")
        ret = 0
    else:
        print("It failed to create fabcod.vsix file")
        ret = 1
    print("end make visx file")
    print("===============================================")
    return ret

if __name__ == "__main__":
    copyExecuteInAcad()
    print("===============================================")
    print("      generate vsix package start")
    print("===============================================")
    print("\n\n")
    sys.exit(makepackage_vsix())
