import 'reflect-metadata';
import { config as dotenvconfig } from 'dotenv';
dotenvconfig();
import { MysqlDataSource as DataSource } from './datasources/mysql';
import { Telegraf } from 'telegraf';
import { fetchTitle } from './lib/fetchTitle';
import { Recipe } from './entities';

const main = async () => {
  try {
    await DataSource.initialize();
    const bot = new Telegraf(process.env.COOKBOT_BOT_TOKEN as string);

    bot.start((ctx) => ctx.reply('Welcome. send "hi" to test the bot'));
    bot.help((ctx) =>
      ctx.reply(`/neu <URL> | Legt ein neues Rezept an.
    /zufall | Gibt ein zufälliges Rezept aus.
    /alle | Gibt alle Rezepte aus.`)
    );
    bot.command('alle', async (ctx) => {
      let reply = 'Alle gespeicherte Rezepte:\n';
      const recipes = await Recipe.find();
      recipes.map((recipe) => {
        reply += `id: ${recipe.id} - Titel: ${recipe.title}\n`;
      });
      ctx.reply(reply);
    });
    bot.command('neu', async (ctx) => {
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
        const title = await fetchTitle(url);
        const recipe = await Recipe.create({ url, title }).save();
        ctx.reply(`Rezept wurde gespeichert.
        ID: ${recipe.id}
        Titel: ${recipe.title}`);
      } else {
        ctx.reply('Keine gültige URL eingegeben');
      }
    });
    bot.command('zufall', async (ctx) => {
      try {
        const recipes = await Recipe.find();
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
        ctx.reply(recipe.url);
      } catch (error) {
        ctx.reply('Fehler');
      }
    });

    //bot.on('sticker', (ctx) => ctx.reply('❤️'));
    //bot.hears('hi', (ctx) => ctx.reply(`Hello ${ctx.from.first_name}`));
    bot.launch();
  } catch (error) {}
};
main();
