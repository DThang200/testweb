<template>
  <div>
    <div style="display: flex;gap: 10px;flex-shrink: 1">
      <div style="flex-shrink: 0;">
              <textarea v-model="inputServer" style="width: 500px;height: 500px">

      </textarea>
        <button style="flex-shrink: 0" @click="insertServer">Insert server</button>

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
      listServerUsed: [],
      notHasServerCount: [],
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
    insertServer() {
      const inputListServer = this.inputServer.split('\n')
      const listUnUse = this.inputServer.filter(item => !this.listServerUsed.includes(item));
      console.log('listUnUse',listUnUse)
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
