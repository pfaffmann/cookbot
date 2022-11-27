import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { UserResolver, RecipeResolver } from '../../resolvers';
const uR = new UserResolver();
const rR = new RecipeResolver();

export const getRecipe = (bot: Telegraf<Context<Update>>) => {
  bot.command('alle', async (ctx) => {
    try {
      if (!(await uR.isUserExisting))
        throw new Error('Benutzer nicht registriert.');
      let reply = '';
      const recipes = await rR.getRecipes();
      recipes.map((recipe) => {
        reply += `id: ${recipe.id} - ${recipe.url}\n`;
      });
      ctx.reply(reply);
    } catch (error) {
      ctx.reply(error);
    }
  });
  bot.command('liste', async (ctx) => {
    try {
      if (!(await uR.isUserExisting))
        throw new Error('Benutzer nicht registriert.');
      let reply = 'Alle gespeicherte Rezepte:\n';
      const recipes = await rR.getRecipes();
      recipes.map((recipe) => {
        reply += `id: ${recipe.id} - ${recipe.title}\n`;
      });
      ctx.reply(reply);
    } catch (error) {
      ctx.reply(error);
    }
  });

  bot.command('id', async (ctx) => {
    try {
      if (!(await uR.isUserExisting))
        throw new Error('Benutzer nicht registriert.');
      const entities = ctx.message.text.split(' ');
      if (entities.length <= 1) throw new Error();
      const id = parseInt(entities[1]);
      if (isNaN(id)) throw new Error();

      const recipe = await rR.getRecipe(id);
      if (!recipe) throw new Error();
      ctx.reply(recipe.url);
    } catch (error) {
      ctx.reply(error);
    }
  });
  bot.command('zufall', async (ctx) => {
    try {
      if (!(await uR.isUserExisting))
        throw new Error('Benutzer nicht registriert.');
      const recipe = await rR.getRandomRecipe();
      ctx.reply(recipe.url);
    } catch (error) {
      ctx.reply(error);
    }
  });
};