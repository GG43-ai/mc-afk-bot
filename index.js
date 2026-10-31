const mineflayer = require('mineflayer');

const botOptions = {
  host: '95.216.20.55', 
  port: 29367,          
  username: 'AFK_Bot_Helper',   
  version: '1.21.11',
  physicsEnabled: false, // Оставляем выключенной по умолчанию для экономии RAM
  loadInternalPlugins: false
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Бот зашел!');
    
    // Цикл прыжков каждые 60000 миллисекунд (1 минута)
    setInterval(() => {
      if (bot) {
        bot.physicsEnabled = true; // Включаем физику, чтобы бот мог двигаться
        bot.setControlState('jump', true); // Нажимаем прыжок
        
        setTimeout(() => {
          if (bot) {
            bot.setControlState('jump', false); // Отпускаем прыжок
            bot.physicsEnabled = false; // Снова отключаем физику для экономии памяти
          }
        }, 500); // Прыгаем в течение 0.5 секунды
      }
    }, 60000);
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      console.log(`Игрок ${player.username} зашел! Бот выходит.`);
      bot.quit(); 
      setTimeout(() => {
         console.log('Возвращаем бота...');
         createBot();
      }, 120000); // 2 минуты задержки перед возвращением
    }
  });

  bot.on('end', () => { setTimeout(createBot, 60000); });
  bot.on('error', (err) => console.log('Ошибка: ', err));
}

createBot();
