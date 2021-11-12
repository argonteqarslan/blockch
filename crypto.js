var CryptoJS = require("crypto-js");

var data = {
    status: "success",
    message: "your account has been registered successfully",
    data: "transaction"
  }

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretkey123').toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, 'secretkey123');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
console.log(ciphertext); // [{id: 1}, {id: 2}]
console.log(decryptedData); // [{id: 1}, {id: 2}]


crypto