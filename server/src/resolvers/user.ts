import { User } from '../entities';

export class UserResolver {
  async isUserExisting(telegramId: number) {
    return !!(await User.findOne({ where: { telegramId } }));
  }
  async addUser(telegramId: number) {
    if (!telegramId) return;

    if (await this.isUserExisting(telegramId)) return;

    const user = await User.create({ telegramId }).save();
    return user;
  }

  async getUser(telegramId: number) {
    if (!telegramId) return;

    if (!(await this.isUserExisting(telegramId))) return;
    return await User.findOne({ where: { telegramId } });
  }

  async deleteUser(telegramId: number) {
    if (!telegramId) return false;

    if (!(await this.isUserExisting(telegramId))) return false;

    await User.delete({ telegramId });
    return true;
  }
}
