import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { RecipeResolver, UserResolver } from '../../resolvers';
const recipeResolver = new RecipeResolver();
const userResolver = new UserResolver();

export const addRecipe = (bot: Telegraf<Context<Update>>) => {
  bot.command('neu', async (ctx) => {
    if (!(await userResolver.isUserExisting(ctx.from.id))) {
      ctx.reply(
        'Du hast keine Berechtigung für diesen Befehl. Tippe /help für mehr Informationen'
      );
      return;
    }
    if (
      ctx &&
      ctx.message &&
      ctx.message.entities &&
      ctx.message.entities.length > 1 &&
      ctx.message.entities[1].type == 'url'
    ) {
      const entity = ctx.message.entities[1];
      const url = ctx.message.text.substring(
        entity.offset,
        entity.offset + entity.length
      );
      const recipe = await recipeResolver.addRecipe({
        url,
        telegramId: ctx.from.id,
      });
      if (!recipe) return;
      ctx.reply(`Rezept wurde gespeichert.
      ID: ${recipe.id}
      Titel: ${recipe.title}`);
    } else {
      ctx.reply('Keine gültige URL eingegeben');
    }
  });
};
