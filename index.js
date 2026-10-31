const mineflayer = require('mineflayer');

const botOptions = {
  host: '95.216.20.55', // ТОЛЬКО ЦИФРЫ IP (без :29367)
  port: 29367,          // Порт пишется отдельно на этой строчке
  username: 'AFK_Bot_Helper',   
  version: '1.21.11'    // Версию оставляем 1.21.11
};


let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Бот успешно зашел на сервер!');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 60000);
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      console.log(`Игрок ${player.username} зашел! Бот выходит.`);
      bot.quit(); 
      setTimeout(() => { createBot(); }, 120000); 
    }
  });

  bot.on('end', () => { setTimeout(createBot, 120000); });
  bot.on('error', (err) => console.log('Ошибка бота: ', err));
}

createBot();
