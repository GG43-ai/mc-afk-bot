const mineflayer = require('mineflayer');

const botOptions = {
  host: '95.216.20.55', 
  port: 29367,          
  username: 'AFK_Bot_Helper',   
  version: '1.21.11'
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Бот успешно зашел на сервер!');
    
    // Если на сервере стоит плагин на пароли (AuthMe/nLogin)
    // Бот автоматически зарегистрируется и войдет под паролем 'superpassword123'
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/register superpassword123 superpassword123');
        bot.chat('/login superpassword123');
      }
    }, 2000);

    // Прыгаем ровно 0.5 секунды раз в минуту, чтобы не кикало за АФК
    setInterval(() => {
      if (bot) {
        bot.physicsEnabled = true; 
        bot.setControlState('jump', true); 
        
        setTimeout(() => {
          if (bot) {
            bot.setControlState('jump', false); 
            bot.physicsEnabled = false; 
          }
        }, 500); 
      }
    }, 60000);
  });

  bot.on('playerJoined', (player) => {
    if (player.username !== bot.username) {
      console.log(`Игрок ${player.username} зашел! Бот выходит.`);
      bot.quit(); 
      setTimeout(() => {
         console.log('Возвращаем бота на АФК-пост...');
         createBot();
      }, 120000); // Вернется через 2 минуты после того, как все выйдут
    }
  });

  bot.on('end', () => { 
    console.log('Бот отключился от сервера. Переподключение через 1 минуту...'); 
    setTimeout(createBot, 60000); 
  });
  
  bot.on('error', (err) => console.log('Ошибка бота: ', err));
}

createBot();
