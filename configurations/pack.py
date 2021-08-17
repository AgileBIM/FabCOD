# import subprocess
# import shutil
# import errno
# import shlex
# import platform
# import json
import os
import os.path
import sys
from copyFiles import copyDimOptionChoices, copyExecuteInAcad, copyFabDataJson, copySnippetDefs

def makepackage_vsix():    
    # with open('package.json', 'r') as jfile:
    #     data = jfile.read()
    # jobj = json.loads(data)
    # suffix = jobj['version']
    # vsixPath = os.path.join(os.path.curdir, 'util', 'Builds', 'agilebim.fabcod-' + suffix + '.vsix')
    vsixPath = os.path.join(os.path.curdir, 'agilebim.fabcod.vsix')
    print("===============================================")
    if (os.path.exists(vsixPath)):
        os.remove(vsixPath)
        print("Deleted stale agilebim.fabcod.vsix")

    print("start to make vsix package")
    vsce = os.path.join(os.path.curdir, 'node_modules', '.bin', 'vsce')
    output_opt = " -o " + vsixPath
    os.system(vsce + " package" + output_opt) # nosec
    if (os.path.exists(vsixPath)):
        print("It created agilebim.fabcod.vsix file sucessfully")
        ret = 0
    else:
        print("It failed to create agilebim.fabcod.vsix file")
        ret = 1
    print("end make visx file")
    print("===============================================")
    return ret

if __name__ == "__main__":
    copyDimOptionChoices()
    copyExecuteInAcad()
    copyFabDataJson()
    copySnippetDefs()
    print("===============================================")
    print("      generate vsix package start")
    print("===============================================")
    print("\n\n")
    sys.exit(makepackage_vsix())
