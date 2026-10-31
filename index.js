const mineflayer = require('mineflayer');

const botOptions = {
  host: '95.216.20.55', 
  port: 29367,          
  username: 'AFK_Bot_Helper',   
  version: '1.21.11',
  // ОТКЛЮЧАЕМ ТЯЖЕЛЫЕ ФУНКЦИИ ДЛЯ ЭКОНОМИИ ПАМЯТИ:
  physicsEnabled: false, 
  loadInternalPlugins: false
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Бот зашел!');
    // Вместо прыжков просто шлем пустой пакет раз в минуту, чтобы хостинг не кикнул за АФК
    setInterval(() => {
      if (bot && bot.swingArm) bot.swingArm();
    }, 60000);
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      console.log(`Игрок ${player.username} зашел! Бот выходит.`);
      bot.quit(); 
      setTimeout(() => {
         console.log('Возвращаем бота...');
         createBot();
      }, 120000); // Поставил 2 минуты задержки вместо 15, чтобы возвращался быстрее
    }
  });

  bot.on('end', () => { setTimeout(createBot, 60000); });
  bot.on('error', (err) => console.log('Ошибка: ', err));
}

createBot();
