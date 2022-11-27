import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { UserResolver, RecipeResolver } from '../../resolvers';
const uR = new UserResolver();
const rR = new RecipeResolver();

export const getRecipe = (bot: Telegraf<Context<Update>>) => {
  bot.command('alle', async (ctx) => {
    try {
      if (!(await uR.isUserExisting(ctx.from.id)))
        throw new Error(
          'Benutzer nicht registriert. Tippe /help für mehr Informationen.'
        );
      let reply = '';
      const recipes = await rR.getRecipes();
      recipes.map((recipe) => {
        reply += `id: ${recipe.id} - ${recipe.url}\n`;
      });
      ctx.reply(reply);
    } catch (error) {
      ctx.reply(error.message);
    }
  });
  bot.command('liste', async (ctx) => {
    try {
      if (!(await uR.isUserExisting(ctx.from.id)))
        throw new Error(
          'Benutzer nicht registriert. Tippe /help für mehr Informationen.'
        );
      let reply = 'Alle gespeicherte Rezepte:\n';
      const recipes = await rR.getRecipes();
      recipes.map((recipe) => {
        reply += `id: ${recipe.id} - ${recipe.title}\n`;
      });
      ctx.reply(reply);
    } catch (error) {
      ctx.reply(error.message);
    }
  });

  bot.command('id', async (ctx) => {
    try {
      if (!(await uR.isUserExisting(ctx.from.id)))
        throw new Error(
          'Benutzer nicht registriert. Tippe /help für mehr Informationen.'
        );
      const entities = ctx.message.text.split(' ');
      if (entities.length <= 1) throw new Error('Es wurde keine id übergeben.');
      const id = parseInt(entities[1]);
      if (isNaN(id)) throw new Error('Der übergebene Parameter ist keine id.');

      const recipe = await rR.getRecipe(id);
      if (!recipe) throw new Error(`Kein Rezept mit id: ${id} vorhanden.`);
      ctx.reply(recipe.url);
    } catch (error) {
      ctx.reply(error.message);
    }
  });
  bot.command('zufall', async (ctx) => {
    try {
      if (!(await uR.isUserExisting(ctx.from.id)))
        throw new Error(
          'Benutzer nicht registriert. Tippe /help für mehr Informationen.'
        );
      const recipe = await rR.getRandomRecipe();
      ctx.reply(recipe.url);
    } catch (error) {
      ctx.reply(error.message);
    }
  });
};
