/** */
export interface EncryptedData {
  /** */
  salt: string;

  /** */
  iv: string;

  /** */
  cipher: string;
}

/** */
export class SymmetricEncryption {
  /** */
  private static stringToBytes(str) {
    return new TextEncoder().encode(str);
  }

  /** */
  private static bytesToString(bytes) {
    return new TextDecoder().decode(bytes);
  }

  /** */
  private static bytesToBase64(bytes: Uint8Array) {
    return btoa(
      Array.from(bytes, (value) => String.fromCharCode(value)).join(''),
    );
  }

  /** */
  private static base64ToBytes(base64: string) {
    return Uint8Array.from(atob(base64), (code) => code.charCodeAt(0));
  }

  /** */
  static getSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /** */
  static async getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const passwordBytes = SymmetricEncryption.stringToBytes(password);
    const initialKey = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      {
        name: 'PBKDF2'
      },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      initialKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /** */
  static async encrypt(
    key: CryptoKey,
    salt: Uint8Array,
    content: string,
  ): Promise<EncryptedData> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const contentBytes = SymmetricEncryption.stringToBytes(content);

    const cipher = new Uint8Array(
      await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, contentBytes)
    );
    return {
      salt: SymmetricEncryption.bytesToBase64(salt),
      iv: SymmetricEncryption.bytesToBase64(iv),
      cipher: SymmetricEncryption.bytesToBase64(cipher),
    };
  }

  /** */
  static async decrypt(
    key: CryptoKey,
    encryptedData: EncryptedData,
  ): Promise<string> {
    const iv = SymmetricEncryption.base64ToBytes(encryptedData.iv);  
    const cipher = SymmetricEncryption.base64ToBytes(encryptedData.cipher);

    const contentBytes = new Uint8Array(
      await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher)
    );

    return SymmetricEncryption.bytesToString(contentBytes);
  } 
}

// async function test() {
//   const content = `That's all Folks!`;
//   const password = 'foobar';
//   const salt = SymmetricEncryption.getSalt();
//   const key = await SymmetricEncryption.getKey(password, salt);
  
//   const enc = await SymmetricEncryption.encrypt(key, salt, content);
//   console.log(enc);
//   const dec = await SymmetricEncryption.decrypt(key, enc);
//   console.log(dec); 
// }