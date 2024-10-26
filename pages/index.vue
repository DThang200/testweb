<template>
<main class="page-content">
  <button type="button" @click="getDataAccountRender">Render</button>
  <div style="margin-left: auto">
    <input v-model="sortInactive" id="sortInactive" type="checkbox">
    <label for="sortInactive">Xắp xếp theo trạng thái không hoạt động</label>
  </div>
  <div class="list-remote-pc" v-if="roblox_data?.devices?.length > 0">
    <div v-for="data in roblox_data.devices" class="remote-pc-item" :class="getStatusClass(data)" :key="data.device_code">
      <div>
        {{data.device_name}}
      </div>
<!--      <div>-->
<!--        tổng {{data.total_accounts}} máy-->
<!--      </div>-->
      <div>
      {{data.inactive_accounts}}
      </div>
      <div>
      {{data.active_accounts}}
      </div>
      <div class="input-device">
        <template v-if="editDevice == data.device_code">
          <input v-model="data.device_remote" class="input-device_input" type="text" placeholder="Link của google remote">
          <button class="input-device_save" @click="saveDeviceId(data)">
            Save
          </button>
        </template>
        <button class="input-device_connect" @click="connectDevice(data.device_remote)">
          Connect
        </button>
      </div>
      <div v-show="editDevice == data.device_code">
        <select v-model="data.user_collect" @change="(e) => {setCollectScript(data?.device_id,e?.target?.value)}" v-if="map_key_token_gom?.length > 0">
          <option value="">Không</option>
          <template v-for="data in map_key_token_gom">
            <option :value="data?.key">{{data?.key}}</option>
          </template>
        </select>
        <button @click="setFarmScript(data?.device_id,data?.device_name,'lava')">Farm Lava</button>
        <button @click="setFarmScript(data?.device_id,data?.device_name,'princess')">Farm Công chúa</button>
      </div>

      <div class="input-device_action" @click="() => {if(editDevice !== data.device_code){editDevice = data.device_code} else {editDevice = ''}}">
        edit
      </div>
    </div>
  </div>
</main>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  computed: {
    ...mapState({
      roblox_data_state: state => state.roblox_data,
      map_device_code_sum_acc: state => state.map_device_code_sum_acc,
      map_key_token_gom: state => state.map_key_token_gom,
      map_key_token_farm: state => state.map_key_token_farm,
    }),
  },
  watch:{
    roblox_data_state: {
      handler(value){
        if (this.sortInactive){
          let data = JSON.parse(JSON.stringify(value))
          data.devices.sort((a, b) => b.inactive_accounts - a.inactive_accounts)
          this.roblox_data = data
        }else {
          this.roblox_data = JSON.parse(JSON.stringify(value))
        }
      },deep: true
    }
  },

  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    clearInterval(this.intervalId);
  },
  data () {
    return {
      editDevice: '',
      sortInactive: false,
      roblox_data: [],
    }
  },
  async mounted() {
    this.getDataRoblox();
    this.initData();
    this.getKeyGom();
    this.getKeyFarm();

  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getDataAccount',
      'getKeyGom',
      'getKeyFarm',
    ]),
    getDataAccountRender (){
      this.getDataAccount()
    },
    initData() {
      this.intervalId = setInterval(() => {
        this.getDataRoblox()
      }, this.$config.INTERVAL_TIME);
    },
    getStatusClass(data = null){
      if (!(data?.total_accounts > 0)) {
        return 'disable'
      }
      if (data?.inactive_accounts){
        if (data?.inactive_accounts > 10) {
          return 'danger'
        } else if (data?.inactive_accounts > 5){
          return 'warning'
        }
      }
    },
    connectDevice(device_remote){
      if (!device_remote){
        alert('Chưa Nhập Device link')
        return
      }
      window.open(`${device_remote}`, '_blank');
      // window.open(`https://remotedesktop.google.com/access/session/${device_remote}`, '_blank');
    },
    saveDeviceId(data){
      if (!data?.device_remote){
        alert('Chưa Nhập Device Id')
        return
      }
      let device_remotes = JSON.parse(localStorage.getItem('device_remotes'));
      const deviceId = data.device_code || data.device_name.replace(/ /g, '_');
      if (!device_remotes) {
        device_remotes = {}
      }
      device_remotes[deviceId] = data.device_remote
      localStorage.setItem('device_remotes',JSON.stringify(device_remotes));
    },
    setCollectScript(device_id,user_collect){
      if (!user_collect){
            this.setFarmScript(device_id)
        return
      }
      this.roblox_data?.devices.forEach(item => {
        if (!user_collect && item?.device_id === device_id){
          this.setFarmScript(item?.device_id,item?.device_name,'lava')
          return
        }
        if (item?.user_collect && item?.user_collect === user_collect){
          item.user_collect = ''
          this.setFarmScript(item?.device_id,item?.device_name,'lava')
        }
        if (item?.device_id === device_id){
          item.user_collect = user_collect
        }
      })
      const token = this.map_key_token_gom.find(data => data?.key == user_collect)?.token
      const script = `script_key = "${token}"
            getgenv().SelectedPlayer = "${user_collect}"
            getgenv().MainAccount = false
            getgenv().AccountForMainToFolow = ""
            getgenv().EnableAccountForMainFolow = false
            getgenv().MainAccountSetting = {
                Units = false,
                ManuallyClaimBooth = false,
            }
            getgenv().AltAccountSetting = {
                Trade = true,
                NotSendGem = true,
                TradeItems = {"Trait Crystal", "Risky Dice", "Frost Bind"},
                GiveBackUnit = true,
                KickAfterDoneTrade = true,
            }
            loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/3051457467c11f25288cfe2de3708373.lua"))()`;
      this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))))
    },
    setFarmScript(device_id,device_name,unit = 'lava'){
      const token = this.map_key_token_farm.find(data => data.key == device_name)?.token
      if (unit === 'lava') {
        const script =
            `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().TargetUnitRoll = {
                  "Admiral Of Lava"
              }

              getgenv().notRollUnitTarget = false
              getgenv().UseSavePosition = {
                  ["Enabled"] = false,
                  ["File Name"] = ""
              }
              getgenv().GemRollUnit = 2500
              getgenv().Speed = {
                  ["Speed"] = 2,
                  ["Wave Active Speed"] = 1,
              }
              getgenv()["Black Screen"] = true
              getgenv()["Auto Leave Infinite"] = {
                  ["Auto Leave"] = true,
                  ["Method"] = {
                      ["Sell"] = true,
                      ["Leave"] = true,
                  },
                  ["Wave"] = 46
              }
              getgenv().Auto_Equip = {
                  ["Equip Best"] = true,
                  ["Custom Equip"] = {
                      ["Enabled"] = false,
                      ["Units"] = {
                          "Chief Of Lava",
                      },
                  },
              }
              getgenv().Portal = {
                  ["Enabled"] = false,
                  ["Name Portal"] = "Demon Portal",
                  ["Auto Get Portal"] = false,
                  ["Rarity Portal"] = {
                      ["Rare"] = true,
                      ["Epic"] = true,
                      ["Legendary"] = false,
                      ["Mythical"] = false,
                      ["Secret"] = false,
                  },
                  ["Unit"] = {
                      ["Use All Unit"] = true,
                      ["Custom Unit"] = {
                          "Admiral Of Lava",
                      }
                  },
              }
              getgenv().Webhook =  {
                  ["Webhook"] = false,
                  ["Url"] = "",
                  ["Roll Unit"] = true,
                  ["Story/Infinite"] = true,
              }
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-KaitunAD.lua"))()`;
        this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))))
      } else {
        const script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer

                        getgenv().Key = "${token}"

                        getgenv().TargetUnitRoll = {

                            "Princess Swordmaster"

                        }



                        getgenv().notRollUnitTarget = true

                        getgenv().UseSavePosition = false

                        getgenv().GemRollUnit = 20000

                        getgenv().Speed = 2

                        getgenv()["Black Screen"] = true

                        getgenv()["Auto Leave Infinite"] = {

                            ["Auto Leave"] = true,

                            ["Method"] = {

                                ["Sell"] = true,

                                ["Leave"] = true,

                            },

                            ["Wave"] = 46

                        }

                        getgenv().Auto_Equip = {

                            ["Equip Best"] = true,

                            ["Custom Equip"] = {

                                ["Enabled"] = false,

                                ["Units"] = {

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight",

                                },

                            },

                        }

                        getgenv().Portal = {

                            ["Enabled"] = true,

                            ["Name Portal"] = "Demon Portal",

                            ["Auto Get Portal"] = false,

                            ["Rarity Portal"] = {

                                ["Rare"] = true,

                                ["Epic"] = true,

                                ["Legendary"] = true,

                                ["Mythical"] = true,

                                ["Secret"] = false,

                            },

                            ["Unit"] = {

                                ["Use All Unit"] = false,

                                ["Custom Unit"] = {

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight",

                                }

                            },

                        }

                        getgenv().Webhook =  {

                            ["Webhook"] = false,

                            ["Url"] = "",

                            ["Roll Unit"] = true,

                            ["Story/Infinite"] = true,

                        }

                        loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-KaitunAD.lua"))()`;
        this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))))
      }
    },

    async saveScript(device_id, script, status = 'farm') {
      const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const config_id = resConfig?.configs[0]?.config_id
      const resScript = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const script_id = resScript?.scripts[0]?.script_id
      const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${device_id}/scripts/${script_id}`, {
        script_data: script
      },{
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      console.log('saveScript',device_id, script,resScript,resSetScript)
    }
  }
};
</script>

<style>
</style>
