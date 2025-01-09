<template>
<main class="page-content">
  <template  v-if="$config.DEVICE_ROLE === 'manager'">
    <div style="display: flex;flex-direction: row; gap: 16px">
      <button type="button" @click="refreshScript()">
        Refresh script
      </button>
      <button style="width: 250px" type="button" @click="handleAutoCollect">Auto gom<span v-if="is_auto_gom" style="color: green">   (ACTIVE : {{secToTime(interval_auto_gom_time_count)}})</span> </button>
      <span v-if="interval_auto_gom_device_name">Device : {{interval_auto_gom_device_name}}</span>
    </div>
    <div style="display: flex;flex-direction: row; gap: 16px;align-items: center;margin: 12px 0">
      From :
      <template v-if="is_auto_gom">
        ({{(autoGomFrom || autoGomFrom === 0) ? roblox_data.devices[autoGomFrom].device_name : 'None'}})
      </template>
      <template v-else>
        <select v-model="autoGomFrom">
          <option value="">None</option>
          <template v-for="(devices,index) in roblox_data_state.devices">
            <option :value="index">{{devices?.device_name}}</option>
          </template>
        </select>
      </template>
      To :
      <template v-if="is_auto_gom">
        ({{(autoGomTo || autoGomTo === 0) ? roblox_data.devices[autoGomTo - 1].device_name : 'None'}})
      </template>
      <template v-else>
        <select v-model="autoGomTo">
          <option value="">None</option>
          <template v-for="(devices,index) in roblox_data_state.devices">
            <option :value="index + 1">{{devices?.device_name}}</option>
          </template>
        </select>
      </template>
      <div style="margin-left: 40px">
        Collect Acc :
      </div>
      <template v-for="acc in map_key_token_gom">
        <div>
          <input v-if="!is_auto_gom" v-model="autoGomActive" type="checkbox" :id="'autoGom-' + acc.key" :value="acc?.key" />
          <label v-if="!(is_auto_gom && !autoGomActive.includes(acc.key))" :for="'autoGom-' + acc.key" style="margin-right: 12px">{{acc?.key}}</label>
        </div>
      </template>
    </div>
    <div style="display: flex;flex-direction: row;gap: 8px">
      Menu
      <nuxt-link to="/setup-key">
        Setup Keys
      </nuxt-link>
      -
      <nuxt-link to="/history">
        History
      </nuxt-link>
      -
      <nuxt-link to="/fill-account">
        Fill account
      </nuxt-link>
      -
      <nuxt-link to="/account">
        Track stat Account bf
      </nuxt-link>
    </div>
  </template>
  <div style="margin-left: auto;font-size: 24px;margin-bottom: 10px" :style="`${$config.DEVICE_ROLE === 'manager' ? '' : 'transform: scale(3);margin-bottom: 32px'}`">
    <button style="cursor: text;margin-right: 123px;width: 140px;opacity: 0" @click="copyHsAccount">123</button>
    <input v-model="sortInactive" id="sortInactive" type="checkbox">
    <label for="sortInactive">Xắp xếp theo trạng thái không hoạt động</label>
  </div>
  <div class="list-remote-pc" v-if="roblox_data?.devices?.length > 0">
    <div v-for="data in roblox_data.devices" class="remote-pc-item" :class="getStatusClass(data)" :key="data.device_code" :style="`${$config.DEVICE_ROLE === 'manager' ? 'padding: 0 24px' : 'font-size: 32px'}`">
      <div>
        {{data.device_name}} {{data?.running ? '' : '(stop)'}}
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
      <template v-if="$config.DEVICE_ROLE === 'manager'">
        <div style="width: 450px">
          <template v-if="map_device_data && map_device_data[data?.device_id]">
            {{map_device_data[data?.device_id]?.script_label}}
          </template>
          <template v-else>Farm</template>
        </div>
        <div v-show="editDevice == data.device_code">
          <select @change="(e) => {setCollectScript(data?.device_id,e?.target?.value)}" v-if="map_key_token_gom?.length > 0">
            <option value="">Không</option>
            <template v-for="data in map_key_token_gom">
              <option :value="data?.key">{{data?.key}}</option>
            </template>
          </select>
          <select @change="(e) => {setFarmScript(data?.device_id,data?.device_name,e?.target?.value)}" v-if="map_key_token_gom?.length > 0">
            <option value="">Select Script Farm</option>
            <template v-for="data in farmOption">
              <option :value="data?.code">{{data?.label}}</option>
            </template>
          </select>
<!--          <button @click="setFarmScript(data?.device_id,data?.device_name,'lava')">Farm Lava</button>-->
<!--          <button @click="setFarmScript(data?.device_id,data?.device_name,'princess')">Farm Công chúa</button>-->
<!--          <button @click="setFarmScript(data?.device_id,data?.device_name,'wave-61')">Farm wave-61</button>-->
<!--          <button @click="setFarmScript(data?.device_id,data?.device_name,'Roll-unit')">Roll-unit</button>-->
        </div>

        <div class="input-device_action" @click="() => {if(editDevice !== data.device_code){editDevice = data.device_code} else {editDevice = ''}}">
          edit
        </div>
      </template>
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
      map_device_data: state => state.map_device_data,
      map_code_detail: state => state.map_code_detail,
      map_code_device_id: state => state.map_code_device_id,
      map_device_id_code: state => state.map_device_id_code,
    }),
  },
  watch:{
    roblox_data_state: {
      handler(value){
        if (this.sortInactive){
          let data = JSON.parse(JSON.stringify(value))
          data.devices.sort((a, b) => b.inactive_accounts - a.inactive_accounts)
          this.roblox_data = data
        } else {
          this.roblox_data = JSON.parse(JSON.stringify(value))
        }
      },deep: true
    }
  },

  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    this.endTaskAutoGom();
    clearInterval(this.intervalId);
    clearInterval(this.interval_auto_gom);
    clearInterval(this.interval_auto_gom_time);
  },
  data () {
    return {
      farmOption : [
        {code : 'lava',label : 'AD-Lava',game_id: '17017769292',private_server : true},
        {code : 'princess',label : 'AD-Princess',game_id: '17017769292',private_server : true},
        {code : 'wave-61',label : 'AD-Wave-61',game_id: '17017769292',private_server : true},
        {code : 'Roll-unit',label : 'AD-Roll-unit',game_id: '17017769292',private_server : true},
        {code : 'Toilet',label : 'Toilet',game_id: '13775256536',private_server : true},
        // {code : 'bloxFruit-maru',label : 'Blox Fruit-Maru',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-25maru',label : 'Blox Fruit-Maruv2',game_id: '2753915549',private_server : false},
        {code : 'bloxFruit-2600',label : 'Blox Fruit-2600',game_id: '2753915549',private_server : false},
        {code : 'bloxFruit-25tab',label : 'Blox Fruit-25tab',game_id: '2753915549',private_server : false},
        {code : 'bloxFruit-fruit',label : 'Blox Fruit-X3',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-magma',label : 'Blox Fruit-MagmaV2',game_id: '2753915549',private_server : false},
        {code : 'Fisch-lv500',label : 'Fisch-lv500',game_id: '16732694052',private_server : false},
        {code : 'Fisch-lv750',label : 'Fisch-lv750',game_id: '16732694052',private_server : false},
        // {code : 'ttd-pvp-lindseychristopher76',label : 'TTD-PvP-lind',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-marylopez355',label : 'TTD-PvP-mary',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-angelacardenas989',label : 'TTD-PvP-angel',game_id: '13775256536',private_server : false},
        // {code : 'ttd-drill-carrie79912',label : 'TTD-Drill-carrie',game_id: '13775256536',private_server : false},
        // {code : 'ttd-drill-wharris187',label : 'TTD-Drill-wharis',game_id: '13775256536',private_server : false},
        // {code : 'ttd-dice-richardbarrett314',label : 'TTD-Dice-richar',game_id: '13775256536',private_server : false},
        // {code : 'ttd-dice-uevans031',label : 'TTD-Dice-uevan',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-carrie79912',label : 'TTD-Noel-carrie',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-CyanSabrinad410',label : 'TTD-PvP-GOM',game_id: '13775256536',private_server : false},
      ],
      autoGomActive: [],
      autoGomFrom: '',
      autoGomTo: '',
      autoGomLastCurrent: 0,
      countClickHs: 0,
      editDevice: '',
      sortInactive: false,
      roblox_data: [],
      is_auto_gom: false,
      intervalId: null,
      interval_auto_gom: null,
      interval_auto_gom_device_name: "",
      interval_auto_gom_time: null,
      interval_auto_gom_time_count: 5400,
      interval_auto_gom_timeInterVal: 5400,
    }
  },
  async mounted() {
    this.getDataRoblox();
    this.initData();
    this.getKeyGom();
    this.getKeyFarm();
    this.initStatusDevice();
    this.map_key_token_gom.forEach(acc => {
      this.autoGomActive.push(acc.key)
    })
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getDataAccount',
      'getKeyGom',
      'getKeyFarm',
      'setStatusDevice',
      'initStatusDevice',
    ]),
    getDataAccountRender (){
      this.getDataAccount()
    },
    async handleAutoCollect() {
      this.is_auto_gom = !this.is_auto_gom
      if (this.is_auto_gom) {
        await this.handleAutoGom();
        this.interval_auto_gom = setInterval(async () => {
          await this.handleAutoGom();
        }, this.interval_auto_gom_timeInterVal * 1000)
        this.interval_auto_gom_time_count = JSON.parse(JSON.stringify(this.interval_auto_gom_timeInterVal))
        this.interval_auto_gom_time = setInterval(() => {
          this.interval_auto_gom_time_count -= 1
        }, 1000)
      } else {
        clearInterval(this.interval_auto_gom);
        clearInterval(this.interval_auto_gom_time);
        this.interval_auto_gom_device_name = ""
        this.endTaskAutoGom()
      }
    },
    async handleAutoGom() {

      // Farm-princess

      // list máy theo gem giảm dần

      await this.getDataAccount();
      setTimeout(() => {
        const map_key_token_gom_lc = JSON.parse(localStorage.getItem('map_key_token_gom')) || [];
        const map_device_data = JSON.parse(localStorage.getItem('map_device_data')) || {};
        let top_device = []
        const map_key_token_gom = []
        map_key_token_gom_lc.forEach(acc => {
          if (this.autoGomActive.includes(acc?.key)){
            map_key_token_gom.push(acc)
          }
        })
        if( this.autoGomFrom || this.autoGomTo){
          console.log('this.roblox_data_state',this.roblox_data_state)
          this.roblox_data_state.devices.slice(this.autoGomFrom || 0, this.autoGomTo || this.roblox_data_state.devices.length + 1).forEach((device) => {
            top_device.push({code: device?.device_name.replace(/ /g, "_")})
          })
          top_device = top_device.slice(this.autoGomLastCurrent, this.autoGomLastCurrent + map_key_token_gom.length)
          this.autoGomLastCurrent = this.autoGomLastCurrent + map_key_token_gom.length
        } else {
          top_device = Object.keys(this.map_code_detail).map(key => {
            return {code: key, value: this.map_code_detail[key]};
          });
          top_device.sort((a, b) => {
            if (!a.value?.Crystal) return 1;
            if (!b.value?.Crystal) return -1;
            return b.value?.Crystal - a.value?.Crystal;
          });
          top_device = top_device.slice(0, map_key_token_gom.length)
        }

        console.log('top_device',top_device)

        this.endTaskAutoGom();
        let current_run = []
        let after_run = {}
        this.interval_auto_gom_device_name = []
        top_device.forEach((device, index) => {
          const script  = map_device_data[this.map_code_device_id[device.code]] ? (map_device_data[this.map_code_device_id[device.code]].script).replace("Farm-", "") : 'lava';
          after_run[device.code] = {device_id:this.map_code_device_id[device.code],script :script}
          this.setCollectScript(this.map_code_device_id[device.code],map_key_token_gom[index].key)
          current_run.push({device_id: this.map_code_device_id[device.code],target_user:map_key_token_gom[index].key})
          this.interval_auto_gom_device_name.push(device.code.replace(/_/g, " "))
        })
        localStorage.setItem('after_run_auto_gom', JSON.stringify(after_run));
        localStorage.setItem('run_auto_gom', JSON.stringify(current_run));
        this.interval_auto_gom_time_count = this.interval_auto_gom_timeInterVal
        this.interval_auto_gom_device_name = this.interval_auto_gom_device_name.join("  ,")
      },15 * 1000)
    },
    endTaskAutoGom(){
      const after_current_run = JSON.parse(localStorage.getItem('after_run_auto_gom')) || {};
      let current_run = JSON.parse(localStorage.getItem('run_auto_gom')) || [];
      // [{device_id:"", target_user: ""}]
      if (current_run?.length > 0) {
        console.log('map_device_id_code',this.map_device_id_code)
        // current_run.forEach()
        current_run.forEach(item => {
          if (after_current_run[this.map_device_id_code[item.device_id]]){
            this.setFarmScript(item.device_id, this.map_device_id_code[item.device_id].replace(/_/g, " "),after_current_run[this.map_device_id_code[item.device_id]].script)
          } else {
            this.setFarmScript(item.device_id, this.map_device_id_code[item.device_id].replace(/_/g, " "))
          }
        })
        // const script  = (map_device_data[this.map_code_device_id[device.code]].script).replace("Farm-", "");
      }
      localStorage.setItem('after_run_auto_gom', JSON.stringify({}));
      localStorage.setItem('run_auto_gom', JSON.stringify([]));
    },
    secToTime(seconds) {
      // Calculate hours, minutes, and seconds from total seconds
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      // Format hours, minutes, and seconds to always show two digits
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = secs.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    },
    initData() {
      this.intervalId = setInterval(() => {
        this.getDataRoblox()
      }, this.$config.INTERVAL_TIME);
    },
    getStatusClass(data = null){
      if (this.map_device_data[data?.device_id]?.script === 'bloxFruit-fruit'){
        if (data?.inactive){
          if (data?.inactive > 10) {
            return 'danger'
          } else if (data?.inactive > 5){
            return 'warning'
          }
        }
        return ''
      }
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
      this.setStatusDevice({device_id: device_id,key: 'script',value: `Trading to - ${user_collect}`})
    },
    handleSelectScript(device_id,device_name,script){
    },
    setFarmScript(device_id,device_name,script_sl = 'lava',option=null){
      console.log('device_id,device_name,script_sl',device_id,device_name,script_sl)
      const token = this.map_key_token_farm.find(data => data.key == device_name)?.token
      const nousigi = this.map_key_token_farm.find(data => data.key == device_name)?.nousigi || "keabc481d8e57b0bc872c89d"
      let script = ''
      let scriptOption = {}
      this.farmOption.forEach(option => {
        if (option?.code === script_sl){
          scriptOption = option
        }
      })
      switch (script_sl) {
        case 'princess' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer

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

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight","Ice Nightshade","Grand Aether Knight","Aether Knight","The Demon Lord"

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

                                ["Mythical"] = false,

                                ["Secret"] = false,

                            },

                            ["Unit"] = {

                                ["Use All Unit"] = false,

                                ["Custom Unit"] = {

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight","Ice Nightshade","Grand Aether Knight","Aether Knight","The Demon Lord"

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
          break;
        case 'wave-61' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer

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

                            ["Wave"] = 61

                        }

                        getgenv().Auto_Equip = {

                            ["Equip Best"] = true,

                            ["Custom Equip"] = {

                                ["Enabled"] = false,

                                ["Units"] = {

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight","Ice Nightshade","Grand Aether Knight","Aether Knight","The Demon Lord"

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

                                ["Mythical"] = false,

                                ["Secret"] = false,

                            },

                            ["Unit"] = {

                                ["Use All Unit"] = false,

                                ["Custom Unit"] = {

                                    "Queen Swordmaster","Princess Swordmaster","Grand Jadefire Knight","Jadefire Knight","Ice Nightshade","Grand Aether Knight","Aether Knight","The Demon Lord"

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
          break;
        case 'Roll-unit' :
          script =
              `
                getgenv().Key = "${nousigi}"
                getgenv().Config = {
                ["AutoSave"] = true,
                ["ItemPrice"] = 1,
                ["JoinerList"] = {
                  [1] = "No joiner in the list"
                },
                ["UnitPrice"] = 1,
                ["FeedLevel"] = 79,
                ["AutoDeleteUnit"] = true,
                ["SpecialSummonUnit"] = {
                  ["Divine Tyrant"] = true
                },
                ["LSLoop"] = 2,
                ["LeaveSellWave"] = 1,
                ["LSImplosion"] = 100000,
                ["LSBomb"] = 1,
                ["AutoSummonSpecial"] = true,
                ["RequiredGem"] = 3000,
                ["JoinerCooldown"] = 0,
                ["ABBHopDelay"] = 0,
                ["LSDelay"] = 0.4,
                ["SelectDeleteRarity"] = {
                  ["Exclusive"] = true,
                  ["Mythic"] = true,
                  ["Rare"] = true,
                  ["Shiny Exclusive"] = true,
                  ["Legendary"] = true,
                  ["Shiny Epic"] = true,
                  ["Epic"] = true,
                  ["Shiny Rare"] = true,
                  ["Shiny Legendary"] = true
                }
              }
              repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`;
          break;
        case 'bloxFruit-maru' :
          script =
              ` repeat task.wait() until game:IsLoaded()
                  repeat task.wait() until game.Players
                  repeat task.wait() until game.Players.LocalPlayer
                  _G.Team = "Pirate" -- Marine / Pirate
                  getgenv().Script_Mode = "Kaitun_Script"
                  _G.WebHook = {
                      ["Enabled"] = true, -- _____________
                      ["Url"] = "https://discord.com/api/webhooks/1320735545881788562/tNecmWZF6JS0kqYLflRO9k-XLYKMIEI_KDhLGv-ZXCwhPvHGggIlNZePPlOE01ntP9vK", -- _____________
                      ["Delay"] = 300 -- ______
                  }
                  _G.MainSettings = {
                          ["EnabledHOP"] = true, -- ____ HOP ( _______________________ )
                          ['FPSBOOST'] = true, -- ______
                          ["FPSLOCKAMOUNT"] = 60, -- _____ FPS
                          ['WhiteScreen'] = false, -- _____
                          ['CloseUI'] = true, -- ___ Ui
                          ["NotifycationExPRemove"] = true, -- __ ExP ________________
                          ['AFKCheck'] = 150, -- _________________________________
                          ["LockFragments"] = 100000, -- ____________
                          ["LockFruitsRaid"] = { -- ______________________
                              [1] = "Dough-Dough",
                              [2] = "Dragon-Dragon"
                          }
                      }
                  _G.Fruits_Settings = { -- _________
                      ['Main_Fruits'] = {'Magma-Magma'}, -- ______ _________________________________________________
                      ['Select_Fruits'] = {"Magma-Magma"} -- _____________________
                  }
                  _G.Quests_Settings = { -- ________________
                      ['Rainbow_Haki'] = false,
                      ["MusketeerHat"] = false,
                      ["PullLever"] = false,
                      ['DoughQuests_Mirror'] = {
                          ['Enabled'] = false,
                          ['UseFruits'] = false
                      }
                  }
                  _G.Races_Settings = { -- ___________
                      ['Race'] = {
                          ['EnabledEvo'] = false,
                          ["v2"] = true,
                          ["v3"] = true,
                          ["Races_Lock"] = {
                              ["Races"] = { -- Select Races U want
                                  ["Mink"] = true,
                                  ["Human"] = true,
                                  ["Fishman"] = true
                              },
                              ["RerollsWhenFragments"] = 20000 -- Random Races When Your Fragments is >= Settings
                          }
                      }
                  }
                  _G.Settings_Melee = { -- ___________
                      ['Superhuman'] = true,
                      ['DeathStep'] = true,
                      ['SharkmanKarate'] = true,
                      ['ElectricClaw'] = true,
                      ['DragonTalon'] = true,
                      ['Godhuman'] = true
                  }
                  _G.FarmMastery_Settings = {
                      ['Melee'] = true,
                      ['Sword'] = false,
                      ['DevilFruits'] = false,
                      ['Select_Swords'] = {
                          ["AutoSettings"] = true, -- ______________________________________________________
                          ["ManualSettings"] = { -- _______ AutoSettings ____ false ___________________________ ________________
                              "Saber",
                              "CursedDualKatana",
                              "Buddy Sword"
                          }
                      }
                  }
                  _G.SwordSettings = { -- __________
                      ['Saber'] = false,
                      ["Pole"] = false,
                      ['MidnightBlade'] = false,
                      ['Shisui'] = false,
                      ['Saddi'] = false,
                      ['Wando'] = false,
                      ['Yama'] = false,
                      ['Rengoku'] = false,
                      ['Canvander'] = false,
                      ['BuddySword'] = false,
                      ['TwinHooks'] = false,
                      ['HallowScryte'] = false,
                      ['TrueTripleKatana'] = false,
                      ['CursedDualKatana'] = false
                  }
                  _G.SharkAnchor_Settings = {
                      ["Enabled_Farm"] = fasle,
                      ['FarmAfterMoney'] = 2500000
                  }
                  _G.GunSettings = { -- __________
                      ['Kabucha'] = false,
                      ['SerpentBow'] = false,
                      ['SoulGuitar'] = false
                  }
                  getgenv().Key = "MARU-TED5P-GFU7-U6FJ-C70HX-C37Z9"
                  getgenv().id = "663236418499379240"
                  getgenv().Script_Mode = "Kaitun_Script"
                  loadstring(game:HttpGet("https://raw.githubusercontent.com/xshiba/MaruBitkub/main/Mobile.lua"))()`;
          break;
        case 'bloxFruit-2600' :
          script = `
          repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().SettingFarm ={
                  ["Hide UI"] = true,
                  ["Fast Attack"] = {
                      ["Speed Attack"] = 0,
                      ["Attack Duration"] = 5,
                      ["Speed Attack if Cooldown"] = 0.25,
                      ["Attack Cooldown"] = 7,
                  },
                  ["Reset Teleport"] = {
                      ["Enabled"] = false,
                      ["Delay Reset"] = 3,
                      ["Item Dont Reset"] = {
                          ["Fruit"] = {
                              ["Enabled"] = true,
                              ["All Fruit"] = true,
                              ["Select Fruit"] = {
                                  ["Enabled"] = false,
                                  ["Fruit"] = {},
                              },
                          },
                      },
                  },
                  ["Lock FPS"] = {
                      ["Enabled"] = false,
                      ["FPS"] = 60,
                  },
                  ["Auto Awaken Fruit"] = false, -- dont support  phoenix
                  ["GodHuman"] = true,
                  ["Priority Get Melee Sea 3"] = false,
                  ["Auto Saber"] = true,
                  ["Auto Pole"] = false,
                  ["Cursed Dual Katana"] = false,
                  ["SoulGuitar"] = false,
                  ["Shark Anchor"] = false, --i have cdk and god and soulguitar
                  ["Farm Mastery Fruit If Lvl Max"] = false,
                  ["Farm Max All Mastery Sword"] = false, --- i need have cdk and godhuman
                  ["Hop Fruit 1M Quest Third Sea"] = false,
                  ["White Screen"] = false,
                  ["Hop if Near Farm Area"] = true,
                  ["Auto Race V2-V3"] = false,
                  ["Auto Pull Lever"] = false,
                  ["Auto Get Mirror Fractal"] = false,
                  ["Lock Fragment"] = {
                      ["Enabled"] = false,
                      ["Fragments"] = 25000
                  },
                  ["Buy Haki Color Legendary"] = false, --- it will buy if u have sgt and godhuman and dont have Valkyrie Helm
                  ["Select Hop"] = { -- 70% will have it
                      ["Hop Find Rip Indra Get Valkyrie Helm"] = false, -- u need have godhuman and max level
                      ["Hop Find Full Moon Soul Guitar"] = false,
                      ["Hop Find Rip Indra Get Tushita"] = false, --- u need have sgt and godhuman
                      ["Hop Find Raids Castle [CDK]"] = false,
                      ["Hop Find Cake Queen [CDK]"] = false,
                      ["Hop Find Soul Reaper [CDK]"] = false,
                      ["Hop Find Darkbeard [SG]"] = false,
                  },
                  ["Race"] = {
                      ["Enabled"] = false,
                      ["Auto Roll Race"] = false,
                      ["Select Race"] =  "", -- Human, Mink, Fishman
                  },
                  ["Buy Haki"] = {
                      ["Enhancement"] = true,
                      ["Skyjump"] = true,
                      ["Flash Step"] = true,
                      ["Observation"] = true,
                  },
                  ["Blox Fruit Sniper"] = {"Light-Light"},
                  ["Lock Fruit"] = {"Kitsune-Kitsune","Leopard-Leopard","Dough-Dough","T-Rex-T-Rex","Buddha-Buddha","Dragon-Dragon","Mammoth-Mammoth","Spirit-Spirit","Control-Control","Venom-Venom","Shadow-Shadow","Gravity-Gravity","Blizzard-Blizzard","Pain-Pain","Rumble-Rumble","Portal-Portal","Phoenix-Phoenix"},
                  ["Webhook"] = {
                      ["Enabled"] = true,
                      ["WebhookUrl"] = "https://discord.com/api/webhooks/1311701624258957332/OsXZAora0_xGXXtbMCBtE1ugioi4blAI_1NI7bWpxeWMt_9pJ5ApuJwv14J-wAjqEuh-",
                  }
              }
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`
          break;
        case 'bloxFruit-25tab' :
          script = `
          repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().SettingFarm ={
                  ["Hide UI"] = true,
                  ["Fast Attack"] = {
                      ["Speed Attack"] = 0,
                      ["Attack Duration"] = 5,
                      ["Speed Attack if Cooldown"] = 0.25,
                      ["Attack Cooldown"] = 7,
                  },
                  ["Reset Teleport"] = {
                      ["Enabled"] = false,
                      ["Delay Reset"] = 3,
                      ["Item Dont Reset"] = {
                          ["Fruit"] = {
                              ["Enabled"] = true,
                              ["All Fruit"] = true,
                              ["Select Fruit"] = {
                                  ["Enabled"] = false,
                                  ["Fruit"] = {},
                              },
                          },
                      },
                  },
                  ["Lock FPS"] = {
                      ["Enabled"] = false,
                      ["FPS"] = 60,
                  },
                  ["Auto Awaken Fruit"] = false, -- dont support  phoenix
                  ["GodHuman"] = true,
                  ["Priority Get Melee Sea 3"] = false,
                  ["Auto Saber"] = true,
                  ["Auto Pole"] = false,
                  ["Cursed Dual Katana"] = false,
                  ["SoulGuitar"] = false,
                  ["Shark Anchor"] = false, --i have cdk and god and soulguitar
                  ["Farm Mastery Fruit If Lvl Max"] = false,
                  ["Farm Max All Mastery Sword"] = false, --- i need have cdk and godhuman
                  ["Hop Fruit 1M Quest Third Sea"] = false,
                  ["White Screen"] = false,
                  ["Hop if Near Farm Area"] = true,
                  ["Auto Race V2-V3"] = false,
                  ["Auto Pull Lever"] = false,
                  ["Auto Get Mirror Fractal"] = false,
                  ["Lock Fragment"] = {
                      ["Enabled"] = false,
                      ["Fragments"] = 25000
                  },
                  ["Buy Haki Color Legendary"] = false, --- it will buy if u have sgt and godhuman and dont have Valkyrie Helm
                  ["Select Hop"] = { -- 70% will have it
                      ["Hop Find Rip Indra Get Valkyrie Helm"] = false, -- u need have godhuman and max level
                      ["Hop Find Full Moon Soul Guitar"] = false,
                      ["Hop Find Rip Indra Get Tushita"] = false, --- u need have sgt and godhuman
                      ["Hop Find Raids Castle [CDK]"] = false,
                      ["Hop Find Cake Queen [CDK]"] = false,
                      ["Hop Find Soul Reaper [CDK]"] = false,
                      ["Hop Find Darkbeard [SG]"] = false,
                  },
                  ["Race"] = {
                      ["Enabled"] = false,
                      ["Auto Roll Race"] = false,
                      ["Select Race"] =  "", -- Human, Mink, Fishman
                  },
                  ["Buy Haki"] = {
                      ["Enhancement"] = true,
                      ["Skyjump"] = true,
                      ["Flash Step"] = true,
                      ["Observation"] = true,
                  },
                  ["Blox Fruit Sniper"] = {"Light-Light"},
                  ["Lock Fruit"] = {"Kitsune-Kitsune","Leopard-Leopard","Dough-Dough","T-Rex-T-Rex","Buddha-Buddha","Dragon-Dragon","Mammoth-Mammoth","Spirit-Spirit","Control-Control","Venom-Venom","Shadow-Shadow","Gravity-Gravity","Blizzard-Blizzard","Pain-Pain","Rumble-Rumble","Portal-Portal","Phoenix-Phoenix"},
                  ["Webhook"] = {
                      ["Enabled"] = true,
                      ["WebhookUrl"] = "https://discord.com/api/webhooks/1311701624258957332/OsXZAora0_xGXXtbMCBtE1ugioi4blAI_1NI7bWpxeWMt_9pJ5ApuJwv14J-wAjqEuh-",
                  }
              }
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`
          break;
        case 'bloxFruit-magma' :
          script = `
          repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().SettingFarm ={
                  ["Hide UI"] = true,
                  ["Fast Attack"] = {
                      ["Speed Attack"] = 0,
                      ["Attack Duration"] = 5,
                      ["Speed Attack if Cooldown"] = 0.25,
                      ["Attack Cooldown"] = 7,
                  },
                  ["Reset Teleport"] = {
                      ["Enabled"] = false,
                      ["Delay Reset"] = 3,
                      ["Item Dont Reset"] = {
                          ["Fruit"] = {
                              ["Enabled"] = true,
                              ["All Fruit"] = true,
                              ["Select Fruit"] = {
                                  ["Enabled"] = false,
                                  ["Fruit"] = {},
                              },
                          },
                      },
                  },
                  ["Lock FPS"] = {
                      ["Enabled"] = false,
                      ["FPS"] = 60,
                  },
                  ["Auto Awaken Fruit"] = false, -- dont support  phoenix
                  ["GodHuman"] = true,
                  ["Priority Get Melee Sea 3"] = false,
                  ["Auto Saber"] = true,
                  ["Auto Pole"] = false,
                  ["Cursed Dual Katana"] = false,
                  ["SoulGuitar"] = false,
                  ["Shark Anchor"] = false, --i have cdk and god and soulguitar
                  ["Farm Mastery Fruit If Lvl Max"] = false,
                  ["Farm Max All Mastery Sword"] = false, --- i need have cdk and godhuman
                  ["Hop Fruit 1M Quest Third Sea"] = false,
                  ["White Screen"] = false,
                  ["Hop if Near Farm Area"] = true,
                  ["Auto Race V2-V3"] = false,
                  ["Auto Pull Lever"] = false,
                  ["Auto Get Mirror Fractal"] = false,
                  ["Lock Fragment"] = {
                      ["Enabled"] = false,
                      ["Fragments"] = 25000
                  },
                  ["Buy Haki Color Legendary"] = false, --- it will buy if u have sgt and godhuman and dont have Valkyrie Helm
                  ["Select Hop"] = { -- 70% will have it
                      ["Hop Find Rip Indra Get Valkyrie Helm"] = false, -- u need have godhuman and max level
                      ["Hop Find Full Moon Soul Guitar"] = false,
                      ["Hop Find Rip Indra Get Tushita"] = false, --- u need have sgt and godhuman
                      ["Hop Find Raids Castle [CDK]"] = false,
                      ["Hop Find Cake Queen [CDK]"] = false,
                      ["Hop Find Soul Reaper [CDK]"] = false,
                      ["Hop Find Darkbeard [SG]"] = false,
                  },
                  ["Race"] = {
                      ["Enabled"] = false,
                      ["Auto Roll Race"] = false,
                      ["Select Race"] =  "", -- Human, Mink, Fishman
                  },
                  ["Buy Haki"] = {
                      ["Enhancement"] = true,
                      ["Skyjump"] = true,
                      ["Flash Step"] = true,
                      ["Observation"] = true,
                  },
                  ["Blox Fruit Sniper"] = {"Magma-Magma"},
                  ["Lock Fruit"] = {"Kitsune-Kitsune","Leopard-Leopard","Dough-Dough","T-Rex-T-Rex","Buddha-Buddha","Dragon-Dragon","Mammoth-Mammoth","Spirit-Spirit","Control-Control","Venom-Venom","Shadow-Shadow","Gravity-Gravity","Blizzard-Blizzard","Pain-Pain","Rumble-Rumble","Portal-Portal","Phoenix-Phoenix"},
                  ["Webhook"] = {
                      ["Enabled"] = true,
                      ["WebhookUrl"] = "https://discord.com/api/webhooks/1311701624258957332/OsXZAora0_xGXXtbMCBtE1ugioi4blAI_1NI7bWpxeWMt_9pJ5ApuJwv14J-wAjqEuh-",
                  }
              }
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`
          break;
        case 'bloxFruit-fruit' :
          script = `
          repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().SettingFarm ={
                  ["Hide UI"] = true,
                  ["Fast Attack"] = {
                      ["Speed Attack"] = 0,
                      ["Attack Duration"] = 5,
                      ["Speed Attack if Cooldown"] = 0.25,
                      ["Attack Cooldown"] = 7,
                  },
                  ["Reset Teleport"] = {
                      ["Enabled"] = false,
                      ["Delay Reset"] = 3,
                      ["Item Dont Reset"] = {
                          ["Fruit"] = {
                              ["Enabled"] = true,
                              ["All Fruit"] = true,
                              ["Select Fruit"] = {
                                  ["Enabled"] = false,
                                  ["Fruit"] = {},
                              },
                          },
                      },
                  },
                  ["Lock FPS"] = {
                      ["Enabled"] = false,
                      ["FPS"] = 60,
                  },
                  ["Auto Awaken Fruit"] = false, -- dont support  phoenix
                  ["GodHuman"] = true,
                  ["Priority Get Melee Sea 3"] = false,
                  ["Auto Saber"] = true,
                  ["Auto Pole"] = false,
                  ["Cursed Dual Katana"] = false,
                  ["SoulGuitar"] = false,
                  ["Shark Anchor"] = false, --i have cdk and god and soulguitar
                  ["Farm Mastery Fruit If Lvl Max"] = false,
                  ["Farm Max All Mastery Sword"] = false, --- i need have cdk and godhuman
                  ["Hop Fruit 1M Quest Third Sea"] = false,
                  ["White Screen"] = false,
                  ["Hop if Near Farm Area"] = true,
                  ["Auto Race V2-V3"] = false,
                  ["Auto Pull Lever"] = false,
                  ["Auto Get Mirror Fractal"] = false,
                  ["Lock Fragment"] = {
                      ["Enabled"] = false,
                      ["Fragments"] = 25000
                  },
                  ["Buy Haki Color Legendary"] = false, --- it will buy if u have sgt and godhuman and dont have Valkyrie Helm
                  ["Select Hop"] = { -- 70% will have it
                      ["Hop Find Rip Indra Get Valkyrie Helm"] = false, -- u need have godhuman and max level
                      ["Hop Find Full Moon Soul Guitar"] = false,
                      ["Hop Find Rip Indra Get Tushita"] = false, --- u need have sgt and godhuman
                      ["Hop Find Raids Castle [CDK]"] = false,
                      ["Hop Find Cake Queen [CDK]"] = false,
                      ["Hop Find Soul Reaper [CDK]"] = false,
                      ["Hop Find Darkbeard [SG]"] = false,
                  },
                  ["Race"] = {
                      ["Enabled"] = false,
                      ["Auto Roll Race"] = false,
                      ["Select Race"] =  "", -- Human, Mink, Fishman
                  },
                  ["Buy Haki"] = {
                      ["Enhancement"] = true,
                      ["Skyjump"] = true,
                      ["Flash Step"] = true,
                      ["Observation"] = true,
                  },
                  ["Blox Fruit Sniper"] = {"Magma-Magma"},
                  ["Lock Fruit"] = {"Kitsune-Kitsune","Leopard-Leopard","Dough-Dough","T-Rex-T-Rex","Buddha-Buddha","Dragon-Dragon","Mammoth-Mammoth","Spirit-Spirit","Control-Control","Venom-Venom","Shadow-Shadow","Gravity-Gravity","Blizzard-Blizzard","Pain-Pain","Rumble-Rumble","Portal-Portal","Phoenix-Phoenix"},
                  ["Webhook"] = {
                      ["Enabled"] = true,
                      ["WebhookUrl"] = "https://discord.com/api/webhooks/1311701624258957332/OsXZAora0_xGXXtbMCBtE1ugioi4blAI_1NI7bWpxeWMt_9pJ5ApuJwv14J-wAjqEuh-",
                  }
              }
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`
          break;
        case 'Fisch-lv500' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
                  getgenv().Key = "${token}"
                  getgenv().SettingFarm = {
                  ["Hide UI"] = false,
                  ["White Screen"] = false,
                  ["Auto Sell"] = {
                      ["Enabled"] = true,
                      ["Maximum Weight"] = 30000,
                      ["Rarity"] = {
                          Legendary = true,
                          Mythical = true,
                          Exotic = false,
                          Divine = true,
                          Relic = false,
                          Fragment = false,
                          Gemstone = false,
                          Limited = false,
                      }
                  },
                  ["Webhook"] = {
                      ["Fish Catched"] = {
                          ["Enable"] = true,
                          ["Minimum Weight"] = 30000,
                          ["Rarity"] = {
                              ["Mythical"] = false,
                              ["Exotic"] = true,
                              ["Divine"] = true,
                              ["Relic"] = true,
                              ["Limited"] = true
                          }
                      },
                      ["URL"] = "https://discord.com/api/webhooks/1315692077580947527/lzCBIZzRNlwa18HxJdT7hf39QU2ciPVg4iBbqA_VcODpIiK5gvRCq4CsL_wp3Zf-OCMQ"
                  },
                  ["Auto Buy Luck"] = true, -- have trident rod
                  ["Get Rod"] = { --- Trident Rod and Rod of the depth it will auto get dont need config
                      ["Rod of The Forgotten Fang"] = true,
                      ["Aurora Rod"] = {
                          ["Enabled"] = true,
                          ["Auto Buy Aurora Totem"] = true --- if have  rod of the depth it will buy
                      },
                      ["Sunken Rod"] = true,

                  },
                      ["Rod of The Forgotten Fang"] = true,
                      ["Set CFrame"] = { -- if have Rod Of the depths then will work
                      ["Enabled"] = true,
                      ["CFrame"] = CFrame.new(5802.84424, 135.301468, 403.946533, 0.991938531, -1.18916499e-09, -0.126719773, -8.93702778e-10, 1, -1.63799463e-08, 0.126719773, 1.63611507e-08, 0.991938531)
                  },
                  ["Auto Equip Rod"] = {
                      ["Rapid Rod"] = 1,
                      ["Aurora Rod"] = 2,
                      ["Trident Rod"] = 3,
                      ["Sunken Rod"] = 4,
                      ["Rod Of The Depths"] = 6,
                      ["No-Life Rod"] = 5,
                      ["Rod Of The Forgotten Fang"] = 7,
                  },
                  ["Auto Buy Luck"] = true, -- have trident rod
                  ["Event"] = {
                      ["Megalodon"] = {  --- have rod of the depth
                          ["Enabled"] = true,
                          ["Prioritize Rod"] = {
                              ["Enabled"] = true,
                              ["Name Rod"] = "No-Life Rod"
                          },
                      }
                  },
                  ["Auto Enchant"] = { -- have rod of the depths
                      ["Enabled"] = true,
                      ["Name Rod"] = "Rod Of The Depths",
                      ["Enchant"] = {"Clever"},
                      ["Auto Buy Relic"] = {
                          ["Enabled"] = true,
                          ["Amount"] = 10
                      }
                  },
                  ["Auto Bait"] = {
                      ["Buy Bait"] = true,
                      ["Amount Buy Bait"] = 10,
                      ["Use Bait Random"] = true
                  },
                  ["Rejoin"] = {
                      ["Enabled"] = true,
                      ["Time"] = 10 ---minute
                  },
                  ["Hop Server"] = {
                      ["Hop Find WhirlPool Get Isonade"] = true,
                      ["Hop Server When Hight Ping"] = {
                      ["Enabled"] = false,
                  ["Ping"] = 100,
              }
          }
      }

      loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/refs/heads/main/BananaCat-KaitunFisch.lua"))()`
          break;
        case 'Fisch-lv750' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
                  getgenv().Key = "${token}"
                  getgenv().SettingFarm = {
                  ["Hide UI"] = false,
                  ["White Screen"] = false,
                  ["Auto Sell"] = {
                      ["Enabled"] = true,
                      ["Maximum Weight"] = 30000,
                      ["Rarity"] = {
                          Legendary = true,
                          Mythical = true,
                          Exotic = false,
                          Divine = true,
                          Relic = false,
                          Fragment = false,
                          Gemstone = false,
                          Limited = false,
                      }
                  },
                  ["Webhook"] = {
                      ["Fish Catched"] = {
                          ["Enable"] = true,
                          ["Minimum Weight"] = 30000,
                          ["Rarity"] = {
                              ["Mythical"] = false,
                              ["Exotic"] = true,
                              ["Divine"] = true,
                              ["Relic"] = true,
                              ["Limited"] = true
                          }
                      },
                      ["URL"] = "https://discord.com/api/webhooks/1315692077580947527/lzCBIZzRNlwa18HxJdT7hf39QU2ciPVg4iBbqA_VcODpIiK5gvRCq4CsL_wp3Zf-OCMQ"
                  },
                  ["Auto Buy Luck"] = true, -- have trident rod
                  ["Get Rod"] = { --- Trident Rod and Rod of the depth it will auto get dont need config
                      ["Rod of The Forgotten Fang"] = true,
                      ["Aurora Rod"] = {
                          ["Enabled"] = true,
                          ["Auto Buy Aurora Totem"] = true --- if have  rod of the depth it will buy
                      },
                      ["Sunken Rod"] = true,

                  },
                      ["Set CFrame"] = { -- if have Rod Of the depths then will work
                      ["Enabled"] = true,
                      ["CFrame"] = CFrame.new(5802.84424, 135.301468, 403.946533, 0.991938531, -1.18916499e-09, -0.126719773, -8.93702778e-10, 1, -1.63799463e-08, 0.126719773, 1.63611507e-08, 0.991938531)
                  },
                  ["Auto Equip Rod"] = {
                      ["Rapid Rod"] = 1,
                      ["Aurora Rod"] = 2,
                      ["Trident Rod"] = 3,
                      ["Sunken Rod"] = 4,
                      ["Rod Of The Depths"] = 5,
                      ["No-Life Rod"] = 6,
                      ["Rod Of The Forgotten Fang"] = 7,
                  },
                  ["Auto Buy Luck"] = true, -- have trident rod
                  ["Event"] = {
                      ["Megalodon"] = {  --- have rod of the depth
                          ["Enabled"] = true,
                          ["Prioritize Rod"] = {
                              ["Enabled"] = true,
                              ["Name Rod"] = "No-Life Rod"
                          },
                      }
                  },
                  ["Auto Enchant"] = { -- have rod of the depths
                      ["Enabled"] = true,
                      ["Name Rod"] = "No-Life Rod",
                      ["Enchant"] = {"Clever"},
                      ["Auto Buy Relic"] = {
                          ["Enabled"] = true,
                          ["Amount"] = 50
                      }
                  },
                  ["Auto Bait"] = {
                      ["Buy Bait"] = true,
                      ["Amount Buy Bait"] = 10,
                      ["Use Bait Random"] = true
                  },
                  ["Rejoin"] = {
                      ["Enabled"] = true,
                      ["Time"] = 10 ---minute
                  },
                  ["Hop Server"] = {
                      ["Hop Find WhirlPool Get Isonade"] = false,
                      ["Hop Server When Hight Ping"] = {
                      ["Enabled"] = false,
                  ["Ping"] = 100,
              }
          }
      }

      loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/refs/heads/main/BananaCat-KaitunFisch.lua"))()`
          break;
      }
      if (script_sl === 'Toilet'){
        this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label})
        this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
        return false
      }
      this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))),scriptOption)
      this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label})
      this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
    },
    refreshScript(){
      const correctPassword = "matkhau123@"; // Mật khẩu cố định
      const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");

      if (userPassword !== correctPassword) {
        alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
        return false
      }
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      Object.entries(map_device_data).forEach((device,index) => {
        if (device[1]?.script){
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
      })
    },
    async saveScript(device_id, script,option = null) {
      const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const config_id = resConfig?.configs[0]?.config_id
      if (option){
        const gameConfig = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs/${config_id}`, {
          use_private_server: option.private_server,
          join_low_players_server: !option.private_server,
          place_id: option.game_id,
        },{
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
      }
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
    },
    copyHsAccount(){
      this.countClickHs += 1
      if (this.countClickHs === 3) {
        this.countClickHs = 0
        const hs_count_account = localStorage.getItem('hs_count_account') || '';
        navigator.clipboard.writeText(hs_count_account);
      } else{
        navigator.clipboard.writeText('');
      }
    }
  }
};
</script>

<style>
</style>
