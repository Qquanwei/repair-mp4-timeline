const { spawn } = require("node:child_process");
const cliProgress = require("cli-progress");
const { glob } = require("glob");
const fs = require("fs");


const bar = new cliProgress.SingleBar(
  {
    forrmat: "处理文件进度: {percennttage} {file}",
  },
  cliProgress.Presets.shades_classic
);
bar.start(1, 0);
const main = async () => {
  const fileReg = /\.mp4$/;
  const files = await glob(process.argv[2]);
  const total = files.length;
  let cur = 0;
  for (let file of files) {
    cur++;
    bar.update(cur / total, {
      file: file,
    });
    if (fileReg.test(file)) {
      const child = spawn(`ffmpeg`, [
        "-i",
        file,
        "-c",
        "copy",
        "-map",
        "0",
        "-f",
        "mp4",
        `${file}_tmp`,
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
        fs.rename(`${file}_tmp`, file, (error) => {
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
