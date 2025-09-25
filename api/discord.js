// api/discord.js
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.set('etag', false)
app.use((req,res,next)=>{ res.setHeader('Cache-Control','no-store'); next() })

const DISCORD = 'https://discord.com/api/v10'
const token = String(process.env.DISCORD_BOT_TOKEN || '').trim() // "Bot <token>"
// GET /api/discord/webhook-messages?channelId=...&limit=100
app.get('/webhook-messages', async (req, res) => {
    try {
        const { channelId, limit = 50 } = req.query
        const r = await axios.get(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            params: { limit: Math.max(1, Math.min(100, Number(limit))) },
            headers: { Authorization: process.env.DISCORD_BOT_TOKEN },
            validateStatus: () => true
        })
        res.status(r.status).json(r.data)  // 👈 trả nguyên mảng message (có embeds nếu có)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

module.exports = app
