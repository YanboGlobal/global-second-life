const sodium = require("libsodium-wrappers-sumo");

(async () => {
  await sodium.ready;
  const keyPair = sodium.crypto_box_keypair();
  const publicKey = sodium.to_base64(keyPair.publicKey, sodium.base64_variants.ORIGINAL);
  const privateKey = sodium.to_base64(keyPair.privateKey, sodium.base64_variants.ORIGINAL);

  console.log("Second Spring booking encryption keys");
  console.log("");
  console.log("PUBLIC KEY - paste this into BOOKING_PUBLIC_KEY_BASE64 in payment.js:");
  console.log(publicKey);
  console.log("");
  console.log("PRIVATE KEY - keep this in a password manager and an offline backup:");
  console.log(privateKey);
  console.log("");
  console.log("Important: never deploy, email, or commit the private key. If it is lost, old encrypted booking data cannot be recovered.");
})();
