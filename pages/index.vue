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
    <div style="display: flex;flex-direction: row; gap: 16px">
      <select v-model="showOption">
        <option value="">All</option>
        <option value="astd">ASTD</option>
      </select>
    </div>
    <div style="display: none;flex-direction: row; gap: 16px;align-items: center;margin: 12px 0">
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
        Account
      </nuxt-link>
    </div>
    <div style="display: none;flex-direction: row; gap: 16px;align-items: center;margin: 12px 0">

      <label for="PlayTime">PlayTime(hour)</label>
      <input id="PlayTime" v-model="playTime">
      <label for="StopTime">StopTime(hour)</label>
      <input id="StopTime" v-model="stopTime">
      <template v-if="isRunningPlayStop">
        {{isPlay ? 'Play' : 'Stop'}} ({{secToTime(timeCount)}})
      </template>
      <button @click="handleRunAndStop()">
        Run
      </button>
      <button v-if="isRunningPlayStop" @click="handleCancelRunAndStop">
        Cancel
      </button>
      <button style="margin-left: 50px" @click="handlePlayAll(true)">
        Play All
      </button>
      <button @click="handlePlayAll(false)">
        Stop All
      </button>
      <button @click="showAllDevice = !showAllDevice">
        Show All
      </button>
    </div>

  </template>
  <div style="margin-left: auto;font-size: 24px;margin-bottom: 10px" :style="`${$config.DEVICE_ROLE === 'manager' ? '' : 'transform: scale(3);margin-bottom: 32px'}`">
    <button style="cursor: text;margin-right: 123px;width: 140px;opacity: 0" @click="copyHsAccount">123</button>
    <button @click="StopAll">StopAll</button>
    <button @click="PlayAll">PlayAll</button>
    <input v-model="sortInactive" id="sortInactive" type="checkbox">
    <label for="sortInactive">Xắp xếp theo trạng thái không hoạt động</label>
  </div>
  <div style="margin-left: auto;font-size: 24px;margin-bottom: 10px" :style="`${$config.DEVICE_ROLE === 'manager' ? '' : 'transform: scale(3);margin-bottom: 32px'}`">
    <button style="cursor: text;margin-right: 123px;width: 140px;opacity: 0" @click="copyHsAccount">123</button>
  </div>
  <button @click="showHideDevice = !showHideDevice" style="width: 150px">
    show hide device
  </button>
  <div v-if="showHideDevice" style="width: 500px;display: flex;flex-direction: row;overflow-y: auto;height: 200px;font-size: 12px;flex-wrap: wrap;gap: 12px">
    <div v-for="data in roblox_data.devices" style="border: 1px solid black;padding: 4px">
      <input :id="data.device_name+ 'hide'" type="checkbox" v-model="hideDevice" :value="data.device_name">
      <label :for="data.device_name+ 'hide'">{{data.device_name}}</label>
    </div>
  </div>
  <div class="list-remote-pc" v-if="roblox_data?.devices?.length > 0">
    <div v-for="data in roblox_data.devices" class="remote-pc-item" v-if=" showAllDevice || (hideDevice.includes(data.device_name) && (!showOption || data?.script.includes(showOption)))" :class="getStatusClass(data)" :key="data.device_code" :style="`${$config.DEVICE_ROLE === 'manager' ? 'padding: 0 24px' : 'font-size: 32px'}`">
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
        const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
        this.activeDevice = []
        let data = {}
        if (this.sortInactive){
          data = JSON.parse(JSON.stringify(value))
          data.devices.sort((a, b) => b.inactive_accounts - a.inactive_accounts)
          data.devices.forEach(device => {
            device.script = map_device_data[device?.device_id]?.script || ""
            console.log('device.script',device.script)
            if (device?.running && this.hideDevice.includes(device?.device_name)){
              this.activeDevice.push(device?.device_id)
            }
          })
        } else {
          data = JSON.parse(JSON.stringify(value))
        }
        this.roblox_data = data
      },deep: true
    },
    hideDevice : {
      handler(value) {
        localStorage.setItem('hideDevice', JSON.stringify(value));
      }
    }
  },

  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    this.endTaskAutoGom();
    clearInterval(this.intervalId);
    clearInterval(this.interval_auto_gom);
    clearInterval(this.interval_auto_gom_time);
    this.handleCancelRunAndStop()
  },
  data () {
    return {
      farmOption : [
        // {code : 'lava',label : 'AD-Lava',game_id: '17017769292',private_server : true},
        // {code : 'princess',label : 'AD-Princess',game_id: '17017769292',private_server : true},
        // {code : 'wave-61',label : 'AD-Wave-61',game_id: '17017769292',private_server : true},
        // {code : 'Roll-unit',label : 'AD-Roll-unit',game_id: '17017769292',private_server : true},
        // {code : 'Toilet',label : 'Toilet',game_id: '13775256536',private_server : true},
        // {code : 'bloxFruit-maru',label : 'Blox Fruit-Maru',game_id: '2753915549',private_server : false},
        // // {code : 'bloxFruit-25maru',label : 'Blox Fruit-Maruv2',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-2600',label : 'Blox Fruit-2600',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-25tab',label : 'Blox Fruit-25tab',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-fruit',label : 'Blox Fruit-X3',game_id: '2753915549',private_server : false},
        // // {code : 'bloxFruit-magma',label : 'Blox Fruit-MagmaV2',game_id: '2753915549',private_server : false},
        // {code : 'Fisch-lv500',label : 'Fisch-lv500',game_id: '16732694052',private_server : false},
        // {code : 'Fisch-lv750',label : 'Fisch-lv750',game_id: '16732694052',private_server : false},
        {code : 'astd',label : 'ASTD',game_id: '17687504411',private_server : false, shoukoTrack :true},
        {code : 'sab',label : 'SAB',game_id: '17687504411',private_server : false},
        {code : 'gag-bone',label : 'GAG-Bone Seed',game_id: '126884695634066',private_server : false, yummyTrack : "https://raw.githubusercontent.com/skadidau/unfazedfree/refs/heads/main/gag"},
      ],
      autoGomActive: [],
      activeDevice: [],
      autoGomFrom: '',
      autoGomTo: '',
      showOption: '',
      autoGomLastCurrent: 0,
      countClickHs: 0,
      editDevice: '',
      sortInactive: true,
      roblox_data: [],
      is_auto_gom: false,
      intervalId: null,
      interval_auto_gom: null,
      interval_auto_gom_device_name: "",
      interval_auto_gom_time: null,
      interval_auto_gom_time_count: 5400,
      interval_auto_gom_timeInterVal: 5400,
      stopTime: 2,
      playTime: 2,
      timeCount : 0,
      isPlay: true,
      showHideDevice: false,
      hideDevice: [],
      isRunningPlayStop: false,
      intervalRunAndStop: null,
      showAllDevice: false,
      countAstdKeyMaru : 0
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
      this.hideDevice =  JSON.parse(localStorage.getItem('hideDevice')) || [];
      if (!this.hideDevice || this.hideDevice.length == 0){
        this.hideDevice = []
        localStorage.setItem('hideDevice', JSON.stringify(this.hideDevice));
      }
      console.log('this.hideDevice',this.hideDevice)
      this.intervalId = setInterval(() => {
        this.getDataRoblox()
      }, this.$config.INTERVAL_TIME || 10000);
    },
    getStatusClass(data = null){
      // if (this.map_device_data[data?.device_id]?.script === 'bloxFruit-fruit'){
      //   if (data?.inactive){
      //     if (data?.inactive > 10) {
      //       return 'danger'
      //     } else if (data?.inactive > 5){
      //       return 'warning'
      //     }
      //   }
      //   return ''
      // }
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
    setFarmScript(device_id,device_name,script_sl = 'lava',save_script=false){
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
              ` _G.Team = "Pirate"
                getgenv().Script_Mode = "Kaitun_Script"
                _G.MainSettings = {
                    ["EnabledHOP"] = true,
                    ['FPSBOOST'] = true,
                    ["FPSLOCKAMOUNT"] = 10, -- Tối ưu hơn cho cày lâu dài nhiều tab/VPS
                    ['WhiteScreen'] = true,
                    ['CloseUI'] = false,
                    ["NotifycationExPRemove"] = true,
                    ['AFKCheck'] = 120, -- Đề phòng disconnect
                    ["LockFragments"] = 10000, -- Đủ dùng nếu cày mới
                    ["LockFruitsRaid"] = {
                        [1] = "Dough-Dough",
                        [2] = "Buddha-Buddha",
                        [3] = "Magma-Magma",
                        [4] = "Light-Light"
                    }
                }
                _G.WebHook = {
                    ["Enabled"] = true, -- _____________
                    ["Url"] = "https://discord.com/api/webhooks/1380465562727219250/V_0RG7csWFNArH82JHvdBq7L3cM9QrlNBfZwfPHA-SgIaBUn-EvwXwXfLMNeHNA1OmOt", -- _____________
                    ["Delay"] = 300 -- ______
                }
                _G.SharkAnchor_Settings = {
                    ["Enabled_Farm"] = false,
                    ['FarmAfterMoney'] = 2500000
                }
                _G.Quests_Settings = {
                    ['Rainbow_Haki'] = true,
                    ["MusketeerHat"] = true,
                    ["PullLever"] = true,
                    ['DoughQuests_Mirror'] = {
                        ['Enabled'] = true,
                        ['UseFruits'] = true
                    }
                }
                _G.Races_Settings = {
                    ['Race'] = {
                        ['EnabledEvo'] = true,
                        ["v2"] = false,
                        ["v3"] = false,
                        ["Races_Lock"] = {
                            ["Races"] = {
                                ["Mink"] = true,
                                ["Human"] = true,
                                ["Fishman"] = true
                            },
                            ["RerollsWhenFragments"] = 10000
                        }
                    }
                }
                _G.Fruits_Settings = {
                    ['Main_Fruits'] = {'Dough-Dough', 'Buddha-Buddha', 'Magma-Magma', 'Light-Light'},
                    ['Select_Fruits'] = {"Flame-Flame", "Ice-Ice", "Quake-Quake", "Dark-Dark", "Spider-Spider", "Rumble-Rumble"}
                }
                _G.Settings_Melee = {
                    ['Superhuman'] = true,
                    ['DeathStep'] = true,
                    ['SharkmanKarate'] = true,
                    ['ElectricClaw'] = true,
                    ['DragonTalon'] = true,
                    ['Godhuman'] = true
                }
                _G.SwordSettings = {
                    ['Saber'] = false,
                    ['Shisui'] = false,
                    ['Saddi'] = false,
                    ['Yama'] = false,
                    ['CursedDualKatana'] = true
                }
                _G.GunSettings = {}
                _G.FarmMastery_Settings = {
                    ['Melee'] = true,
                    ['Sword'] = false,
                    ['DevilFruits'] = false,
                    ['Select_Swords'] = {
                        ["AutoSettings"] = false,
                        ["ManualSettings"] = {
                            "CursedDualKatana"
                        }
                    }
                }
                _G.Hop_Settings = {
                    ["Find Tushita"] = false
                }

                  getgenv().Key = "MARU-TED5P-GFU7-U6FJ-C70HX-C37Z9"
                  getgenv().id = "663236418499379240"
                  getgenv().Script_Mode = "Kaitun_Script"
                  loadstring(game:HttpGet("https://raw.githubusercontent.com/xshiba/MaruBitkub/main/Mobile.lua"))()`;
          break;
        case 'bloxFruit-2600' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
              getgenv().Key = "${token}"
              getgenv().SettingFarm ={
                  ["Hide UI"] = false,
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
                  ["White Screen"] = true,
                  ["Lock Fps"] = {
                      ["Enabled"] = true,
                      ["FPS"] = 3,
                  },
                  ["Get Items"] = {
                      ["Godhuman"] =  true,
                      ["Skull Guitar"] = false,
                      ["Mirror Fractal"] = false,
                      ["Cursed Dual Katana"] = false,
                      ["Upgrade Race V2-V3"] = true,
                      ["Auto Pull Lever"] = false,
                  },
                  ["Auto Chat"] = {
                      ["Enabled"] = true,
                      ["Text"] = "Dms discord thangdtx to buy account - Thangcachepp",
                  },
                  ["Auto Summon Rip Indra"] = true, --- auto buy haki and craft haki legendary
                  ["Select Hop"] = { -- 70% will have it
                      ["Hop Find Rip Indra Get Valkyrie Helm or Get Tushita"] = false,
                      ["Hop Find Dough King Get Mirror Fractal"] = false,
                      ["Hop Find Raids Castle [CDK]"] = false,
                      ["Hop Find Cake Queen [CDK]"] = false,
                      ["Hop Find Soul Reaper [CDK]"] = false,
                      ["Hop Find Darkbeard [SG]"] = false,
                      ["Hop Find Mirage [ Pull Lever ]"] = false,
                  },
                  ["Farm Mastery"] = {
                      ["Melee"] = true,
                      ["Sword"] = false,
                      ["Fruit"] = false,
                  },
                  ["Buy Haki"] = {
                      ["Enhancement"] = false,
                      ["Skyjump"] = true,
                      ["Flash Step"] = true,
                      ["Observation"] = true,
                  },
                  ["Sniper Fruit Shop"] = {
                      ["Enabled"] = true, -- Auto Buy Fruit in Shop Mirage and Normal
                      ["Fruit"] = {"Leopard-Leopard","Kitsune-Kitsune","Dragon-Dragon","Yeti-Yeti","Gas-Gas"},
                  },
                  ["Lock Fruit"] = {},
                  ["Webhook"] = {
                      ["Enabled"] = true,
                      ["WebhookUrl"] = "https://discord.com/api/webhooks/1378488491897524255/0hc0LsxYsu6yjBFFIMUOLKPhcwTvVh--oVZ2_3mHac960kgfl3LGrE1yLJ5hxujmTQcW",
                  }
              }
          loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`
          break;
        case 'Fisch-lv500' :
          script = `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
                  getgenv().Key = "${token}"
                  getgenv().SettingFarm = {
                  ["Hide UI"] = false,
                  ["White Screen"] = true,
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
//         case 'astd' :
//             const listKey = ["RGxCJzKwtutSTuMcDxFxoWVkhgggoarB","MYSFscJhfMNcOUlbJehBxhsfmFEUQIan","pYfnEAyemxXpbbfICPodbBixbVFWljAh"]
//           if (this.countAstdKeyMaru > listKey.length -1){
//             this.countAstdKeyMaru = 0
//           }
//           script = `script_key="${listKey[this.countAstdKeyMaru]}";
// loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/2a15f4a97e3a10f1a10dbb55c265b1f0.lua"))()`
//           this.countAstdKeyMaru += 1
//           break;
        case 'astd' :
          script = `
          repeat wait() until game:IsLoaded()
          setfpscap(5)
spawn(function()
    while wait() do
  local old = tick()
repeat wait() until tick() - old >= 3600
game.Players.LocalPlayer:Kick("kick sau 1h")
end
end)
getgenv().Configs = {
    ["Join Map"] = {
        ["Select Map"] = {
            ["Map Name"] = "World1",
            ["Chapter"] = 1,
            ["Difficulty"] = "Hard"
        }
    },
    ["Auto Upgrade"] = {
        ["Focus unit"] = {"Uryu", "Goku"}
    },

    ["Codes"] = {"AFIRSTTIME3001", "FREENIMBUSMOUNT", "somanylikes", "FORTYFIVELIKES", "ONEEIGHTYFIVELIKES",
                 "VERYHIGHLIKEB", "UPD1", "LIKEF5", "THANKYOUFORSUPPORT", "THREEHUNDREDTHOUSANDPLAYERS"},
    ["Black Screen"] = true
}
script_key="PRhCqhbhYdUOwKKDuzliwSiFJGcsYegZ";
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/20875dc958bfd605e0fe3ed9f784caf7.lua"))()`
          break;

//         case 'astd' :
//           script = `getgenv().Configs = {
//     ["Join Map"] = {
//         ["Select Map"] = {
//             ["Map Name"] = "World1",
//             ["Chapter"] = 1,
//             ["Difficulty"] ="Normal"
//         }
//     },
//     ["Auto Upgrade"] = {
//         ["Focus unit"] = {"Uryu", "Goku"}
//     },
//
//     ["Codes"] = {"AFIRSTTIME3001", "FREENIMBUSMOUNT", "somanylikes", "FORTYFIVELIKES", "ONEEIGHTYFIVELIKES",
//                  "VERYHIGHLIKEB", "UPD1", "LIKEF5", "THANKYOUFORSUPPORT", "THREEHUNDREDTHOUSANDPLAYERS"}
// }
// script_key="PRhCqhbhYdUOwKKDuzliwSiFJGcsYegZ";
// loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/20875dc958bfd605e0fe3ed9f784caf7.lua"))()`
//           break;
        case 'gag-bone' :
          script = `
          repeat wait() until game:IsLoaded()
         setfpscap(2)
spawn(function()
    while wait() do
  local old = tick()
repeat wait() until tick() - old >= 7200
game.Players.LocalPlayer:Kick("kick sau 2h")
end
end)
          getgenv().Config = {
    ["Time To Sell"] = 35,
    ["Craft Event"] = {
        ["Crafters Seed Pack"] = true,
        ["Anti Bee Egg"] = true,
        ["Ancient Seed Pack"] = true
    },
    ["Dont Open Pack"] = false,
    ["Dont Use Flower Seed Pack"] = true,
    ["Mode Plant"] = "Auto",

["Seed"] = {
                      ["Carrot"] = 44,
                      ["Strawberry"] = 5,
                      ["Blueberry"] = 5,
                      ["Orange Tulip"] = 5,
                      ["Corn"] = 5,
                      ["Daffodil"] = 5,
                      ["Coconut"] = 5,
                      ["Apple"] = 5,
                      ["Tomato"] = 5,
                      ["Mushroom"] = 5,
                      ["Pepper"] = 5,
                      ["Cacao"] = 5,
                      ["Dragon Fruit"] = 5,
                      ["Mango"] = 10,
                      ["Loquat"] = 10,
                      ["Cactus"] = 10,
                      ["Beanstalk"] = 10,
                      ["Grape"] = 10,
                      ["Bell Pepper"] = 10,
                      ["Bamboo"] = 10,
                      ["Feijoa"] = 10,
                      ["Avocado"] = 10,
                      ["Prickly Pear"] = 10,
                      ["Kiwi"] = 10,
                      ["Foxglove"] = 20,
                      ["Sugar Apple"] = 20,
                      ["Lilac"] = 20,
                      ["Lilac"] = 20,
                      ["Pink Lily"] = 20,
                      ["Rose"] = 20,
                      ["Purple Dahlia"] = 20,
                      ["Paradise Petal"]     = 10,
                      ["Horned Dinoshroom"]  = 10,
                      ["Firefly Fern"]       = 10,
                      ["Amber Spine"]        = 10,
                      ["Burning Bud"]        = 10
    },
    ["Keep Seed"] = {"Dragon Pepper", "Elephant Ears", "Sunflower", "Candy Blossom", "Bone Blossom", "Fossilight"},
    ["Egg"] = {
        ["Mythical Egg"] = {
            ["Buy"] = true,
            ["Place"] = true,
            ["Priority"] = 5
        },
        ["Oasis Egg"] = {
            ["Place"] = true,
            ["Priority"] = 7
        },
        ["Anti Bee Egg"] = {
            ["Place"] = true,
            ["Priority"] = 1
        },
        ["Night Egg"] = {
            ["Place"] = true,
            ["Priority"] = 5
        },
        ["Common Summer Egg"] = {
            ["Place"] = true,
            ["Buy"] = true,
            ["Priority"] = 1
        },
        ["Bug Egg"] = {
            ["Buy"] = true,
            ["Place"] = true,
            ["Priority"] = 3
        },
        ["Paradise Egg"] = {
            ["Buy"] = true,
            ["Place"] = true,
            ["Priority"] = 2
        },
        ["Bee Egg"] = {
            ["Buy"] = true,
            ["Place"] = false,
            ["Priority"] = 4
        },
        ["Dinosaur Egg"] = {
            ["Place"] = false,
            ["Priority"] = 6
        }
    },

    ["Sprinkler"] = {
        ["Place Sprinkler"] = true,
        ["Buy Sprinkler"] = true,
        ["Basic Sprinkler"] = true,
        ["Advanced Sprinkler"] = true,
        ["Master Sprinkler"] = true,
        ["Godly Sprinkler"] = true
    },
    ["Plant Candy"] = false,
    ["PetNeedSend"] = {"Queen Bee", "Dragonfly", "Raccoon", "Disco Bee", "Butterfly", "Mimic Octopus", "Fennec Fox", "T-Rex", "Spinosaurus"},
    ["Destroy Mode"] = {
        ["Auto Destroy when have money"] = 100000000, -- its will destroy all trees select when money >= select
        ["Mode Destroy"] = "Auto",
        ["Trees"] = {"Orange Tulip", "Corn", "Tomato", "Banana", "Cactus"},
        ["Rarity Destroy Auto"] = {"Common", "Uncommon"},
        ["Destroy Untill"] = 150
    },
    ["Dino Quest Farm"] = true,
    ["Url"] = "https://discord.com/api/webhooks/1394750086432559226/UnnnaVhaNGV87ztf9tMFGu3WskhulaOEt7sK-JHvS9bidUX2mDNvw9XeMKkGoSkx4m7m",
    ["Boost FPS"] = true,
    ["Black Screen"] = false,
    ["Dino Event"] = {
        ["Auto Claim Quest"] = true,
        ["Auto Restart Quest"] = true,
        ["Auto Submit"] = true,
        ["Auto Trade Eggs"] = true,
        ["Pet Dont Trade"] = {"Starfish","Dragonfly", "Raccoon", "Disco Bee", "Butterfly", "Mimic Octopus",
                              "Fennec Fox", "Axolotl", "Hyacinth Macaw",
                              "Golden Lab", "T-Rex", "Spinosaurus"}
    },
    ["Note"] = "Cyndral Hub",
    ["Pet Mode"] = {
        ["Sell Pet"] = true,
        ["Equip Pet"] = true,
        ["Name Pet Equip"] = {
            ["Night Owl"] = false,
            ["Starfish"] = true,
            ["Chicken"] = false
        },
        ["Max Slot Pet To Sell"] = 2, -- If Total Pet In Inventory >= ["Max Slot Pet To Sell"] script will sell pet
        ["Upgrade Slot Egg"] = {
            ["Enable"] = true,
            ["Black List Pet For Upgrade Slots"] = {"Queen Bee", "Red Fox", "Dragonfly", "Raccoon", "Disco Bee",
                                                    "Butterfly", "Mimic Octopus", "Meerkat", "Sand Snake", "Fennec Fox",
                                                    "Axolotl", "Hyacinth Macaw", "Hamster", "T-Rex", "Spinosaurus"}
        },
        ["Pet Dont Delete"] = {"Starfish","Ostrich", "Peacock", "Capybara", "Scarlet Macaw", "Mimic Octopus", "Meerkat", "Sand Snake", "Triceratops", "Stegosaurus", "Pterodactyl", "Raptor",
         "Brontosaurus", "Pachycephalosaurus", "Iguanodon", "Brown Mouse", "Grey Mouse", "Caterpillar", "Giant Ant", "Praying Mantis", "Red Fox",
          "Snail", "Squirrel", "Hyacinth Macaw", "Axolotl", "Ankylosaurus", "Dilophosaurus","Red Fox", "Dragonfly","Raccoon", "Queen Bee", "Disco Bee", "Butterfly", "Dragonfly", "Fennec Fox", "T-Rex", "Spinosaurus"},
        ["Dont Sell Pet If Weight > x"] = 20 -- Script dont sell pet if this weight >= 10
    },
    ["Webhook Mode"] = {
        ["Enable Send Pet Weight"] = true,
        ["Weight"] = 20
    },
    ["Rejoin Mode"] = {
        ["Auto Rejoin When Error Module Egg"] = true,
        ["Auto rejoin on script update"] = true,
        ["Enable Rejoin After X Time"] = true,
        ["Rejoin After X Time"] = 60 -- Minutes
    },
    ["Limit Tree"] = 200,
    ["White Screen"] = true
}
script_key="grPApANcmFyFWdDFPtCZDubYlEJxGQQb";
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/153a62fe6e6f165f8aa4643955297d65.lua"))()`
      }
      if (script_sl === 'Toilet'){
        this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label})
        if (!save_script){
          this.setStatusDevice({device_id: device_id,key: 'script',value: ''})
        }
        return false
      }
      this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))),scriptOption)
      this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label})
      if (!save_script){
        this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
      }
    },
    async StopAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        if (this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))) {
          const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device[0]}/stop`, {},{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
    },
    async PlayAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        console.log("device[0]",device[0],!this.activeDevice.includes(device[0]))
        if (this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))) {
          const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device[0]}/start`, {},{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
    },
    refreshScript(){
      const correctPassword = "matkhau123@"; // Mật khẩu cố định
      const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");

      if (userPassword !== correctPassword) {
        alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
        return false
      }
      // const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      // Object.entries(map_device_data).forEach((device,index) => {
      //   if (device[1]?.script){
      //     this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
      //   }
      // })
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const list_data = Object.entries(map_device_data)
      let index = 0
      const interval = setInterval(() => {
        const device = list_data[index]
        if (device[1]?.script && this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))){
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
        index+=1
        if (index > list_data.length - 1){
          clearInterval(interval)
          alert('refreshScript done');
        }
      },300)
    },
    async getData(device_id = null, key = null) {
      if (key && device_id) {
        let map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
        const device = map_device_data[device_id]
        if (device[key]) {
          return device[key]
        } else {
          if (key === "config_id") {
            const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs`, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
            const config_id = resConfig?.configs[0]?.config_id
            map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
            map_device_data[device_id].config_id = config_id
            localStorage.setItem('map_device_data', JSON.stringify(map_device_data));
            return config_id
          } else if (key.includes("script_id")){
            const config_id = await this.getData(device_id, "config_id");
            const resScript = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
            map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
            for (let i = 0; i < resScript?.scripts.length; i++) {
              map_device_data[device_id]["script_id" + (i === 0 ? '' : i)  ] = resScript?.scripts[i]?.script_id
            }
            // const script_id = resScript?.scripts[0]?.script_id
            // map_device_data[device_id].script_id = script_id
            localStorage.setItem('map_device_data', JSON.stringify(map_device_data));
            return map_device_data[device_id][key] || ""
          }
        }
      }
    },
    async saveScript(device_id, script,option = null) {
      // const resConfig = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs`, {
      //   headers: {
      //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
      //   },
      // });
      // const config_id =  resConfig?.configs[0]?.config_id
      const config_id = await this.getData(device_id, "config_id")
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
        if (option?.shoukoTrack) {
          const scriptTrack =
              btoa(unescape(encodeURIComponent(`repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
          getgenv().Setting = getgenv().Setting or {
            ['Discord ID'] = '663236418499379240',
                ['Device Name'] = '${this.map_device_id_code[device_id]}'
          }
          loadstring(game:HttpGet('https://cdn.shouko.dev/RokidManager/neyoshiiuem/main/trackstat.lua'))()`)))
          const script_id = await this.getData(device_id, "script_id2");
          if(!script_id){
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            },{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            },{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        }
        if (option?.yummyTrack) {
          const scriptTrack = btoa(unescape(encodeURIComponent(`_G.Config = { UserID = "08432d86-5203-427d-bab2-298b2ab63da7", discord_id = "663236418499379240" , Note = "${this.map_device_id_code[device_id]}", } loadstring(game:HttpGet("${option.yummyTrack}"))()`)))
          const script_id = await this.getData(device_id, (option.code === "bloxFruit-maru" ? "script_id2" : "script_id1"));
          if(!script_id){
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            },{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            },{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
          // map_device_id_code[item.device_id] = item.device_code
        }
      }
      // const resScript = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
      //   headers: {
      //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
      //   },
      // });
      const script_id = await this.getData(device_id, "script_id")
      // const script_id = resScript?.scripts[0]?.script_id
      const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${device_id}/scripts/${script_id}`, {
        script_data: script
      },{
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      return resSetScript
    },
    handleCancelRunAndStop(){
      clearInterval(this.intervalRunAndStop);
      this.isRunningPlayStop = false
    },
    handleRunAndStop(){
      this.isPlay = false
      this.isRunningPlayStop = true
      this.intervalRunAndStop = setInterval(() => {
        console.log('timeCount',this.timeCount)
        this.timeCount -= 1
        if (this.timeCount <= 0 ){
          this.isPlay = !this.isPlay
          this.timeCount = (this.isPlay ? this.playTime : this.stopTime) * 60 * 60
          this.handlePlayAll(this.isPlay);
        }
      }, 1000);
    },
    async handlePlayAll(start = false) {
      for (let i = 0; i < this.roblox_data_state.devices.length; i++) {
        const device = this.roblox_data_state.devices[i]
        console.log('device?.device_id',device?.device_id)
        const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/${start ? 'start' : 'stop'}`, {},{
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
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
