const UserDto = require("../dtos/user.dtos");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/base.error");

class AuthService {
  async register(email, password) {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      throw BaseError.BadRequest(`User with exisiting email ${email} alerady registered`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ email, password: hashPassword });
    const UserDtos = new UserDto(user);

    await mailService.sendMail(
      email,
      `${process.env.API_URL}/api/auth/activation/${UserDtos.id}`
    );

    const tokens = tokenService.generateToken({ ...UserDtos });

    await tokenService.saveToken(UserDtos.id, tokens.refreshToken);

    return { user: UserDto, ...tokens };
  }

  async activation(userID) {
    const user = await userModel.findById(userID);
    if (!user) {
      throw BaseError.BadRequest("User is not defined");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw BaseError.BadRequest("User is not defined");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw BaseError.BadRequest("Password is incorrect");
    }

    const UserDtos = new UserDto(user);    
    const tokens = tokenService.generateToken({ ...UserDtos });
    await tokenService.saveToken(UserDtos.id, tokens.refreshToken);
    return { user: UserDtos, ...tokens };
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw BaseError.UnauthorizedError("Bad authorization");
    }

    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const tokenDB = await tokenService.findToken(refreshToken);
    if (!userPayload || !tokenDB) {
      throw BaseError.UnauthorizedError("Bad authorization");
    }

    const user = await userModel.findById(userPayload.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async getUser() {
    return await userModel.find()
  }
}

module.exports = new AuthService();