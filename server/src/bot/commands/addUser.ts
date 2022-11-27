import { UserResolver } from '../../resolvers/user';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

const denyUser = 'denyUser';
const acceptUser = 'acceptUser';
const userResolver = new UserResolver();

export const addUser = (bot: Telegraf<Context<Update>>) => {
  bot.command('registrieren', async (ctx) => {
    ctx.reply(
      'Ein Admin wird dich in kürze hinzufügen. Danach stehen dir alle Funktionen zur Verfügung.'
    );
    ctx.telegram.sendMessage(
      process.env.COOKBOT_ADMIN_TELEGRAM_ID as string,
      `${ctx.message.from.first_name} ${ctx.message.from.last_name} möchte hinzugefügt werden.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'ablehnen', callback_data: `${denyUser} ${ctx.from.id}` },
              {
                text: 'hinzufügen',
                callback_data: `${acceptUser} ${ctx.from.id}`,
              },
            ],
          ],
        },
      }
    );
  });

  bot.on('callback_query', async (ctx) => {
    //@ts-ignore
    const data = ctx.callbackQuery.data as string;
    const [command, str_userId] = data.split(' ');
    const userId = parseInt(str_userId);

    switch (command) {
      case denyUser:
        ctx.telegram.sendMessage(
          userId,
          'Deine Anfrage wurde durch den Admin abgelehnt.'
        );
        break;
      case acceptUser:
        ctx.telegram.sendMessage(
          userId,
          'Deine Anfrage wurde durch den Admin akzeptiert. Schreibe den Befehl /help, um alle verfügbaren Befehle zu sehen.'
        );
        if (!(await userResolver.isUserExisting(userId))) {
          await userResolver.addUser(userId);
          ctx.telegram.sendMessage(
            process.env.COOKBOT_ADMIN_TELEGRAM_ID as string,
            `${userId} wurde hinzugefügt.`
          );
          break;
        }
        ctx.telegram.sendMessage(
          process.env.COOKBOT_ADMIN_TELEGRAM_ID as string,
          `${userId} bereits vorhanden.`
        );
    }
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  });
};
