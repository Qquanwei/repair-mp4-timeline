# repair-mp4-timeline

使用 ffmpeg 重编码视频文件，修复时间轴缺失。

## 使用步骤

1. 下载 ffmpeg 并添加到环境变量中

2. 安装 node v18 及以上版本

2. 克隆工程到本地，并安装依赖

```
git clone https://github.com/Qquanwei/repair-mp4-timeline

cd repair-mp4-timeline

npm i --registry=https://registry.npmmirror.com
```

3. 使用本工具对mp4进行批量修复，**修复会覆盖原始文件，请谨慎**


```
node repaire-mp4-timeline.js.js /some/path/*.mp4
```

将 /some/path/*.mp4 替换成实际路径即可，支持正则匹配多个文件。