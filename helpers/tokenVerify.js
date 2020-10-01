const { agServer } = require("./agServerCreator");

const tokenVerifyMiddleware =  async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(' ')[1];
    const user = await agServer.auth.verifyToken(token, agServer.signatureKey)
    req.user = user;
    next();
  } catch(error) {
    return res.status(401).json({
      success: false,
      data: {
        message: 'token 驗證錯誤'
      }
    })
  }
}

module.exports = tokenVerifyMiddleware;
