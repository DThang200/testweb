<template>
  <div>
    <div style="display: flex;gap: 10px;flex-shrink: 1">
      <div style="flex-shrink: 0;">
        -- need {{listAccountNotHasServer.length || 0}} server link
      <textarea v-model="inputServer" style="width: 500px;height: 300px">
      </textarea>
        <button style="flex-shrink: 0" @click="insertServer">Insert server</button>
        <button style="flex-shrink: 0" @click="removeServerLink">Removeserver</button>
      </div>
      <div>
        <table>
          <thead>
          <tr>
            <th>User name</th>
            <th>Game</th>
            <th>Server</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="acc in listAccount">
            <td>{{acc.username}}</td>
            <td>GAG</td>
            <td>{{acc.private_server_link}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="display: flex;gap: 10px;flex-shrink: 1">
      <textarea v-model="readServerVip" style="width: 500px;height: 300px">

      </textarea>
      <button @click="renderServer">Render</button>
      <textarea v-if="serverVipOutput" v-model="serverVipOutput" style="width: 500px;height: 300px">

      </textarea>
    </div>
  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      roblox_data_account: state => state.roblox_data_account,
    }),
  },
  watch:{
    roblox_data_account: {
      handler(){
        this.getDataByDevice()
      },deep: true
    }
  },
  data() {
    return {
      inputServer: "",
      output: "",
      listDevice: [],
      listAccount: [],
      listAccountNotHasServer: [],
      listServerUsed: [],
      notHasServerCount: [],
      readServerVip: "",
      serverVipOutput: "",
      renderSvvfinish: false,
    };
  },
  beforeDestroy() {
  },
  mounted() {
    const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
    Object.entries(map_device_data).forEach((device,index) => {
      if (device[1]?.script.includes("gag-bone")){
        this.listDevice.push(device[0])
      }
    })
    console.log('this.listDevice',this.listDevice)
    this.getDataAccount();
  },
  methods: {
    ...mapActions([
      'getDataAccount',
    ]),
    async getDataByDevice() {
      const listAccount = []
      this.notHasServerCount = 0
      console.log('this.roblox_data_account',this.roblox_data_account)
      this.roblox_data_account.accounts.forEach(account => {
        if (account.device_id && this.listDevice.includes(account.device_id) && account.enabled === true){
          listAccount.push({username : account.username,device_id: account.device_id,private_server_link : account.private_server_link})
          if (account.private_server_link){
            this.listServerUsed.push(account.private_server_link)
          } else {
            this.listAccountNotHasServer.push(account.username)
            this.notHasServerCount +=1
          }
          listAccount.sort((a, b) => {
            const aHasLink = !!a.private_server_link;
            const bHasLink = !!b.private_server_link;

            return aHasLink - bHasLink;
          });
          this.listAccount = listAccount
        }
      })
    },
    async insertServer() {
      const inputListServer = [...new Set(this.inputServer.split('\n'))]
      const listUnUse = inputListServer.filter(item => !this.listServerUsed.includes(item));
      for (let i = 0; i < this.listAccountNotHasServer.length; i++) {
        const username = this.listAccountNotHasServer[i]
        await this.$axios.$put(`https://api.robloxmanager.com/v1/accounts/${username}`, {
          private_server_link: listUnUse[i]
        }, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
      }
    },
    async removeServerLink() {
      for (let i = 0; i < this.listAccount.length; i++) {
        const username = this.listAccount[i].username
        await this.$axios.$put(`https://api.robloxmanager.com/v1/accounts/${username}`, {
          private_server_link: ""
        }, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
      }
    },
    renderServer(){
      const data = JSON.parse(this.readServerVip)
      this.serverVipOutput = ""
      this.renderSvvfinish = false
      if (data.messages){
        data.messages.forEach(mss => {
          this.serverVipOutput += "https://www.roblox.com/games/126884695634066/Grow-a-Garden?" + mss.content + '\n'
        })
      }
    }
  }
};
</script>
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px 20px;
}
</style>
