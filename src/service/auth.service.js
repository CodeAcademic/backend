const UserDto = require("../dtos/user.dtos");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");

class AuthService {
  async register(email, password) {
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      throw new Error(`User with exisiting email ${email} alerady registered`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ email, password: hashPassword });

    const UserDtos = new UserDto(user);
    const tokens = tokenService.generateToken({ ...UserDto })
    
    await tokenService.saveToken(UserDto.id, tokens.refreshToken)

    return { user: UserDtos, ...tokens };
  }

  async activation(userID) {
    const user = await userModel.findById(userID)
    if (!user) {
      throw new Error('User is not defined')
    }
    user.isActivated = true
    await user.save()
  }
}

module.exports = new AuthService();
