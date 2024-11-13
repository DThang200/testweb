<template>
  <div style="padding: 32px">
    <button type="button" @click="renderConfig">Render config</button>
    <div>
      response :
      <template v-for="res in responseAll">
        <div>{{res}}</div>
      </template>
    </div>
  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
    }),
  },
  data() {
    return {
      setting: {
        "relaunch_delay": 100,
        "kill_idle_roblox_delay": 20,
        "launch_delay": 20,
        "avoid_joining_same_accounts": false
      },
      config : {
        "use_private_server": true,
        "join_low_players_server": false,
      },
      responseAll :[],
      link_private_data : [],
    }
  },
  mounted() {
    console.log('this.$c.list.link_private',this.$c.link_private)
    if (!this.roblox_data?.devices){
      this.getDataRoblox();
    }
    this.initListLink();
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
    ]),
    initListLink() {
      const link_private = JSON.parse(localStorage.getItem('link_private'))
      if (link_private?.length > 0) {
        this.link_private_data = link_private
      } else {
        this.link_private_data = this.$c.link_private
        localStorage.setItem('link_private',JSON.stringify(this.link_private_data));
      }
      console.log('this.link_private',this.link_private_data)
    },
    async renderConfig() {
      const correctPassword = "matkhau123@"; // Mật khẩu cố định
      const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");

      if (userPassword !== correctPassword) {
        alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
        return false
      }
      const handleData = this.roblox_data?.devices.slice(1)
      for (const data of handleData) {
        const devices_id = data?.device_id
        const responseSetting = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${devices_id}/settings`, this.setting, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${devices_id}/configs`, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        // const config_id = resConfig?.configs[0]?.config_id
        // const configData = {...this.config,private_server_link : this.link_private_data.find(item => {return `VPS ${item?.name}` == data?.device_name})?.link}
        // console.log('configData',configData)
        // const responseConfig = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${devices_id}/configs/${config_id}`, configData, {
        //   headers: {
        //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        //   },
        // });
        // this.responseAll.push({
        //   name : data?.name,
        //   sett8ing : responseSetting ? 'Ok' : 'False',
        //   config : responseConfig ? 'Ok' : 'False',
        // })
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
