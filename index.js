const mineflayer = require('mineflayer');
const express = require('express');

// 1. ВСТРОЕННЫЙ ВЕБ-СЕРВЕР ДЛЯ RENDER.COM
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Бот постоянно на сервере и удерживает шифт!');
});

app.listen(PORT, () => {
  console.log(`[Web] Сервер запущен на порту ${PORT} для Render`);
});

// 2. НАСТРОЙКИ MINECRAFT БОТА
const botOptions = {
  host: '95.216.20.55', 
  port: 29367,          
  username: 'AFK_Bot_Helper',   
  version: false // Автоопределение версии протокола для 1.21.x
};

let bot;
let afkInterval;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('[MC] Бот зашел на сервер и садится на шифт!');
    
    // Авторизация на сервере (если плагин требует ввода пароля)
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/register superpassword123 superpassword123');
        bot.chat('/login superpassword123');
      }
    }, 2000);

    // Заставляем бота ВСЕГДА зажимать шифт (sneak)
    setTimeout(() => {
      if (bot && bot.entity) {
        bot.setControlState('sneak', true);
      }
    }, 3000);

    // Очищаем старый таймер перед созданием нового
    if (afkInterval) clearInterval(afkInterval);

    // Интервал обхода AFK: прыгаем раз в минуту, не отжимая шифт
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        // Подпрыгиваем
        bot.setControlState('jump', true); 
        
        setTimeout(() => {
          if (bot && bot.entity) {
            bot.setControlState('jump', false); 
            // На всякий случай перепроверяем, что шифт всё еще зажат
            bot.setControlState('sneak', true); 
          }
        }, 500); 
      }
    }, 60000); // Раз в 60 секунд
  });

  // Логика автоматического перезахода, если сервер перезапустится или кикнет бота
  bot.on('end', () => { 
    console.log('[MC] Бот отключился. Переподключение через 1 минуту...'); 
    if (afkInterval) clearInterval(afkInterval);
    setTimeout(createBot, 60000); 
  });
  
  bot.on('error', (err) => console.log('[MC] Ошибка бота: ', err));
}

createBot();
