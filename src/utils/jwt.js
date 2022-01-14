import jwt from "jsonwebtoken";

import { jwtConfig } from "../config";

export default class JWT {
  constructor(secretOrPrivateKey, secretOrPublicKey, options) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options; // algorithm + keyid + noTimestamp + expiresIn + notBefore
  }

  sign(payload, signOptions) {
    const jwtSignOptions = { ...signOptions, ...this.options };
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  // refreshOptions.verify = options you would use with verify function
  // refreshOptions.jwtid = contains the id for the new token
  refresh(token, refreshOptions) {
    const payload = jwt.decode(token, this.secretOrPublicKey);

    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti; // We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
    const jwtSignOptions = { ...this.options, ...refreshOptions };

    // The first signing converted all needed options into claims, they are already in the payload
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
}

export const jwtSign = (payloads) => {
  const { sub, ...p } = payloads;
  const client = new JWT(jwtConfig.secret, jwtConfig.secret, {
    algorithm: jwtConfig.algorithm,
  });
  const token = client.sign(p, {
    audience: payloads.id.toString(),
    issuer: jwtConfig.issuer,
    subject: sub,
    expiresIn: jwtConfig.expiresIn,
  });
  return token;
};

export const jwtVerify = (token, options = {}) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      jwtConfig.secret,
      {
        algorithm: jwtConfig.algorithm,
        ...options,
      },
      (err, decoded) => {
        if (err) return reject(err);
        return resolve(decoded);
      },
    );
  });

export const jwtRefresh = (token) => {
  const client = new JWT(jwtConfig.secret, jwtConfig.secret, {
    algorithm: jwtConfig.algorithm,
  });
  return client.refresh(token, { expiresIn: jwtConfig.expiresIn });
};
