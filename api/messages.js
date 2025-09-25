// api/messages.js
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

module.exports = async (req, res) => {
    const channelId = '1420090949584949330' // thay bằng channel ID
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN)
    try {
        const messages = await rest.get(
            Routes.channelMessages(channelId),
            { query: { limit: 10 } }
        )

        // lọc tin webhook
        const webhookMessages = messages.filter(m => m.webhook_id)

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(webhookMessages))
    } catch (e) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: e.message }))
    }
}
