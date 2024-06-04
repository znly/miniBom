import CryptoJS from "crypto-js";

//秘钥, 一般长度是16位。和后端约定好他们提供的
var key = CryptoJS.enc.Utf8.parse("wYDJtx8o6HE6YjkS");
// 偏移量,一般长度是16位。和后端约定好他们提供的
var iv = CryptoJS.enc.Utf8.parse("SC31fdGsQozTmT5a");

export default {
  //CBC加密
  encryptdata(data) {
    var srcs = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  //CBC解密
  decryptdata(encrypted) {
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Iso10126,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};
