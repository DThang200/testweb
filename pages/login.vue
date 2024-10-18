<template>
  <div style="padding: 32px">
    <label for="input_username">username</label>
    <input id="input_username" type="text" v-model="username">
    <label for="input_username">Password</label>
    <input id="input_username" type="password" v-model="password">
    <button @click="onLogin">Login</button>
    <div>
      response : {{response}}
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      username: '',
      password: '',
      response: {},
    }
  },
  mounted() {
  },
  methods: {
    async onLogin() {
      const res = await this.$axios.$post('https://frontend.robloxmanager.com/v1/login', {
        username: this.username,
        password: this.password,
      })
      if (res) {
        this.response = res
      } else {
        this.response = 'Đăng nhập lại'
      }
    }
  }
};
</script>

<style>
.page-content-example {
  gap: 16px;
}
</style>
