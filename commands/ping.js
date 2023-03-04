module.exports = {
  name: 'ping',
  execute(bot, username) {
    bot.chat(`/tell ${username} Your ping is : ${bot.player.ping}ms`)
    console.log(`[Console] ${username} executed ping command!`);
  }
}
