const elliptic = require("elliptic");
const sha3 = require("sha3");
const { ec: EC } = elliptic;
const { SHA3 } = sha3;
const ec = new EC("p256");

const hashMsgHex = (msgHex) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msgHex, "hex"));
  return sha.digest();
};

const signWithKey = (privateKey, msgHex) => {
  console.log({ privateKey, msgHex });
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsgHex(msgHex));
  const n = 32; // half of signature length?
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
};

module.exports = { signWithKey };
