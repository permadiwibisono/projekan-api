export default class UnauthorizedError extends Error {
  constructor(...args) {
    let errCode = 401;
    let errMessage = "Unauthorized";
    const { 0: message, 1: code } = args;
    if (message) {
      errMessage = message;
    }
    if (code && Number(code)) {
      errCode = code;
    }
    super(errMessage);
    this.code = errCode;
  }
}
