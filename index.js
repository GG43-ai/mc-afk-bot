const mineflayer = require('mineflayer');
// ИСПРАВЛЕНО: Импортируем отдельную функцию пинга из протокола
const ping = require('minecraft-protocol').ping;

const botOptions = {
  host: 'mc2205271.fmcs.cloud', 
  username: 'AFK_Bot_Helper',   
  version: '1.21.11' 
};

let bot = null;
let afkInterval = null;
let checkTimeout = null;

function checkServerAndConnect() {
  if (checkTimeout) clearTimeout(checkTimeout);
  
  if (bot && bot.entity) return;

  console.log('[Ping] Проверяем онлайн сервера без захода...');
  
  // ИСПРАВЛЕНО: Вызываем чистую функцию ping напрямую
  ping({ host: botOptions.host, version: botOptions.version }, (err, status) => {
    if (err) {
      console.log('[Ping] Сервер недоступен или выключен. Проверим через 2 минуты...');
      checkTimeout = setTimeout(checkServerAndConnect, 120000);
      return;
    }

    // Проверяем онлайн игроков
    const currentPlayers = status.players.online;
    console.log(`[Ping] Сейчас на сервере игроков: ${currentPlayers}`);

    if (currentPlayers === 0) {
      console.log('[MC] Сервер пуст! Запускаем полноценное подключение бота...');
      startBot();
    } else {
      console.log('[Ping] На сервере кто-то играет. Бот ждет. Следующая проверка через 2 минуты...');
      checkTimeout = setTimeout(checkServerAndConnect, 120000);
    }
  });
}

function startBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('[MC] Бот успешно зашел на сервер!');
    
    // Авторизация
    setTimeout(() => {
      if (bot && bot.chat) {
        bot.chat('/register superpassword123 superpassword123');
        bot.chat('/login superpassword123');
      }
    }, 2000);

    // Включаем постоянный шифт
    setTimeout(() => {
      if (bot && bot.entity) bot.setControlState('sneak', true);
    }, 3000);

    if (afkInterval) clearInterval(afkInterval);

    // Прыжки раз в минуту
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
  });

  // Логика выхода при заходе игрока
  bot.on('playerJoined', (player) => {
    if (!bot || !bot.players) return;
    if (player.username !== bot.username) {
      console.log(`[MC] Игрок ${player.username} зашел на server. Бот мгновенно отключается.`);
      if (afkInterval) clearInterval(afkInterval);
      bot.quit(); 
    }
  });

  bot.on('end', () => { 
    console.log('[MC] Бот отключился от сервера. Возвращаемся в режим скрытых проверок...'); 
    if (afkInterval) clearInterval(afkInterval);
    bot = null;
    checkTimeout = setTimeout(checkServerAndConnect, 120000);
  });
  
  bot.on('error', (err) => {
    console.log('[MC] Ошибка бота: ', err);
    bot = null;
  });
}

// Запускаем проверку
checkServerAndConnect();
