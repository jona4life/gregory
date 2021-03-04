<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <input type="file" @change="previewFiles">
  </div>
</template>

<script>
import ffprobe from 'ffprobe';
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
  process.cwd(),
  'src/static/ffprobe',
  'bin',
  platform,
  arch,
  platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'
);

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    previewFiles(event) {
      event.target.files && event.target.files.forEach(file => {
        ffprobe(file.path, {
          path: ffprobePath
        }, function (err, info) {
          if (err) return err;
          console.log(info);
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
input {
  margin-top: 15px;
}
</style>
