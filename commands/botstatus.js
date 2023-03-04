module.exports = {
    name: 'botstatus',
    execute(bot, username) {
      bot.chat(`/tell ${username} Bot health : ${bot.health}, Bot hunger : ${bot.food}`)
      console.log(`[Console] ${username} executed botstatus command!`);
    }
  }
