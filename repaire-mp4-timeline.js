const { spawn } = require("node:child_process");
const cliProgress = require("cli-progress");
const { glob } = require("glob");
const fs = require("fs");


const bar = new cliProgress.SingleBar(
  {
    format: "处理文件进度: {bar} | {value}/{total} | {duration}s | {file}",
    hideCursor: true
  },
  cliProgress.Presets.shades_classic
);

const main = async () => {
  const fileReg = /\.mp4$/;
  const files = await glob(process.argv[2]);
  const total = files.length;
  let cur = 0;
  console.log('一共匹配到:', files.length, '个文件需要处理');
  bar.start(total, 0);
  for (let file of files) {
    const outputFilename = file.replace('.mp4', '_tmp.mp4');
    cur++;
    bar.update(cur, {
      file: file,
    });
    if (fileReg.test(file)) {
      const child = spawn(`ffmpeg`, [
        '-hwaccel',
        'auto',
        "-i",
        file,
        '-y',
        "-c",
        "copy",
        "-map",
        "0:v",
        "-map",
        "0:a",
        "-f",
        "mp4",
        outputFilename
      ]);
      await new Promise((resolve, reject) => {
        let errStr = "";
        child.stderr.on("data", (data) => {
          errStr += data;
        });
        child.stdout.on("data", () => {
          // ignore
        });
        child.on("exit", (code) => {
          if (code === 0) {
            resolve();
          } else {
            console.error(errStr);
            reject();
          }
        });
      });
      await new Promise((resolve, reject) => {
        fs.rename(outputFilename, file, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }
  }
  bar.stop();
};

main();
