const jwt = require("jsonwebtoken");
const { connected } = require("../config/redis_connect");
const redis_client = require("../config/redis_connect");

function verifyToken(req, res, next) {
  try {
    if (typeof req.cookies.accessToken === "undefined") {
      console.log(req.cookies);
      req.token = null;
      next();
    } else {
      const token = req.cookies.accessToken;
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      // console.log(decoded);
      req.userData = decoded;

      req.token = token;

      // verify blacklisted access token.
      redis_client.get("BL_" + decoded.sub.toString(), (err, data) => {
        if (err) throw err;

        if (data === token)
          return res.status(401).json({
            status: false,
            message: "blacklisted token.",
          });
        next();
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Your session is not valid.",

      data: error,
    });
  }
}

function verifyRefreshToken(req, res, next) {
  if (typeof req.cookies.refreshToken === "undefined") {
    return res.status(401).json({
      status: false,
      message: "Invalid request.",
      refreshTokenError: true,
    });
  }

  const token = req.cookies.refreshToken;

  if (token === null)
    return res.status(401).json({
      status: false,
      message: "Invalid request.",
      refreshTokenError: true,
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;

    // verify if token is in store or not
    redis_client.get(decoded.sub.toString(), (err, data) => {
      if (err) throw err;

      if (data === null)
        return res.status(401).json({
          status: false,
          message: "Invalid request. Token is not in store.",
          refreshTokenError: true,
        });
      if (JSON.parse(data).token != token)
        return res.status(401).json({
          status: false,
          message: "Invalid request. Token is not same in store.",
          refreshTokenError: true,
        });

      next();
    });
  } catch (error) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(401).json({
      status: true,
      message: "Session Expired",
      refreshTokenError: true,
      data: error,
    });
  }
}

module.exports = {
  verifyToken,
  verifyRefreshToken,
};
