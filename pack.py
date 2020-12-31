import os
import subprocess
import os.path
import shutil
import errno
import shlex
import platform
import sys
# init


def init():
    print("===============================================")
    print("             try to install gulp-cli globally")
    os.system("npm install --global gulp-cli") # nosec

    os.system("yarn install --unsafe-perm") # nosec

    print("===============================================")
    print("             complete yarn install")
    print("===============================================")
    print("\n\n")
    copyExecuteInAcad()
    return 0

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
    src = os.path.join(os.path.curdir, 'util', 'ExecuteInAcad', 'bin', 'Debug', 'ExecuteInAcad.exe')
    dst = os.path.join(os.path.curdir, 'out', 'support', 'ExecuteInAcad.exe')
    copyFile(src, dst, 'copied ExecuteInAcad.exe')

def makepackage_vsix():
    print("===============================================")
    print("start to make vsix package")
    vsce = os.path.join(os.path.curdir, 'node_modules', '.bin', 'vsce')
    output_opt = " -o " + os.path.join(os.path.curdir, 'fabcod.vsix')
    os.system(vsce + " package" + output_opt) # nosec
    if (os.path.exists('fabcod.vsix')):
        print("It created fabcod.vsix file sucessfully")
        ret = 0
    else:
        print("It failed to create fabcod.vsix file")
        ret = 1
    print("end tp make visx file")
    print("===============================================")
    return ret

if __name__ == "__main__":
    ret = 1
    if (init() == 0):
        print("===============================================")
        print("      generate vsix package start")
        print("===============================================")
        print("\n\n")
        ret= makepackage_vsix()
    sys.exit(ret)        
