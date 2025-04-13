// serverMiddleware/add-mail.js

const fetch = require('node-fetch') // Cài đặt node-fetch nếu chưa có

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Chỉ hỗ trợ phương thức POST.' })
    }

    const { cookie, email, password } = req.body

    if (!cookie || !email || !password) {
        return res.status(400).json({ success: false, message: 'Thiếu cookie, email hoặc mật khẩu.' })
    }

    try {
        // Bước 1: Lấy CSRF Token
        const response1 = await fetch('https://accountinformation.roblox.com/v1/email', {
            method: 'POST',
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}),
        })

        const csrfToken = response1.headers.get('x-csrf-token')
        if (!csrfToken) throw new Error('Không lấy được CSRF token')

        // Bước 2: Thêm email vào tài khoản
        const response2 = await fetch('https://accountinformation.roblox.com/v1/email', {
            method: 'POST',
            headers: {
                Cookie: `.ROBLOSECURITY=${cookie}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                emailAddress: email,
                password: password
            })
        })

        const data = await response2.json()

        if (response2.ok) {
            return res.status(200).json({ success: true, message: 'Thêm email thành công.' })
        } else {
            return res.status(400).json({ success: false, message: data.errors[0]?.message || 'Lỗi không xác định' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || 'Lỗi không xác định' })
    }
}
