const OSS = require("ali-oss");
const fs = require("fs");
const path = require("path");
const PUBLIC_PATH = path.join(__dirname, "/");

const client = new OSS({
  accessKeyId: "LTAI5tFyfRCEUszc6yJUqzhE",
  accessKeySecret: "K5KgvwAVWZCky15aM1IbhIB2JxF51j",
  bucket: "kfbiopathology",
  region: "oss-us-west-1"
});
const failedFiles = []

/**
 *获取文件目录并删除
 * @param {*} dir //oss文件目录
 */
async function deleteDir(dir) {
  let result = await client.list({
    prefix: dir + "/",
    delimiter: "/"
  });
  if (result.objects) {
    let aa = [];
    result.objects.forEach(function(obj) {
      aa.push(obj.name);
    });
    try {
      await client.deleteMulti(aa, {
        quiet: true
      });
      console.log("删除成功");
    } catch (e) {
      console.log("文件删除失败", e);
    }
  }
}

/**
 * 遍历文件夹递归上传
 * @param {path} src  本地路径
 * @param {string} dist oss文件夹名
 */
function addFileToOSSSync(src, dist) {
  let docs = fs.readdirSync(src);
  docs.forEach(function(doc) {
    let _src = src + "/" + doc,
      _dist = dist + "/" + doc;
    let st = fs.statSync(_src);
    // 判断是否为文件
    if (st.isFile() && doc !== ".DS_Store") {
      if (!doc.includes('.pdf')) {
        putOSS(_src, _dist);
      }
    }
    // 如果是目录则递归
    else if (st.isDirectory()) {
      addFileToOSSSync(_src, _dist);
    }
  });
}
/**
 *单个文件上传至oss
 */
async function putOSS(src, dist) {
  try {
    await client.put("/" + dist, src);
  } catch (e) {
    failedFiles.push({src, dist})
    console.log(src + " ---上传失败");
  }
}
/**
 * 上传失败文件重传
 * @param {[{src: String, dist: String}]} files 失败文件集合
 */
async function repeatUpload(files) {
  for (const file of files) {
    await putOSS(file.src, file.dist)
  }
}
/**
 * 上传文件启动
 * @param {string} dirName 将要上传的文件名
 */
async function upFile(dirName) {
  try {
    await deleteDir(dirName);
    // await addFileToOSSSync(PUBLIC_PATH + "dist", dirName);
    // await repeatUpload(failedFiles)
  } catch (err) {
    console.log(dirName + "上传oss失败", err);
  }
}

upFile('web/client')