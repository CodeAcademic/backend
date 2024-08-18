const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");
require("dotenv").config()
class TokenService {
   generateToken(payload) {
    const accessToken =  jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
   }
  
  async saveToken(userID, refreshToken) {
    const existToken = await tokenModel.findOne({ user: userID });
    if (existToken) {
      existToken.refreshToken = refreshToken;
      return existToken.save();
    }
    const token = await tokenModel.create({ user: userID, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    return await tokenModel.findOneAndDelete({ refreshToken });
  }

  async findToken(refreshToken) {
    return await tokenModel.findOne({refreshToken})
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_KEY);
    } catch (error) {
      console.log(error)
      return null;
    }
  }
}

module.exports = new TokenService();
