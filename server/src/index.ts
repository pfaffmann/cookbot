import 'reflect-metadata';
import { config as dotenvconfig } from 'dotenv';
dotenvconfig();
import { MysqlDataSource as DataSource } from './datasources/mysql';
import { Telegraf } from 'telegraf';
import { addUser } from './bot/commands/addUser';
import { addRecipe } from './bot/commands/addRecipe';
import { getRecipe } from './bot/commands/getRecipe';
import { deleteRecipe } from './bot/commands/deleteRecipe';
import { UserResolver } from './resolvers';

const helpUnregistered = `/registrieren | Um den Bot nutzen zu können muss man registriert sein.`;
const helpRegistered = `/registrieren | Um den Bot nutzen zu können muss man registriert sein.
/neu <URL> | Legt ein neues Rezept an.
/zufall | Gibt ein zufälliges Rezept aus.
/alle | Gibt alle Rezepte aus.
/liste | Gibt eine Liste aller Rezepte aus.
/id <ID> | Gibt das Rezpt mit der jeweiligen id aus.
/entf <ID> | Löscht das Rezpt mit der angegebenen id aus der Liste.`;

const main = async () => {
  await DataSource.initialize();
  const bot = new Telegraf(process.env.COOKBOT_BOT_TOKEN as string);
  bot.start((ctx) => ctx.reply('Welcome. send "hi" to test the bot'));
  bot.help(async (ctx) => {
    const uR = new UserResolver();
    const help = (await uR.isUserExisting(ctx.from.id))
      ? helpRegistered
      : helpUnregistered;
    ctx.reply(help);
  });
  addUser(bot); //Befehl registrieren
  addRecipe(bot); //Befehl neu
  getRecipe(bot); //Befehle alle, liste, zufall, id
  deleteRecipe(bot);
  bot.launch();
};
main();
