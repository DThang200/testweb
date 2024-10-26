<template>
  <div>
    <input  type="text" v-model="nameServer" placeholder="nameServer">
    <input  type="text" v-model="cookie" placeholder="Cookie">
    <button @click="createPrivateServer">Tạo</button>
    <div>
      result : {{response}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameServer : '',
      cookie : '',
      response : '',
    }
  },
  methods: {
    async createPrivateServer() {
      if (!this.nameServer || !this.cookie){
        this.response = 'Nhập thiếu'
        return false
      }
      const cookie = this.cookie; // Đặt cookie .ROBLOSECURITY của bạn
      const headers = {
        
      }
      try {
        const response = await this.$axios.$post(`https://games.roblox.com/v1/games/vip-servers/5836869368`, {
          expectedPrice : 0,
          name: this.nameServer
        }, {
          headers: {
            'Cookie': `.ROBLOSECURITY=${cookie}`,
          }
        });
        const serverDetail = await this.$axios.$post(`https://games.roblox.com/v1/vip-servers/${response.vipServerId}`, {
          newJoinCode : true,
        }, {
          headers: {
            'Cookie': `.ROBLOSECURITY=${cookie}`,
          }
        });
        console.log('serverDetail',serverDetail)
        this.response = serverDetail
      } catch (error) {
        console.error('Lỗi khi tạo máy chủ riêng tư:', error);
      }
    }
  }
}
</script>
