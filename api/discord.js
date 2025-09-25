// api/discord.js
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.set('etag', false)
app.use((req,res,next)=>{ res.setHeader('Cache-Control','no-store'); next() })

const DISCORD = 'https://discord.com/api/v10'
const TOKEN = String(process.env.DISCORD_BOT_TOKEN || '').trim()

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)) }
const isSnowflake = s => /^\d{10,20}$/.test(String(s||''))

// ---- tách handler ra riêng ----
async function latest1000Handler(req, res) {
    try {
        const channelId = String(req.query.channelId || '')
        const want = 1000
        if (!isSnowflake(channelId)) return res.status(400).json({ error: 'Invalid channelId' })
        if (!TOKEN.startsWith('Bot ')) return res.status(500).json({ error: 'Invalid DISCORD_BOT_TOKEN' })

        const out = []
        let before

        async function fetchBatch() {
            const params = new URLSearchParams({ limit: '100' })
            if (before) params.set('before', before)
            const r = await axios.get(`${DISCORD}/channels/${channelId}/messages?${params}`, {
                headers: { Authorization: TOKEN }, validateStatus: () => true
            })
            if (r.status === 429) {
                const ms = Math.ceil((r.data?.retry_after || 1) * 1000)
                await sleep(ms); return fetchBatch()
            }
            if (r.status !== 200) throw new Error(`Discord ${r.status}`)
            return r.data || []
        }

        while (out.length < want) {
            const batch = await fetchBatch()
            if (!batch.length) break
            out.push(...batch)
            before = batch[batch.length - 1].id
            if (batch.length < 100) break
            await sleep(700)
        }

        // Trả RAW để giữ embeds/attachments/flags/...
        res.json({ channelId, count: Math.min(out.length, want), results: out.slice(0, want) })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

// ---- gán cùng một handler cho 2 đường dẫn ----
app.get('/latest1000', latest1000Handler)
app.get('/', latest1000Handler)   // cho phép gọi root /api/discord

module.exports = app
