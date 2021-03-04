# FFProbe and Electron

## Problems and solutions
There are few problems with using ffprobe in a Vue environment. Vue runs in a web environment, this makes it difficult for some native functions to work for scripts written in the Renderer! And that affects ffprobe in the following ways:
* Getting the right path of ffprobe executable is difficult (__dirname gives wrong value most times in Electron)
* Spawning of ffprobe (it is an OS feature, difficult in the renderer)
* Spawning also fails due to file permission (chmod helps with this)

### Locating ffprobe executable
I downloaded execuatbles for all platforms (Mac, Windows, Linux) to src/static/ffprobe/bin. Got them from [ffprobe-static](https://github.com/joshwnj/ffprobe-static). This means I have the files in a path I am sure certain of! But we need the absolute path and ```__dirname``` does not work! Code below saved me:
```
import path from 'path';
import os from 'os';

var platform = os.platform();
if (platform !== 'darwin' && platform !=='linux' && platform !== 'win32') {
  console.error('Unsupported platform.');
  process.exit(1);
}

var arch = os.arch();
if (platform === 'darwin' && arch !== 'x64') {
  console.error('Unsupported architecture.');
  process.exit(1);
}

var ffprobePath = path.join(
  process.cwd(),    // mostly root of the app
  'src/static/ffprobe',
  'bin',
  platform,
  arch,
  platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
);
```
The snippets come from [ffprobe-static](https://github.com/joshwnj/ffprobe-static), but tweaked to work.

### Spawning of ffprobe from renderer process
I don't know in detail how this works, but going through the internet, I found this and it worked.
__vue.config.js__
```
module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true
        }
    },
};
```
__webpack.config.js__
```
module.exports = {
    "externals": {
        "electron": "require('electron')",
        "child_process": "require('child_process')",
        "fs": "require('fs')",
        "ffprobe-static": "require('ffprobe-static')",
        "path": "require('path')",
    },
}
```

### Using chmod to give access to ffprobe executable
After getting path of executable in HelloWorld.vue, I did this to make the executable accessible:
```
fs.chmodSync(ffprobePath, 0o755);
```

#### The end!
