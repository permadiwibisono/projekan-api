export default class ValidatorError extends Error {
  constructor(...args) {
    let errCode = 422;
    let errMessage = "Unprocessable Entity";
    const { 0: errors, 1: message, 2: code } = args;
    if (message) {
      errMessage = message;
    }
    if (code && Number(code)) {
      errCode = code;
    }
    super(errMessage);
    this.code = errCode;
    this.errors = errors;
  }
}
