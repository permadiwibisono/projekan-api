import randomString from "random-string";

export const randomStr = (length, options = {}) =>
  randomString({
    length,
    numeric: true,
    letters: true,
    special: false,
    ...options,
  });
