const fs = require('fs');

const commandFiles = fs.readdirSync('./commands'); // !! lol !!
const commandNames = commandFiles.map(file => file.replace('.js', '')); // create an array of file names without the file extension
const commandString = commandNames.join(', '); // join the array elements into a comma-separated string, example : test, help, thuy, thuy, thuy

module.exports = { // oklahoma command :skull:
    name: 'help',
    execute(bot, username) {
      bot.chat(`/tell ${username} Here are the commands : ${commandString}`)
      console.log(`[Console] ${username} executed help command!`);
    }
  }
