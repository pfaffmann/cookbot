import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { UserResolver, RecipeResolver } from '../../resolvers';
const uR = new UserResolver();
const rR = new RecipeResolver();

export const deleteRecipe = (bot: Telegraf<Context<Update>>) => {
  bot.command('entf', async (ctx) => {
    try {
      if (!(await uR.isUserExisting(ctx.from.id)))
        throw new Error(
          'Benutzer nicht registriert. Tippe /help für mehr Informationen.'
        );
      const entities = ctx.message.text.split(' ');
      if (entities.length <= 1) throw new Error('Es wurde keine id übergeben.');
      const id = parseInt(entities[1]);
      if (isNaN(id)) throw new Error('Der übergebene Parameter ist keine id.');

      const isRecipeDeleted = await rR.deleteRecipe(id);
      if (!isRecipeDeleted)
        throw new Error(`Rezept mit id: ${id} konnte nicht gelöscht werden.`);
      ctx.reply(`Rezept wurde aus der Liste entfernt.`);
    } catch (error) {
      ctx.reply(error.message);
    }
  });
};
