const authService = require("../service/auth.service")

class AuthController {
    async register(req, res, next) {
        try {
            const { email, password } = req.body
            const data = await authService.register(email, password)
            return res.json(data)
        } catch (error) {
            console.log(error)
        }
    }

    async activation(req, res, next) {
        try {
            const userID = req.params.id
            await authService.activation(userID)
            return res.json({message: "User is activated"})
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new AuthController()