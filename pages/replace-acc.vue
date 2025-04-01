<template>
  <div style="padding: 32px">
    <div>
      Time -
      <input type="text" v-model="time_off" placeholder="(Hrs)">
      <button @click="trackingAccount">Render</button>
    </div>
    <div>
          <textarea  v-model="deadAccount" rows="10" style="width: 500px;">

    </textarea>
      <button @click="copyContent(deadAccount)">Copy DeadAccount</button>
    </div>
    <div>
      <textarea v-model="inputChangeAcc" rows="10" style="width: 500px;" placeholder="input Change Acc">
      </textarea>
      <button @click="replaceAccount">Replace ({{this.deadAccountUser.length}} account)</button>
      <textarea v-if="changeAccRemain" v-model="changeAccRemain" rows="10" style="width: 500px;" placeholder="changeAccRemain">
      </textarea>
    </div>

  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";

export default {
  components: {
  },
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
      roblox_data_account: state => state.roblox_data_account,
      map_device_id_code: state => state.map_device_id_code,
    }),
  },
  data() {
    return {
      dataAccount : [],
      deadAccountUser : [],
      deadAccount : "",
      inputChangeAcc: "",
      changeAccRemain: "",
      time_off : 3
    }
  },
  watch: {
    roblox_data_account(){
      this.trackingAccount();
    },
  },
  mounted() {
    console.log(new Date().getTime())

    this.getDataRoblox();
    this.getDataAccount();
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getDataAccount',
      'setSaveDeleteAccount',
    ]),
    async replaceAccount() {
      if (this.inputChangeAcc){
        this.copyContent(this.deadAccount)
        const emptyAcc = this.inputChangeAcc.split('\n')
        if (emptyAcc.length >= this.deadAccountUser.length){
          const listEmptyAcc = []
          const resDelete = await this.$axios.delete(`https://frontend.robloxmanager.com/v1/bulk/accounts`, {
            data: this.deadAccountUser,
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
          emptyAcc.forEach((line) => {
            const arr_acc = line.split(':')
            const username = arr_acc[0]
            const password = arr_acc[1]
            const cookieAcc = arr_acc[2] + ':' + arr_acc[3]
            listEmptyAcc.push({username: username, password: password, cookie: cookieAcc})
          })
          let getAccIndex = 0
          for (let i = 0; i < this.dataAccount.length; i++) {
            let listAccFill = []
            const dataAccount = this.dataAccount[i]
            const needAcc = dataAccount.count || 0
            listAccFill = listEmptyAcc.slice(getAccIndex, getAccIndex + needAcc)
            getAccIndex = getAccIndex + needAcc
            if (listAccFill?.length > 0){
              console.log('this.dataAccount?.device_id',dataAccount?.device_id,needAcc)
              await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${dataAccount?.device_id}/bulk/accounts`, listAccFill,{
                headers: {
                  'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
                },
              });
            }
          }
          this.changeAccRemain = ""
          listEmptyAcc.slice(getAccIndex, listEmptyAcc.length).forEach(acc => {
            this.changeAccRemain += `${acc.username}:${acc.password}:${acc.cookie}`
          })
          await this.enableDevice();
        } else {
          alert(`Need more than ${this.deadAccountUser.length} account`);
        }
      }
    },
    async enableDevice() {
      for (let i = 0; i < this.dataAccount.length; i++) {
        const device = this.dataAccount[i];
        const listAccount = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/accounts`,{
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        let listDisable = []
        if (listAccount?.accounts?.length > 0){
          listAccount?.accounts.forEach(acc => {
            listDisable.push({
              username_look_for: acc?.username,
              enabled: true,
            })
          })
          await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`,listDisable,{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
      }
    },
    async trackingAccount() {
      this.dataAccount = []
      this.deadAccount = ""
      const trackingTime = Math.round((new Date().getTime() - ((this.time_off) * 3600  * 1000)) / 1000)
      console.log('trackingTime',trackingTime, trackingTime - 1743326985)
      this.roblox_data_account.accounts.forEach((acc) => {
        if (acc && acc?.last_updated > -1 && trackingTime > acc?.last_updated && acc?.device_id){
          this.deadAccountUser.push({username_look_for:acc.username});
          this.deadAccount += acc.username + ':' + acc.password + ':' + acc?.cookie + "\n"
          const findIndex = this.dataAccount.findIndex(item => item.device_id === acc.device_id);
          if (findIndex !== -1) {
            // Nếu tìm thấy, thay thế phần tử đó
            this.dataAccount[findIndex].count += 1
          } else {
            // Nếu không tìm thấy, thêm phần tử mới vào mảng
            this.dataAccount.push({device_id:acc.device_id,count : 1});
          }
          // "96889e68a0e302036e36adee2d3d647b194b30aeee72d76d0668ca8072dfec46"
        }
      })
      console.log('this.dataAccount',this.dataAccount)
      console.log('this.deadAccountUser',this.deadAccountUser)
      // 1743357954
      // 1740244025
    },
    copyContent(content) {
      navigator.clipboard.writeText(content);
      console.log('copyContent',content)
    },
  }
};
</script>

<style>
.page-content-example {
  gap: 16px;
}
</style>
