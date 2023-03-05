console.log(` ` +
    `\nnijikaBOT @ thuy#5407 [Version ${require('./package.json').version}]`+
    `\n<c> 2023 retard technologies` +
    `\n `
);

const fs = require('fs');
const path = require('path');
const mineflayer = require('mineflayer');
const config = require('./settings.json');
require('dotenv').config();

const botInfo = { // Will be migrated to .env for repl.it users to prevent their smp ip leaked or smth ffs
    host: process.env.MC_HOST,
    port: process.env.MC_PORT,
    username: process.env.MC_USERNAME,
    version: process.env.MC_VERSION
};

console.log(`${botInfo.username} is starting..`)

const prefix = process.env.INGAME_PREFIX;
const commandsFolder = './commands';

const commands = new Map();
fs.readdirSync(commandsFolder).forEach(file => {
  const command = require(path.join(__dirname, commandsFolder, file));
  commands.set(command.name, command);
});

const initBot = () => {
    let bot = mineflayer.createBot(botInfo); // create the bot

    bot.once('spawn', () => {
        console.log(`${botInfo.username} has joined to the server`);
    })

    bot.on('message', (message) => { // Logs Minecraft messages to console.
           console.log(message.toString());
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
      
        if (message.startsWith(prefix)) {
          const args = message.slice(prefix.length).trim().split(/ +/);
          const commandName = args.shift().toLowerCase();
      
          const command = commands.get(commandName);
      
          if (!command) {
            bot.chat(`Unknown command: ${commandName}`);
            return;
          }
      
          try {
            command.execute(bot, username, args);
          } catch (error) {
            bot.chat(`An error occurred while executing the ${commandName} command: ${error.message}`);
          }
        }
      });

    if (config['spammer'].enabled) {
        console.log('[Spammer] Enabled');

        let messages = config['spammer']['messages'];

        if (config['spammer'].repeat) {
           let delay = config['spammer']['delay'];
           let i = 0;

           setInterval(() => {
              bot.chat(`${messages[i]}` + " [" + generateRandomString(4) + "]");

              if (i + 1 === messages.length) {
                 i = 0;
              } else i++;
           }, delay * 1000);
        } else {
           messages.forEach((msg) => {
              bot.chat(msg);
           });
        }
     }

     if (config.friendlymode.enabled) {  // Don't use friendlymode when PVP feature is enabled.
      console.log(`[Friendly Mode] Enabled`);

      bot.on("move", ()=>{ // Tried this on 2b2t. A player kidnapped the bot.
        const playerFilter = (entity) => entity.type === 'player' // filters out all entities except the player.
        let player = bot.nearestEntity(playerFilter);
    
        if (player) {
            bot.lookAt(player.position.offset(0, player.height, 0))
            bot.swingArm('right')
            setInterval(() => {
               bot.setControlState('sneak', true)
           }, 450);
           setInterval(() => {
            bot.setControlState('sneak', false)
        }, 200); // friendly got cool downs for anticheats
      }
    })
  };

    bot.on('end', () => {
        console.log(`Disconnected`);
        setTimeout(initBot, 5000); // attempt to reconnect
    });

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`Failed to connect to ${err.address}:${err.port}`)
        }
        else {
            console.log(`Unhandled error: ${err}`);
        }
    });
};

// String Randomizer
function generateRandomString(length) { // roblox
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

initBot();
