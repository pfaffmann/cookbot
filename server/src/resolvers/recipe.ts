import { fetchTitle } from 'src/lib/fetchTitle';
import { Recipe } from '../entities';
import isUrl from 'is-url-superb';
export class RecipeResolver {
  async addRecipe(url: string) {
    if (!isUrl(url)) return;
    const title = await fetchTitle(url);
    const recipe = Recipe.create({ url, title }).save();
    return recipe;
  }
}
