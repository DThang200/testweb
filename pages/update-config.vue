<template>
  <div>

    <div style="display: flex;flex-direction: row">
      <div style="padding: 32px;border: black solid 1px;flex: 1">
        <div style="width: 100%;display: flex;flex-direction: row">
          <div style="width: 50%;display: flex;flex-direction: column">
            <span style="font-size: 24px;font-weight: bold">SETTING</span>
            <div>Launch delay : <input type="number" v-model="setting.launch_delay"></div>
            <div>Kill idle roblox delay : <input type="number" v-model="setting.kill_idle_roblox_delay"></div>
            <div>Relaunch delay : <input type="number" v-model="setting.relaunch_delay"></div>
            <div>Avoid joining same accounts : <input type="checkbox" v-model="setting.avoid_joining_same_accounts">{{setting.avoid_joining_same_accounts}}</div>
          </div>
          <div style="width: 50%">
            <span style="font-size: 24px;font-weight: bold">Game Configs</span> <input type="checkbox" v-model="update_config">
            <div>Use private_server : <input type="checkbox" v-model="config.use_private_server">{{config.use_private_server}}</div>
            <div>Join low players server : <input type="checkbox" v-model="config.join_low_players_server">{{config.join_low_players_server}}</div>
          </div>
        </div>
        <button type="button" @click="renderConfig">Render config</button>
        <div>
          response :
          <template v-for="res in responseAll">
            <div>{{res}}</div>
          </template>
        </div>
      </div>
      <div style="padding: 32px;border: black solid 1px;flex: 1;display: flex;flex-direction: row">
        <div style="flex: 1">
          <div>Enable per Device : <input type="number" v-model="enable_per_device"></div>
          <button type="button" v-if="finishRender" @click="renderEnable">Render enable</button>
          <button type="button" @click="addFixLag">Add fix lag</button>
          <div>
            <div v-for="statusDv in enableDeviceStatus">
              {{statusDv?.name}} - {{statusDv?.status ? 'Done' : 'False'}}
            </div>
          </div>
        </div>
        <div style="flex: 1">
          Check acc
          <select :disabled="!(roblox_data?.devices?.length)" v-model="select_pc">
            <option value="">All</option>
            <option :value="device.device_id" v-for="device in roblox_data.devices">{{device.device_code}}</option>
          </select>
          <template v-if="finishRender">
            <template v-if="pcDetail && pcDetail?.length">
              <template v-for="device in pcDetail">
                <div v-if="!select_pc || select_pc === device.deviceId" style="border: black solid 1px;padding: 8px;display: flex;flex-direction: row;gap: 8px">
                  <div>
                    Name : {{device?.deviceName}}
                  </div>
                  <div>
                    Total : {{device?.length}}
                  </div>
                  <div>
                    Enable : <span style="color: #0ECB81">{{device?.enable}}</span>
                  </div>
                  <div>
                    Disable : <span style="color: #F6465D">{{device?.disable}}</span>
                  </div>
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            Loading ...
          </template>
        </div>
      </div>
    </div>
    <div style="padding: 32px">
      Fix Error
      <div>Last Enable per Device : <input type="number" v-model="last_enable_per_device"></div>
      <button type="button" v-if="finishRender" @click="renderFixEnable">Render fix enable</button>
    </div>
    <div style="padding: 32px">
      <button type="button" v-if="finishRender" @click="setupConfigChange">Setup Config Change</button>
      <button type="button" v-if="finishRender" @click="getEmptyAcc">Get Empty acc Bf</button>
      <button type="button" v-if="finishRender" @click="deleteAcc">Delete acc</button>
    </div>

  </div>
</template>

<script>

import {mapActions, mapState} from "vuex";
import {enable} from "core-js/internals/internal-metadata";

export default {
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
      map_device_id_code: state => state.map_device_id_code,
    }),
  },
  watch: {
    async select_pc(value) {
      if (value) {
        this.select_pc_detail = await this.renderDevice(value)
      } else {
        this.select_pc_detail = await this.renderDevice(value)
      }
    }
  },
  data() {
    return {
      setting: {
        launch_delay: 30,
        relaunch_delay: 130,
        kill_idle_roblox_delay: 20,
        "avoid_joining_same_accounts": false
      },
      config : {
        "use_private_server": true,
        "join_low_players_server": false,
      },
      update_config : false,
      last_enable_per_device : 30,
      enable_per_device : 30,
      select_pc: '',
      pcDetail: [],
      enableDeviceStatus : [],
      finishRender: false,
      responseAll :[],
      link_private_data : [],
      scriptFixLagBase64 : btoa(unescape(encodeURIComponent(
          `game:GetService("RunService"):Set3dRenderingEnabled(false)
                for i,v in next, workspace:GetDescendants() do
                    pcall(function()
                        v.Transparency = 1
                    end)
                end
                for i,v in next, getnilinstances() do
                    pcall(function()
                        v.Transparency = 1
                        for i1,v1 in next, v:GetDescendants() do
                            v1.Transparency = 1
                        end
                    end)
                end
                a = workspace
                a.DescendantAdded:Connect(function(v)
                    pcall(function()
                        v.Transparency = 1
                    end)
                end)`
      ))),
    }
  },
  async mounted() {
    console.log('this.scriptFixLagBase64',this.scriptFixLagBase64)
    this.initListLink();
    if (!this.roblox_data?.devices) {
      await this.getDataRoblox();
      await this.initListDevice();
    } else {
      await this.initListDevice();
    }
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
        alert("Mật khẩu không chính xác.");
        return false
      }
      const handleData = this.roblox_data?.devices
      this.setting.launch_delay = typeof(this.setting.launch_delay) === 'number' ? this.setting.launch_delay : parseInt(this.setting.launch_delay)
      this.setting.kill_idle_roblox_delay = typeof(this.setting.kill_idle_roblox_delay) === 'number' ? this.setting.kill_idle_roblox_delay : parseInt(this.setting.kill_idle_roblox_delay)
      this.setting.relaunch_delay = typeof(this.setting.relaunch_delay) === 'number' ? this.setting.relaunch_delay : parseInt(this.setting.relaunch_delay)
      for (const data of handleData) {
        const devices_id = data?.device_id
        const responseSetting = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${devices_id}/settings`, this.setting, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        if (this.update_config){
          console.log('this.update_config',this.update_config)
          // const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${devices_id}/configs`, {
          //   headers: {
          //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          //   },
          // });
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
    },
    async renderFixEnable() {
      this.enableDeviceStatus = []
      const listDevice = []
      if (this.select_pc) {
        const data = this.pcDetail.find(pc => pc.deviceId == this.select_pc)
        listDevice.push(data)
      } else {
        this.pcDetail.forEach(pc => {
          listDevice.push(pc)
        })
      }
      for (let i = 0; i < listDevice.length; i++) {
        const pc = listDevice[i]
        const enabledIndex = this.last_enable_per_device  - pc.enable
        const enabledIndexFix = (pc?.indexLastEnable + 1 || this.last_enable_per_device) + enabledIndex - 1
        console.log('enabledIndex,enabledIndexFix,pc?.indexLastEnable',enabledIndex,enabledIndexFix,pc?.indexLastEnable)
        pc.dataEnable = []
        if (pc?.listAcc) {
          pc?.listAcc.forEach((acc, index) => {
            if (index > pc?.indexLastEnable && index < enabledIndexFix){
              pc.dataEnable.push({
                username_look_for: acc?.username,
                enabled: true,
              })
            }
          })
          const response = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${pc?.deviceId}/bulk/accounts`, pc?.dataEnable, {
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
      }
    },
    async addFixLag() {

      this.enableDeviceStatus = []
      // const correctPassword = "matkhau123@"; // Mật khẩu cố định
      // const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");
      //
      // if (userPassword !== correctPassword) {
      //   alert("Mật khẩu không chính xác.");
      //   return false
      // }
      const listDevice = []
      if (this.select_pc) {
        const data = this.pcDetail.find(pc => pc.deviceId == this.select_pc)
        listDevice.push(data)
      } else {
        this.pcDetail.forEach(pc => {
          listDevice.push(pc)
        })
      }
      for (let i = 0; i < listDevice.length; i++) {
        const pc = listDevice[i]
        let status = false
        if (pc?.listAcc) {
          const responseConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${pc?.deviceId}/configs`, {
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
          const configId = responseConfig?.configs[0]?.config_id
              const response = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/configs/${configId}/scripts`, {
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
          let checkValid = false
          if (response?.scripts){
            for (let j = 0; j < response?.scripts?.length; j++) {
              console.log('response?.scripts[i]?.script_data',response?.scripts[j]?.script_data)
              if (response?.scripts[j]?.script_data === this.scriptFixLagBase64){
                checkValid = true
              }
            }
          }
          if (!checkValid){
            console.log('device?.deviceName',pc?.deviceName)

            if (configId){
              const responseCreateScriptFixLag = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${configId}/scripts`, {
                "script_name": "Fix lag",
                "script_data": this.scriptFixLagBase64
              },{
                headers: {
                  'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
                },
              });
              console.log('device?.deviceName',pc?.deviceName)
              console.log('responseCreateScriptFixLag',responseCreateScriptFixLag)
            }
          }
          // response.scripts
          // post https://frontend.robloxmanager.com/v1/configs/${pc?.deviceId}/scripts
          // {
          //   "script_name": "Fix lag",
          //     "script_data": "this.scriptFixLagBase64"
          // }
          if (response) {
            status = true
          }
        }
        this.enableDeviceStatus[i] = {
          name: pc.deviceName,
          status: status
        }
      }
    },
    async renderEnable() {
      this.enableDeviceStatus = []
      const correctPassword = "matkhau123@"; // Mật khẩu cố định
      const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");

      if (userPassword !== correctPassword) {
        alert("Mật khẩu không chính xác.");
        return false
      }
      const listDevice = []
      if (this.select_pc) {
        const data = this.pcDetail.find(pc => pc.deviceId == this.select_pc)
        listDevice.push(data)
      } else {
        this.pcDetail.forEach(pc => {
          listDevice.push(pc)
        })
      }
      for (let i = 0; i < listDevice.length; i++) {
        const pc = listDevice[i]
        pc.dataEnable = []
        let status = false
        if (pc?.listAcc) {
          pc?.listAcc.forEach((acc, index) => {
            pc?.dataEnable.push({
              username_look_for: acc?.username,
              enabled: index < this.enable_per_device,
            })
          })
          const response = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${pc?.deviceId}/bulk/accounts`, pc?.dataEnable, {
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
          if (response) {
            status = true
          }
        }
        this.enableDeviceStatus[i] = {
          name: pc.deviceName,
          status: status
        }
      }
      // https://frontend.robloxmanager.com/v1/devices/714c78249bf7da7b65c721d6c20a2b2160729eceee8dbddb150a85b7fa0838ef/bulk/accounts
      // [{
      //   "username_look_for": "arpertcsoibdn71",
      //   "enabled": true
      // }]
      // const listAccount = this.renderDevice()
    },
    async initListDevice(){
      if (this.pcDetail.length > 0){
        return false
      }
      this.finishRender = false
      if (this.roblox_data && this.roblox_data.devices && this.roblox_data.devices?.length > 0){
        for (let i = 0; i < this.roblox_data.devices?.length; i++) {
        // for (let i = 0; i < 5; i++) {
          console.log('this.roblox_data.devices[i]',this.roblox_data.devices[i])
          const device = this.roblox_data.devices[i]
          const data = await this.renderDevice(device.device_id)
          let enable = 0
          let disable = 0
          let indexLastEnable = 0
          if (data){
            data.accounts.forEach((acc,accIndex) => {
              if (acc?.enabled){
                enable +=1
                indexLastEnable = accIndex
              } else {
                disable +=1
              }
            })
            // this.pcDetail[i] =
            //     {
            //       deviceName: this.map_device_id_code[device.device_id],
            //       deviceId: device.device_id,
            //       enable: enable,
            //       disable: disable,
            //       indexLastEnable: indexLastEnable,
            //       length: data?.accounts?.length || 0,
            //       listAcc : data?.accounts || []
            //     }
            this.pcDetail.push({
              deviceName: this.map_device_id_code[device.device_id],
              deviceId: device.device_id,
              enable: enable,
              disable: disable,
              indexLastEnable: indexLastEnable,
              length: data?.accounts?.length || 0,
              listAcc : data?.accounts || []
            })
          }
        }
        console.log('this.pcDetail',this.pcDetail)
            this.finishRender = true
      }
    },
    async renderDevice(device_id) {

      // https://frontend.robloxmanager.com/v1/devices/e31811226d275161a8ef83ca9023ca007d996c13462e4ac23b9b6d58c7823763/accounts
          const response = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device_id}/accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      return response;
    },
    async setupConfigChange() {
      const listDevice = this.roblox_data?.devices
      console.log('listDevice',listDevice)
      for (const device of listDevice) {
        const device_id = device?.device_id
        const resSetScriptFisch = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device_id}/updateautochange`, {
          // auto_change_config_id: "80bcdd12f58138ee2372182a0a4f6198f87115638aaa407095fb2cf408d7c2f7",
          // auto_change_enabled : true,
          auto_change_cookie_dead_enabled : true
        }, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        // const resSetScriptFisch = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device_id}/updateautochange`, {
        //   auto_change_config_id: "80bcdd12f58138ee2372182a0a4f6198f87115638aaa407095fb2cf408d7c2f7",
        //   auto_change_enabled : true
        // }, {
        //   headers: {
        //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        //   },
        // });
        // const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device_id}/updatefischautochange`, {
        //   fisch_auto_change_config_id: "00331c3622ae01b4b85087fccf82ad44b1c36b109aa3865bb52cdc5369a63abb",
        //   fisch_auto_change_enabled : true
        // }, {
        //   headers: {
        //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        //   },
        // });
      }
    },
    async getEmptyAcc() {
      const accBf = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/emptyaccounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      let copyContent = ''
      console.log('accBf',accBf)
      accBf.accounts.forEach(item => {
        copyContent += `${item.username}:${item.password}:${item.cookie}` + '\n'
      })
      navigator.clipboard.writeText(copyContent);
    },
    async deleteAcc() {
      const accBf = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/emptyaccounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      let deleteAcc = []
      console.log('accBf',accBf)
      accBf.accounts.forEach(item => {
        deleteAcc.push({username_look_for:item.username})
      })
      console.log('deleteAcc',deleteAcc)
      const resSetScriptFisch = await this.$axios.delete(`https://frontend.robloxmanager.com/v1/bulk/accounts`,  {
        data:deleteAcc,
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
    }
  }
};
</script>

<style>
.page-content-example {
  gap: 16px;
}
</style>
