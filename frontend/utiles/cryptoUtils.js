function customHash(input, secret) {
  const key = new TextEncoder().encode(secret);
  const data = new TextEncoder().encode(input);
  const result = [];

  for (let i = 0; i < data.length; i++) {
    result.push(data[i] ^ key[i % key.length]);
  }

  const hashArray = new Uint8Array(result);
  return btoa(String.fromCharCode.apply(null, hashArray));
}

function customDehash(hash, secret) {
  const key = new TextEncoder().encode(secret);
  const hashArray = new Uint8Array(
    atob(hash)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const result = [];

  for (let i = 0; i < hashArray.length; i++) {
    result.push(hashArray[i] ^ key[i % key.length]);
  }

  return new TextDecoder().decode(new Uint8Array(result));
}

module.exports = { customDehash, customHash };
