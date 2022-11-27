import { fetchTitle } from '../lib/fetchTitle';
import { Recipe } from '../entities';
import { z } from 'zod';
import { UserResolver } from './user';

const urlScheme = z.string().url();

interface AddRecipe {
  url: string;
  telegramId: number;
}
const userResolver = new UserResolver();

export class RecipeResolver {
  async addRecipe({ url, telegramId }: AddRecipe) {
    const user = await userResolver.getUser(telegramId);
    if (!user) return;
    if (!urlScheme.safeParse(url).success) return;
    const title = await fetchTitle(url);
    const recipe = Recipe.create({ url, title, user });
    return recipe;
  }

  async getRecipes() {
    return await Recipe.find();
  }

  async getRecipe(id: number) {
    return await Recipe.findOne({ where: { id } });
  }

  async getRandomRecipe() {
    const recipes = await this.getRecipes();
    return recipes[Math.floor(Math.random() * recipes.length)];
  }
}
