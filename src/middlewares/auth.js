import UnauthorizedError from "../errors/unauthorized.error";

export const authMiddleware = (req, res, next) => {
  req.userID = null;
  if (!req.session?.userID) {
    throw new UnauthorizedError();
  }
  req.userID = req.session.userID;
  next();
};
