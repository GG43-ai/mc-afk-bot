const mineflayer = require('mineflayer');
const express = require('express');

// 1. ВСТРОЕННЫЙ ВЕБ-СЕРВЕР ДЛЯ RENDER.COM
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Бот активен и удерживает AFK-статус!');
});

app.listen(PORT, () => {
  console.log(`[Web] Сервер запущен на порту ${PORT} для Render`);
});

// 2. НАСТРОЙКИ MINECRAFT БОТА
const botOptions = {
  host: '95.216.20.55', 
  port: 29367,          
  username: 'AFK_Bot_Helper',   
  version: '1.20.1' // Обратите внимание: Mineflayer стабильно держит версии вроде 1.20.1 или 1.21. Убедитесь, что версия совпадает с сервером
};

let bot;
let afkInterval;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('[MC] Бот успешно зашел на сервер!');
    
    // Авторизация на сервере (AuthMe / nLogin)
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/register superpassword123 superpassword123');
        bot.chat('/login superpassword123');
      }
    }, 2000);

    // Очищаем старый интервал перед созданием нового, чтобы избежать утечки памяти
    if (afkInterval) clearInterval(afkInterval);

    // Прыгаем раз в минуту для обхода AFK (без отключения физики во избежание кика античитом)
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true); 
        setTimeout(() => {
          if (bot && bot.entity) bot.setControlState('jump', false); 
        }, 500); 
      }
    }, 60000);
  });

  // Логика выхода при онлайне: бот проверяет количество людей при входе нового игрока
  bot.on('playerJoined', (player) => {
    if (!bot || !bot.players) return;
    
    const playerCount = Object.keys(bot.players).length;
    // Если на сервере больше 1 игрока (вы + кто-то еще), бот уступает место
    if (playerCount > 1 && player.username !== bot.username) {
      console.log(`[MC] Зашел игрок ${player.username}. На сервере есть люди (${playerCount}). Бот выходит.`);
      if (afkInterval) clearInterval(afkInterval);
      bot.quit(); 
    }
  });

  bot.on('end', () => { 
    console.log('[MC] Бот отключился от сервера. Переподключение через 1 минуту...'); 
    if (afkInterval) clearInterval(afkInterval);
    setTimeout(createBot, 60000); 
  });
  
  bot.on('error', (err) => console.log('[MC] Ошибка бота: ', err));
}

createBot();
