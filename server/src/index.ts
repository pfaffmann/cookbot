import 'reflect-metadata';
import { config as dotenvconfig } from 'dotenv';
dotenvconfig();

import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.COOKBOT_BOT_TOKEN as string);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('❤️'));
bot.hears('hi', (ctx) => ctx.reply(`Hallo ${ctx.from.first_name}`));
bot.launch();
