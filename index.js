const mineflayer = require('mineflayer');

const botOptions = {
  host: 'mc2205271.fmcs.cloud',        
  username: 'AFK_Bot_Helper',   
  version: '1.21.11' // Указываем точную версию вашей Java 1.21.1 вместо false
};

let bot;
let afkInterval;
let reconnectTimeout;

function createBot() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('[MC] Бот успешно зашел на сервер!');
    
    // Авторизация на сервере
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/register superpassword123 superpassword123');
        bot.chat('/login superpassword123');
      }
    }, 2000);

    // Включаем постоянный шифт (приседание)
    setTimeout(() => {
      if (bot && bot.entity) bot.setControlState('sneak', true);
    }, 3000);

    if (afkInterval) clearInterval(afkInterval);

    // Прыгаем раз в минуту на шифте
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true); 
        setTimeout(() => {
          if (bot && bot.entity) {
            bot.setControlState('jump', false); 
            bot.setControlState('sneak', true); 
          }
        }, 500); 
      }
    }, 60000);

    // Быстрая проверка при входе: если на сервере уже кто-то есть кроме бота, сразу уходим
    setTimeout(() => {
      if (bot && bot.players) {
        const playerCount = Object.keys(bot.players).length;
        if (playerCount > 1) {
          console.log(`[MC] На сервере есть игроки. Бот уступает место.`);
          if (afkInterval) clearInterval(afkInterval);
          bot.quit();
        }
      }
    }, 5000);
  });

  // Если игрок заходит, пока бот на сервере — бот мгновенно выходит
  bot.on('playerJoined', (player) => {
    if (!bot || !bot.players) return;
    if (player.username !== bot.username) {
      console.log(`[MC] Игрок ${player.username} зашел. Бот выходит.`);
      if (afkInterval) clearInterval(afkInterval);
      bot.quit(); 
    }
  });

  bot.on('end', () => { 
    console.log('[MC] Бот отключился. Проверка сервера через 3 минуты...'); 
    if (afkInterval) clearInterval(afkInterval);
    reconnectTimeout = setTimeout(createBot, 180000); 
  });
  
  bot.on('error', (err) => console.log('[MC] Ошибка: ', err));
}

createBot();
