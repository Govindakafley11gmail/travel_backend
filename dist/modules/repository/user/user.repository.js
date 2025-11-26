"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user/user.model")); // adjust path
class UserRepository {
    async create(data) {
        const user = await user_model_1.default.create(data);
        return user;
    }
    async findAll() {
        return await user_model_1.default.findAll();
    }
    async findById(id) {
        return await user_model_1.default.findByPk(id);
    }
    async findByEmail(email) {
        return await user_model_1.default.findOne({ where: { email } });
    }
    async update(id, data) {
        const user = await user_model_1.default.findByPk(id);
        if (!user)
            return null;
        await user_model_1.default.update(data, { where: { id } });
        return await user_model_1.default.findByPk(id);
    }
    async delete(id) {
        const user = await user_model_1.default.findByPk(id);
        if (user)
            await user.destroy();
    }
    async updatePasswordWithHash(user, hashedPassword) {
        try {
            user.dataValues.password = hashedPassword;
            // Skip hooks so we don't double-hash
            await user_model_1.default.update({ password: hashedPassword }, { where: { id: user.dataValues.id }, hooks: false });
            // OR use raw query / User.update() if you prefer
            return user;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map