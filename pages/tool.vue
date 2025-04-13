<template>
  <div class="p-4 space-y-4">
    <h1 class="text-xl font-bold">Thêm email vào tài khoản Roblox</h1>

    <textarea
        v-model="cookieList"
        rows="10"
        placeholder="Dán 15 cookie .ROBLOSECURITY, mỗi dòng 1 cookie"
        class="w-full border rounded p-2"
    ></textarea>

    <input
        v-model="email"
        type="email"
        placeholder="Nhập email muốn thêm"
        class="w-full border rounded p-2"
    />

    <input
        v-model="password"
        type="password"
        placeholder="Nhập mật khẩu tài khoản (nếu giống nhau)"
        class="w-full border rounded p-2"
    />

    <button @click="addEmailToAll" class="bg-blue-500 text-white px-4 py-2 rounded">
      Thêm email vào tất cả tài khoản
    </button>

    <ul class="mt-4 space-y-2">
      <li v-for="(log, i) in logs" :key="i" class="text-sm">
        <strong>{{ i + 1 }}:</strong> {{ log }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cookieList: '',
      email: '',
      password: '',
      logs: []
    }
  },
  methods: {
    async addEmailToAll() {
      this.logs = []
      const cookies = this.cookieList.split('\n').map(c => c.trim()).filter(Boolean)

      for (const [index, cookie] of cookies.entries()) {
        this.logs.push(`🔄 Cookie ${index + 1}: Đang xử lý...`)
        try {
          const res = await this.$axios.$post('/api/add-mail', {
            cookie,
            email: this.email,
            password: this.password
          })

          if (res.success) {
            this.logs[index] = `✅ Cookie ${index + 1}: ${res.message}`
          } else {
            this.logs[index] = `❌ Cookie ${index + 1}: ${res.message}`
          }
        } catch (err) {
          this.logs[index] = `❌ Cookie ${index + 1}: Lỗi không xác định`
        }
      }
    }
  }
}
</script>
