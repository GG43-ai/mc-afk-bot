const mineflayer = require('mineflayer');

const botOptions = {
  host: 'mc2205271.fmcs.cloud', 
  username: 'AFK_Bot_Helper',   
  version: '1.21.1' 
};

let bot = null;
let afkInterval = null;
let checkTimeout = null;

function checkServerAndConnect() {
  if (checkTimeout) clearTimeout(checkTimeout);
  
  // Если бот уже на сервере, проверка не нужна
  if (bot && bot.entity) return;

  console.log('[Ping] Проверяем онлайн сервера без захода...');
  
  // Отправляем легкий пинг-запрос серверу
  mineflayer.ping({ host: botOptions.host, version: botOptions.version }, (err, status) => {
    if (err) {
      console.log('[Ping] Сервер недоступен или выключен. Проверим через 2 минуты...');
      checkTimeout = setTimeout(checkServerAndConnect, 120000);
      return;
    }

    // Узнаем количество игроков на сервере из пакета пинга
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

  // Если вы или другой игрок заходите на сервер — бот МОМЕНТАЛЬНО выходит
  bot.on('playerJoined', (player) => {
    if (!bot || !bot.players) return;
    if (player.username !== bot.username) {
      console.log(`[MC] Игрок ${player.username} зашел на сервер. Бот мгновенно отключается.`);
      if (afkInterval) clearInterval(afkInterval);
      bot.quit(); 
    }
  });

  bot.on('end', () => { 
    console.log('[MC] Бот отключился от сервера. Возвращаемся в режим скрытых проверок...'); 
    if (afkInterval) clearInterval(afkInterval);
    bot = null;
    // После выхода сразу запускаем цикл тихих пинг-проверок раз в 2 минуты
    checkTimeout = setTimeout(checkServerAndConnect, 120000);
  });
  
  bot.on('error', (err) => {
    console.log('[MC] Ошибка бота: ', err);
    bot = null;
  });
}

// Запускаем первую тихую проверку при старте скрипта
checkServerAndConnect();
