<template>
<main class="page-content">
  <template  v-if="$config.DEVICE_ROLE === 'manager'">
    <div style="display: flex;flex-direction: row; gap: 16px">
      <button type="button" @click="refreshScript()" :disabled="refreshScriptStat">
        Refresh script
      </button>
      <button type="button" @click="refreshScript('av-next')" :disabled="refreshScriptStat">
        AV auto next
      </button>
      <button type="button" @click="refreshScript('av-inf')" :disabled="refreshScriptStat">
        AV auto inf
      </button>
      <button style="width: 250px" type="button" @click="handleAutoCollect">Auto gom<span v-if="is_auto_gom" style="color: green">   (ACTIVE : {{secToTime(interval_auto_gom_time_count)}})</span> </button>
      <span v-if="interval_auto_gom_device_name">Device : {{interval_auto_gom_device_name}}</span>
    </div>
    <div style="display: flex;flex-direction: row; gap: 16px">
      <select v-model="showOption">
        <option value="">All</option>
        <option value="astd">ASTD</option>
        <option value="gag-bone">GAG</option>
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
        // {code : 'bloxFruit-maru',label : 'Blox Fruit-Maru',game_id: '2753915549',private_server : false, yummyTrack : "https://raw.githubusercontent.com/skadidau/yummytrack/main/tracker"},
        // // {code : 'bloxFruit-25maru',label : 'Blox Fruit-Maruv2',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-2600',label : 'Blox Fruit-2600',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-25tab',label : 'Blox Fruit-25tab',game_id: '2753915549',private_server : false},
        // {code : 'bloxFruit-fruit',label : 'Blox Fruit-X3',game_id: '2753915549',private_server : false},
        // // {code : 'bloxFruit-magma',label : 'Blox Fruit-MagmaV2',game_id: '2753915549',private_server : false},
        // {code : 'Fisch-lv500',label : 'Fisch-lv500',game_id: '16732694052',private_server : false},
        // {code : 'Fisch-lv750',label : 'Fisch-lv750',game_id: '16732694052',private_server : false},
        // {code : 'astd',label : 'ASTD',game_id: '17687504411',private_server : false, shoukoTrack :true},
        // {code : '99night',label : '99 Night',game_id: '79546208627805',private_server : false, shoukoTrack :true},
        // {code : 'sab',label : 'SAB',game_id: '17687504411',private_server : false},
        {code : 'av',label : 'AV',game_id: '16146832113',private_server : false},
        {code : 'av-gem-50',label : 'av-gem-50',game_id: '16146832113',private_server : false,gem50ktrack : true},
        {code : 'av-gem-100',label : 'av-gem-100',game_id: '16146832113',private_server : false,gem100ktrack : true},
        {code : 'av-iscanur',label : 'AV-Iscanor',game_id: '16146832113',private_server : false},
        {code : 'av-maru-iscanur',label : 'AV-Maru-Iscanor',game_id: '16146832113',private_server : false,iscanurTrack : true},
        {code : 'pvb',label : 'PVB',game_id: '127742093697776',private_server : false,yummyTrack : true,join_low_players_server: false},
        {code : 'fishit',label : 'FISH IT',game_id: '121864768012064',private_server : false,yummyTrack : true},
        // {code : 'gag-bone',label : 'GAG-Bone Seed',game_id: '126884695634066',private_server : false, yummyTrack : "https://raw.githubusercontent.com/skadidau/unfazedfree/refs/heads/main/gag"},
        // {code : 'gag-bone',label : 'GAG-Bone Seed',game_id: '126884695634066',private_server : false, shoukoTrack :true},
      ],
      pvbkey: ["goMYIFMGIzHClAbkxSFgewTfJpBhuuBP","kgYFfshnJPpoGHMaavALnooADARRfMfw"],
      pvbKeyCountDevice: 0,
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
      countAstdKeyMaru : 0,
      switchayaya : true,
      avConfig : 'av-next',
      refreshScriptStat : false,
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
      console.log("setFarmScript")
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
      // if (script_sl === "gag-bone"){
      //   this.switchayaya = !this.switchayaya
      // }
      // if (this.switchayaya && script_sl === "gag-bone") {
      //   script_sl = "gag-bone-ayaya"
      // }
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
              `
          setfpscap(8)
              _G.Team = "Pirate"
                getgenv().Script_Mode = "Kaitun_Script"
                _G.MainSettings = {
                    ["EnabledHOP"] = true,
                    ['FPSBOOST'] = true,
                    ["FPSLOCKAMOUNT"] = 8,
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
                    ["Url"] = "https://discord.com/api/webhooks/1407436946791338148/MTyqt3CunZMK0I3BUL192mRi1_hnGiqoG0_P1Tll5GMMKArYuqTMrNIKg0vg7MFXJH0j", -- _____________
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
repeat wait() until tick() - old >= 7200
game.Players.LocalPlayer:Kick("kick sau 2h")
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
    ["Codes"] = {"AFIRSTTIME3001", "FREENIMBUSMOUNT",
                   "UPD2", "NEXTLIKEGOAL500K", "THANKYOUFORLIKES123", "2MGROUPMEMBERS", "THANKYOUFOR500MVISITS","SORRY4DELAYZ","NEWMODENEXTUPDATE","THANKYOUFOR500KLIKES","UPDNEXTWEEKEND"},
    ["Black Screen"] = true,
    ["Webhook"] = {
        ["Enabled"] = true,
        ["Url"] = "https://discord.com/api/webhooks/1395570996143980645/Nj9H1NIhFYScGXU-kuJVI8bXcVpZuF--Jhl-9xfmVmRlxEP3HPeo8rMK4QYFiK-AgQ5_",
        ["Note"] = "Cyndral",
    },
    ["Change Account"] = {
        ["Enabled"] = true,
        ["Gem Change"] = 15000,
    }
}
script_key="grPApANcmFyFWdDFPtCZDubYlEJxGQQb";
loadstring(game:HttpGet("https://cdn.shouko.dev/RokidManager/neyoshiiuem/main/astdx.lua"))()`
          break;
        case '99night' :
          script = `
    spawn(function()
        while wait() do
          local old = tick()
          repeat wait() until tick() - old >= 3600
          game.Players.LocalPlayer:Kick("kick sau 2h")
        end
    end)
    repeat
    getgenv().Diamondchange = 1000
    setfpscap(15)
    local success, err = pcall(function()
        loadstring(game:HttpGet("https://cdn.shouko.dev/RokidManager/neyoshiiuem/main/evRCn4hRbk3G.lua"))()
    end)
    task.wait(20)
    until success`
          break;
        case 'av-maru-iscanur' :
          script = `if not game:IsLoaded() then repeat game.Loaded:Wait() until game:IsLoaded() end
wait(3)
setfpscap(5)
task.spawn(function()
  repeat task.wait(60) until game:GetService("Players").LocalPlayer:GetAttribute("NextDrop") ~= nil
  game:GetService("Players").LocalPlayer:Kick("kick AFK")
end)
_G.VanguardSettings = {
    ['ClaimDaily'] = true,
    ['ClaimQuests'] = true,
    ['ClaimAchievement'] = true,
    ['ClaimBattlepass'] = true,
    ['ClaimMileStones'] = false,
    ['RedeemCodes'] = false,
    ['JoinGames'] = true,
    ['Summon'] = {
        ['LockUnits'] = false,
        ['Name'] = {''}
    },
    ['Webhooks'] = {
        ['Enabled'] = true,
        ['Url'] = 'https://discord.com/api/webhooks/1420090969281400853/oFc6qLyemDsB-G99JI0uRtwdgYUGEPZ4rORTbgI6aPa7YM-qxzd2cjXpRkXbccLoSmWj'
    },
    ["TeaFarm"] = {
        ["Enabled"] = true,
        ["FarmAtLevel"] = 11,
        ["RandomUnits"] = {
            ["SellUnitsNotLock"] = true,
            ["RandomWhenHaveTea"] = 100000,
            ["Lock"] = {
                "Iscanur (Pride)"
            }
        }
    }
}
script_key="IPwlXseAKTSLLvTgiQkABOtrNlCqOEAH";
if not game:IsLoaded() then repeat game.Loaded:Wait() until game:IsLoaded() end
wait(3)
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/6756a57cd51293c409a1f7627cba5572.lua"))()
`
          break;
        case 'av-iscanur' :
          script =`
        getgenv().Key = "${nousigi}"
        getgenv().Config = {
 ["Stage Joiner"] = {
  ["Nightmare Mode"] = false,
  ["Auto Join"] = false,
  ["Join Highest"] = false,
  ["Join Lowest Clear"] = false
 },
 ["Macros"] = {
  ["Macro Retry Limit"] = 0,
  ["Ignore Macro Timing"] = true,
  ["No Ignore Sell Timing"] = true,
  ["Auto Equip"] = false,
  ["Play"] = false
 },
 ["Summer Event"] = {
  ["Summer Event Joiner"] = {
   ["Auto Join"] = true
  }
 },
 ["Webhook"] = {
  ["Unit Summoned"] = true,
  ["Trait Rerolled"] = false,
  ["Match Restarted"] = false,
  ["Stage Finished"] = true,
  ["Stat Potential Rerolled"] = false,
  ["Unit Stat Potential"] = false,
  ["URL"] = "https://discord.com/api/webhooks/1418579871432577165/4pS6oSdShV0KjP67oLNauqT2uz6pVNDzFjW2QiZt116iv8ldPoz2kriUCWxIv2Fexdfz"
 },
 ["Claimer"] = {
  ["Auto Claim Milestone"] = true,
  ["Auto Claim Quest"] = true,
  ["Auto Claim Collection Milestone"] = true,
  ["Auto Claim Daily Reward"] = true,
  ["Auto Claim Achievement"] = true,
  ["Auto Claim Collection"] = true,
  ["Auto Claim Enemy Index"] = true,
  ["Auto Claim Battle Pass"] = true
 },
 ["Gameplay"] = {
  ["Double Dungeon"] = {
   ["Auto Statue"] = false,
   ["Leave Extra Money"] = 5000,
   ["Upgrade Amount"] = 0
  },
  ["Saber Event"] = {
   ["Servant"] = "Berserker",
   ["Auto Select Servant"] = false
  },
  ["Steel Ball Run"] = {
   ["Collect Steel Ball"] = false
  },
  ["Random Sacrifice Domain"] = {
   ["Sell Units on Event"] = false
  },
  ["Edge of Heaven"] = {
   ["Auto Join Lfelt Portal"] = false,
   ["Pause instead of Joining"] = false
  },
  ["Auto Skip Wave"] = {
   ["Enable"] = true,
   ["Stop Skip Stage Type"] = {
    ["Odyssey"] = true,
    ["Challenge"] = true,
    ["Portal"] = true,
    ["Worldline"] = true,
    ["Legend Stage"] = true,
    ["BossEvent"] = true,
    ["Dungeon"] = true,
    ["Infinite"] = true,
    ["Rift"] = true,
    ["Raid"] = true,
    ["Story"] = true
   },
   ["Stop at Wave"] = 0
  },
  ["Auto Use Ability"] = false,
  ["Frozen Volcano"] = {
   ["Sell Placed Friezo Unit"] = false,
   ["Auto Friezo"] = false,
   ["Leave Extra Money"] = 5000,
   ["Auto Save Brolzi"] = false,
   ["Upgrade Amount"] = 0
  },
  ["Auto Sell"] = {
   ["Auto Sell Farm"] = {
    ["Enable"] = true,
    ["Wave"] = 9,
    ["Stage Type"] = {
     ["Odyssey"] = true,
     ["Challenge"] = true,
     ["Portal"] = true,
     ["Worldline"] = true,
     ["Legend Stage"] = true,
     ["BossEvent"] = true,
     ["Dungeon"] = true,
     ["Infinite"] = true,
     ["Rift"] = true,
     ["Raid"] = true,
     ["Story"] = false
    }
   },
   ["Auto Sell Unit"] = {
    ["Enable"] = true,
    ["Wave"] = 9,
    ["Stage Type"] = {
     ["Odyssey"] = true,
     ["Challenge"] = true,
     ["Portal"] = true,
     ["Worldline"] = true,
     ["Legend Stage"] = true,
     ["BossEvent"] = true,
     ["Dungeon"] = true,
     ["Infinite"] = true,
     ["Rift"] = true,
     ["Raid"] = true,
     ["Story"] = false
    }
   }
  },
  ["Ruined City"] = {
   ["Use Mount to Travel"] = true,
   ["Active Tower"] = false,
   ["Unhandcuff"] = false
  },
  ["The System"] = {
   ["Auto Shadow"] = {
    ["Enable"] = false,
    ["Order"] = {
     ["Steel"] = 2,
     ["Belu"] = 4,
     ["Healer"] = 3,
     ["Bear"] = 1
    }
   }
  },
  ["Burn Units"] = {
   ["Enable"] = false,
   ["Slots"] = {
    ["1"] = false,
    ["3"] = false,
    ["2"] = false,
    ["5"] = false,
    ["4"] = false,
    ["6"] = false
   },
   ["Stage Type"] = {
    ["Odyssey"] = true,
    ["Challenge"] = true,
    ["Portal"] = true,
    ["Worldline"] = true,
    ["Legend Stage"] = true,
    ["BossEvent"] = true,
    ["Dungeon"] = true,
    ["Infinite"] = true,
    ["Rift"] = true,
    ["Raid"] = true,
    ["Story"] = true
   }
  },
  ["Auto Vote Start"] = true,
  ["Auto Restart"] = {
   ["Enable"] = false,
   ["Wave"] = 10,
   ["Stage Type"] = {
    ["Odyssey"] = true,
    ["Challenge"] = true,
    ["Portal"] = true,
    ["Worldline"] = true,
    ["Legend Stage"] = true,
    ["BossEvent"] = true,
    ["Dungeon"] = true,
    ["Infinite"] = true,
    ["Rift"] = true,
    ["Raid"] = true,
    ["Story"] = true
   }
  }
 },
 ["Misc"] = {
  ["Auto Open Gift Boxes"] = true,
  ["Right Click Move"] = false,
  ["Max Camera Zoom"] = 40,
  ["Auto Delete Portal"] = {
   ["Enable"] = false,
   ["Summer Portal"] = 500,
   ["Spring Portal"] = 500
  },
  ["Redeem Code"] = true,
  ["Right Click Teleport"] = false
 },
 ["Summoner"] = {
  ["Teleport Lobby new Banner"] = false,
  ["Unselect if Summoned"] = true,
  ["Auto Summon Special"] = false,
  ["Normalize Rarity"] = {
   ["Legendary"] = false,
   ["Mythic"] = false,
   ["Exclusive"] = false,
   ["Epic"] = false,
   ["Rare"] = false
  },
  ["Auto Summon Summer"] = true,
  ["Auto Summon Spring"] = false,
  ["Delete Rarity"] = {
   ["Legendary"] = true,
   ["Mythic"] = true,
   ["Exclusive"] = false,
   ["Epic"] = true,
   ["Rare"] = true
  }
 },
 ["Unit Deleter"] = {
  ["Enable"] = false,
  ["Rarity"] = {
   ["Epic"] = false,
   ["Legendary"] = false,
   ["Rare"] = false
  }
 },
 ["Auto Play"] = {
  ["Auto Upgrade"] = {
   ["Upgrade Order"] = {
    ["1"] = 1,
    ["3"] = 3,
    ["2"] = 2,
    ["5"] = 5,
    ["4"] = 4,
    ["6"] = 6
   },
   ["Place and Upgrade"] = true,
   ["Enable"] = true,
   ["Focus on Farm"] = false,
   ["Upgrade Method"] = "Hotbar left to right (until Max)",
   ["Upgrade Limit"] = {
    ["1"] = 0,
    ["3"] = 0,
    ["2"] = 0,
    ["5"] = 0,
    ["4"] = 0,
    ["6"] = 0
   }
  },
  ["Place Limit"] = {
   ["1"] = 0,
   ["3"] = 0,
   ["2"] = 0,
   ["5"] = 0,
   ["4"] = 0,
   ["6"] = 0
  },
  ["Enable"] = true,
  ["Place Order"] = {
   ["1"] = 1,
   ["3"] = 3,
   ["2"] = 2,
   ["5"] = 5,
   ["4"] = 4,
   ["6"] = 6
  },
  ["Place Wave"] = {
   ["1"] = 0,
   ["3"] = 0,
   ["2"] = 0,
   ["5"] = 0,
   ["4"] = 0,
   ["6"] = 0
  }
 },
     ["Match Finished"] = {
         ["Auto Return Lobby"] = false,
         ["Auto Next"] = false,
         ["Replay Amount"] = 20,
         ["Return Lobby Failsafe"] = true,
         ["Auto Replay"] = true
     },
 ["Modifier"] = {
  ["Restart Modifier"] = {
   ["Enable"] = false,
   ["Stage Type"] = {
    ["Odyssey"] = true,
    ["Challenge"] = true,
    ["Portal"] = true,
    ["Worldline"] = true,
    ["Legend Stage"] = true,
    ["BossEvent"] = true,
    ["Dungeon"] = true,
    ["Infinite"] = true,
    ["Rift"] = true,
    ["Raid"] = true,
    ["Story"] = true
   },
   ["Modifier"] = {
    ["Tyrant Destroyer"] = false,
    ["Sphere Finder"] = false,
    ["King's Burden"] = false,
    ["No Trait No Problem"] = false,
    ["Immunity"] = false,
    ["Warding off Evil"] = false,
    ["Exterminator"] = false,
    ["Quake"] = false,
    ["Drowsy"] = false,
    ["Tyrant Arrives"] = false,
    ["High Class"] = false,
    ["Dodge"] = false,
    ["Lifeline"] = false,
    ["Fisticuffs"] = false,
    ["Champions"] = false,
    ["Money Surge"] = false
   }
  },
  ["Auto Modifier"] = {
   ["Prioritize"] = {
    ["Tyrant Destroyer"] = 30,
    ["Champions"] = 12,
    ["Planning Ahead"] = 15,
    ["Unit Draw"] = 35,
    ["High Class"] = 32,
    ["Immunity"] = 11,
    ["Damage"] = 20,
    ["Lifeline"] = 29,
    ["Evolution"] = 36,
    ["Regen"] = 7,
    ["Press It"] = 14,
    ["Nighttime"] = 34,
    ["Shielded"] = 5,
    ["Cooldown"] = 19,
    ["Money Surge"] = 26,
    ["Strong"] = 3,
    ["Thrice"] = 4,
    ["Warding off Evil"] = 24,
    ["Quake"] = 9,
    ["Fast"] = 1,
    ["Dodge"] = 10,
    ["Fisticuffs"] = 25,
    ["Precise Attack"] = 13,
    ["Uncommon Loot"] = 22,
    ["No Trait No Problem"] = 23,
    ["Exploding"] = 2,
    ["Tyrant Arrives"] = 33,
    ["King's Burden"] = 27,
    ["Range"] = 18,
    ["Common Loot"] = 21,
    ["Revitalize"] = 6,
    ["Exterminator"] = 28,
    ["Drowsy"] = 8,
    ["Wild Card"] = 37,
    ["Harvest"] = 17,
    ["Slayer"] = 16,
    ["Sphere Finder"] = 31
   },
   ["Enable"] = true,
   ["Amount"] = {
    ["Unit Draw"] = 9,
    ["Evolution"] = 6,
    ["Nighttime"] = 8,
    ["Wild Card"] = 7
   }
  }
 },
 ["Secure"] = {
  ["Walk Around"] = true,
  ["Random Offset"] = true
 },
 ["Performance"] = {
  ["Delete Map"] = true,
  ["Boost FPS"] = true,
  ["Black Screen"] = true,
  ["Delete Entities"] = true
 },
 ["Performance Failsafe"] = {
  ["Teleport Lobby FPS below"] = {
   ["Enable"] = false,
   ["FPS"] = 5
  }
 }
}
setfpscap(5)
repeat wait() until game:IsLoaded()
if game.Players.LocalPlayer:GetAttribute("Level") < 11 then
    getgenv().Config["Macros"]["Macro"] = ""
    getgenv().Config["Summoner"]["Auto Summon Summer"] = false
    getgenv().Config["Summer Event"]["Summer Event Joiner"]["Auto Join"] = false
    getgenv().Config["Macros"]["Auto Equip"] = false
    getgenv().Config["Match Finished"]["Replay Amount"] = 20
    getgenv().Config["Stage Joiner"] = {
        ["Join Highest"] = false,
        ["Join Lowest Clear"] = false,
        ["Auto Join"] = true,
        ["Nightmare Mode"] = false,
        ["Stage"] = "Planet Namak",
        ["Act"] = "Act1"
    }
end
repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`
        break;
        case 'av' :
          script = `
repeat wait() until game:IsLoaded()
local Players1 = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local LocalPlayer1 = Players1.LocalPlayer
local markName = ("%s_startquest.txt"):format(LocalPlayer1.Name)
local markNameStatus = isfile(markName)
local function safeRequire(m)
    local ok, mod = pcall(require, m)
    if ok then return mod end
    warn("StartQuest require error:", mod)
    return nil
end
local function waitForPath(root, parts, timeoutPerStep)
    local node = root
    for _, name in ipairs(parts) do
        node = node:WaitForChild(name, timeoutPerStep or 10)
        if not node then return nil end
    end
    return node
end

local function getCurrencies()
    local ch = safeRequire(game.StarterPlayer.Modules.Gameplay.CurrencyHandler)
    if ch and typeof(ch.GetCurrencies) == "function" then
        local ok, tbl = pcall(ch.GetCurrencies)
        if ok and typeof(tbl) == "table" then
            return tbl
        end
    end
    return {}
end

local function num(v) return (typeof(v) == "number") and v or 0 end

local function fire(remotePath, args)
    local ok, remote = pcall(function()
        return waitForPath(ReplicatedStorage, remotePath, 10)
    end)
    if not ok or not remote then
        warn("not found remote:", table.concat(remotePath, "/"))
        return false
    end
    local ok2, err = pcall(function()
        remote:FireServer(unpack(args))
    end)
    if not ok2 then
        warn("error run remote:", err)
        return false
    end
    return true
end

local function pickOneUnitName()
    local unitsFolder = waitForPath(LocalPlayer1, {
        "PlayerGui","Windows","Units","Holder","Main","Units"
    }, 10)
    if not unitsFolder then return nil end

    local ignore = {
        UICorner = true,
        UIGridLayout = true,
        UIPadding = true,
        BuyMoreSpace = true,
    }

    for _, child in ipairs(unitsFolder:GetChildren()) do
        if not ignore[child.Name] then
            return child.Name
        end
    end
    return nil
end
function StartQuest()
    if isfile and isfile(markName) then
        return
    end
    fire({"Networking", "DailyRewardEvent"}, {
        [1] = "Claim",
        [2] = { "Anniversary", 1 }
    })
    task.wait(0.3)
    fire({"Networking", "BattlepassEvent"}, {
        [1] = "ClaimAll"
    })
    task.wait(0.3)
    local c = getCurrencies()
    local gems = num(c.Gems or c.Gem or c.gems)
    local rerolls = num(c.TraitRerolls or c["Trait Rerolls"] or c.traitrerolls)
    if gems >= 50 and rerolls > 0 then
        fire({"Networking","Units","SummonEvent"}, {
            [1] = "SummonMany",
            [2] = "Special",
            [3] = 1
        })
        task.wait(0.5)
        local unitId = pickOneUnitName()
        if unitId then
            fire({"Networking","Units","TraitEvent"}, {
                [1] = "Reroll",
                [2] = { unitId, "Trait" }
            })
        else
            warn("Not found unit.")
        end
        task.wait(0.3)
        if unitId then
            local args = {
                [1] = "All",
                [2] = unitId
            }

            game:GetService("ReplicatedStorage").Networking.StatRerollFunction:InvokeServer(unpack(args))
        end
        if writefile then
            local ok, err = pcall(function()
                writefile(("%s_startquest.txt"):format(LocalPlayer1.Name), "done quest")
            end)
            if not ok then
                warn("Error write file:", err)
            end
        else
            warn("Chill.")
        end
    else
        warn("Not enough gem or reroll.")
    end
end
StartQuest()
getgenv().Key = "${nousigi}"
getgenv().EquipMacroUnit = true
getgenv().ImportMacro = "https://cdn.discordapp.com/attachments/1294178906987036732/1415314352545988638/message.txt?ex=68c2c1b4&is=68c17034&hm=cd958cd5709da7f7035204b29c72f16d4478698617098ae3f7174203760e3c6e&"
getgenv().Config = {
    ["Auto Join Equipper"] = {
        ["Macro Equipper"] = {
            ["Enable"] = false
        },
        ["Team Equipper"] = {
            ["Enable"] = false
        }
    },
    ["Gold Buyer"] = {
        ["Enable"] = false
    },
    ["Dungeon Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stage Joiner"] = {
        ["Join Highest"] = false,
        ["Join Lowest Clear"] = false,
        ["Auto Join"] = true,
        ["Nightmare Mode"] = false,
        ["Stage"] = "Planet Namak",
        ["Act"] = "Infinite"
    },
    ["Macros"] = {
        ["Macro Retry Limit"] = 0,
        ["Ignore Macro Timing"] = true,
        ["Play"] = true,
        ["Auto Equip"] = true,
        ["No Ignore Sell Timing"] = true,
        ["Macro"] = "message"
    },
    ["Summer Event"] = {
        ["Summer Event Joiner"] = {
            ["Auto Join"] = false
        }
    },
    ["Webhook"] = {
        ["Unit Summoned"] = false,
        ["Trait Rerolled"] = false,
        ["URL"] = "https://discord.com/api/webhooks/1410629253262872676/f4VsUnjK4mu1Xx5cgFz3ASeIDgyAElMIg9M-8KwRj56R0hpAOWGtFmhmPRkTseJwjRL6",
        ["Unit Stat Potential"] = false,
        ["Stage Finished"] = true,
        ["Stat Potential Rerolled"] = false,
        ["Match Restarted"] = false
    },
    ["Boss Event Joiner"] = {
        ["Auto Join"] = false,
        ["Nightmare Mode"] = false
    },
    ["Trait Reroller"] = {
        ["Enable"] = false,
        ["Trait"] = {
            ["Vigor 3"] = true,
            ["Fortune"] = true,
            ["Swift 2"] = true,
            ["Vigor 1"] = true,
            ["Range 2"] = true,
            ["Blitz"] = true,
            ["Ethereal"] = true,
            ["Swift 3"] = true,
            ["Vigor 2"] = true,
            ["Swift 1"] = true,
            ["Solar"] = true,
            ["Scholar"] = true,
            ["Range 3"] = true,
            ["Range 1"] = true,
            ["Monarch"] = true,
            ["Deadeye"] = true,
            ["Marksman"] = true
        }
    },
    ["Odyssey Joiner"] = {
        ["Second Team"] = 2,
        ["Auto Join"] = false,
        ["Cash Out Floor"] = 5,
        ["Intensity"] = 200,
        ["First Team"] = 1
    },
    ["Summer Portal Joiner"] = {
        ["Buy if out of Portal"] = false,
        ["Tier Cap"] = 10,
        ["Auto Join"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Auto Next"] = true,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            }
        }
    },
    ["Claimer"] = {
        ["Auto Claim Collection Milestone"] = true,
        ["Auto Claim Quest"] = true,
        ["Auto Claim Milestone"] = true,
        ["Auto Claim Achievement"] = true,
        ["Auto Claim Daily Reward"] = true,
        ["Auto Claim Collection"] = true,
        ["Auto Claim Enemy Index"] = true,
        ["Auto Claim Battle Pass"] = true
    },
    ["Gameplay"] = {
        ["Double Dungeon"] = {
            ["Auto Statue"] = false,
            ["Leave Extra Money"] = 5000,
            ["Upgrade Amount"] = 0
        },
        ["Saber Event"] = {
            ["Auto Select Servant"] = false,
            ["Servant"] = "Berserker"
        },
        ["Steel Ball Run"] = {
            ["Collect Steel Ball"] = false
        },
        ["Random Sacrifice Domain"] = {
            ["Sell Units on Event"] = false
        },
        ["Auto Vote Start"] = true,
        ["Auto Skip Wave"] = {
            ["Enable"] = true,
            ["Stop Skip Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Stop at Wave"] = 15
        },
        ["Auto Use Ability"] = true,
        ["Elemental Dimensions"] = {
            ["Enable"] = false,
            ["Order"] = {
                ["Fire"] = 1,
                ["Ice"] = 2,
                ["Sand"] = 3
            }
        },
        ["Auto Sell"] = {
            ["Auto Sell Farm"] = {
                ["Enable"] = true,
                ["Wave"] = 40,
                ["Stage Type"] = {
                    ["Odyssey"] = true,
                    ["Challenge"] = true,
                    ["Portal"] = true,
                    ["Worldline"] = true,
                    ["Legend Stage"] = true,
                    ["BossEvent"] = true,
                    ["Dungeon"] = true,
                    ["Infinite"] = true,
                    ["Rift"] = true,
                    ["Story"] = false,
                    ["Raid"] = true
                }
            },
            ["Auto Sell Unit"] = {
                ["Enable"] = true,
                ["Wave"] = 10,
                ["Stage Type"] = {
                    ["Odyssey"] = false,
                    ["Challenge"] = false,
                    ["Portal"] = false,
                    ["Worldline"] = false,
                    ["Legend Stage"] = false,
                    ["BossEvent"] = false,
                    ["Dungeon"] = false,
                    ["Infinite"] = true,
                    ["Rift"] = false,
                    ["Story"] = false,
                    ["Raid"] = false
                }
            }
        },
        ["Ant Island"] = {
            ["Auto Plug Ant Tunnel"] = false
        },
        ["Shibuya Station"] = {
            ["Upgrade Amount"] = 0,
            ["Auto Mohato"] = false,
            ["Leave Extra Money"] = 5000
        },
        ["Ruined City"] = {
            ["Use Mount to Travel"] = true,
            ["Active Tower"] = false,
            ["Unhandcuff"] = false
        },
        ["The System"] = {
            ["Auto Shadow"] = {
                ["Enable"] = false,
                ["Order"] = {
                    ["Steel"] = 2,
                    ["Bear"] = 1,
                    ["Healer"] = 3,
                    ["Belu"] = 4
                }
            }
        },
        ["Burn Units"] = {
            ["Enable"] = false,
            ["Slots"] = {
                ["1"] = false,
                ["3"] = false,
                ["2"] = false,
                ["5"] = false,
                ["4"] = false,
                ["6"] = false
            },
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Auto Restart"] = {
            ["Enable"] = false,
            ["Wave"] = 10,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Occult Hunt"] = {
            ["Collect Talisman"] = false,
            ["Use All Talisman"] = {
                ["Enable"] = false,
                ["Wave"] = 1
            },
            ["Use Talisman on Crab"] = false
        },
        ["Martial Island"] = {
            ["Auto Join God Portal"] = false,
            ["Collect Rotara Earring"] = false,
            ["Pause instead of Joining"] = false,
            ["Restart if no Rotara Earring"] = false
        },
        ["Edge of Heaven"] = {
            ["Auto Join Lfelt Portal"] = false,
            ["Pause instead of Joining"] = false
        }
    },
    ["Daily Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Misc"] = {
        ["Auto Open Gift Boxes"] = true,
        ["Right Click Move"] = false,
        ["Max Camera Zoom"] = 40,
        ["Redeem Code"] = true,
        ["Right Click Teleport"] = false,
        ["Auto Delete Portal"] = {
            ["Enable"] = false,
            ["Summer Portal"] = 500,
            ["Spring Portal"] = 500
        }
    },
    ["Summoner"] = {
        ["Teleport Lobby new Banner"] = false,
        ["Unselect if Summoned"] = true,
        ["Special Unit"] = {
            ["Sprintwagon"] = true
        },
        ["Normalize Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        },
        ["Auto Summon Summer"] = false,
        ["Auto Summon Special"] = false,
        ["Auto Summon Spring"] = false,
        ["Delete Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        }
    },
    ["Unit Deleter"] = {
        ["Enable"] = false,
        ["Rarity"] = {
            ["Epic"] = false,
            ["Legendary"] = false,
            ["Rare"] = false
        }
    },
    ["Worldline Joiner"] = {
        ["Auto Join"] = false
    },
    ["Modifier"] = {
        ["Restart Modifier"] = {
            ["Enable"] = false,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Modifier"] = {
                ["Drowsy"] = false,
                ["Warding off Evil"] = false,
                ["King's Burden"] = false,
                ["Champions"] = false,
                ["Exterminator"] = false,
                ["Fisticuffs"] = false,
                ["Lifeline"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["No Trait No Problem"] = false,
                ["Money Surge"] = false
            }
        },
        ["Auto Modifier"] = {
            ["Enable"] = false,
            ["Prioritize"] = {
                ["Range"] = 18,
                ["Revitalize"] = 6,
                ["Unit Draw"] = 31,
                ["Exploding"] = 2,
                ["Immunity"] = 11,
                ["Damage"] = 20,
                ["Lifeline"] = 29,
                ["Evolution"] = 32,
                ["Regen"] = 7,
                ["Press It"] = 14,
                ["Nighttime"] = 30,
                ["Shielded"] = 5,
                ["Cooldown"] = 19,
                ["Money Surge"] = 26,
                ["Strong"] = 3,
                ["Thrice"] = 4,
                ["Warding off Evil"] = 24,
                ["Quake"] = 9,
                ["Fast"] = 1,
                ["Dodge"] = 10,
                ["Fisticuffs"] = 25,
                ["Drowsy"] = 8,
                ["No Trait No Problem"] = 23,
                ["King's Burden"] = 27,
                ["Slayer"] = 16,
                ["Common Loot"] = 21,
                ["Precise Attack"] = 13,
                ["Harvest"] = 17,
                ["Champions"] = 12,
                ["Planning Ahead"] = 15,
                ["Exterminator"] = 28,
                ["Uncommon Loot"] = 22,
                ["Wild Card"] = 33
            }
        }
    },
    ["Auto Play"] = {
        ["Auto Upgrade"] = {
            ["Upgrade Order"] = {
                ["1"] = 1,
                ["3"] = 3,
                ["2"] = 2,
                ["5"] = 5,
                ["4"] = 4,
                ["6"] = 6
            },
            ["Place and Upgrade"] = true,
            ["Enable"] = true,
            ["Focus on Farm"] = false,
            ["Upgrade Limit"] = {
                ["1"] = 0,
                ["3"] = 0,
                ["2"] = 0,
                ["5"] = 0,
                ["4"] = 0,
                ["6"] = 0
            },
            ["Upgrade Method"] = "Hotbar left to right (until Max)"
        },
        ["Place Limit"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Enable"] = true,
        ["Place Wave"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Place Order"] = {
            ["1"] = 1,
            ["3"] = 3,
            ["2"] = 2,
            ["5"] = 5,
            ["4"] = 4,
            ["6"] = 6
        }
    },
    ["Match Finished"] = {
        ["Auto Return Lobby"] = false,
        ["Auto Next"] = true,
        ["Replay Amount"] = 20,
        ["Return Lobby Failsafe"] = true,
        ["Auto Replay"] = true
    },
    ["Crafter"] = {
        ["Enable"] = false,
        ["Teleport Lobby full Essence"] = false,
        ["Essence Stone"] = {
            ["Pink Essence Stone"] = true,
            ["Blue Essence Stone"] = true,
            ["Red Essence Stone"] = true,
            ["Yellow Essence Stone"] = true,
            ["Purple Essence Stone"] = true
        },
        ["Essence Stone Limit"] = {
            ["Pink Essence Stone"] = 50,
            ["Blue Essence Stone"] = 50,
            ["Red Essence Stone"] = 50,
            ["Yellow Essence Stone"] = 50,
            ["Purple Essence Stone"] = 50
        }
    },
    ["Rift Joiner"] = {
        ["Join Solo Only"] = false,
        ["Hop Server if no Rift Portal"] = false,
        ["Auto Join"] = false,
        ["Teleport Lobby Rift spawn"] = {
            ["Enable"] = false,
            ["Force teleport"] = false,
            ["Extra Time"] = 60
        }
    },
    ["Legend Stage Joiner"] = {
        ["Auto Join"] = false
    },
    ["Regular Challenge Joiner"] = {
        ["Auto Join"] = false,
        ["Teleport Lobby new Challenge"] = false
    },
    ["Auto Join Setting"] = {
        ["Joiner Priority"] = {
            ["Legend Stage Joiner"] = 2,
            ["Spring Portal Joiner"] = 9,
            ["Limitless Odyssey Joiner"] = 8,
            ["Odyssey Joiner"] = 7,
            ["Boss Event Joiner"] = 5,
            ["Summer Portal Joiner"] = 11,
            ["Worldline Joiner"] = 6,
            ["Dungeon Joiner"] = 4,
            ["Weekly Challenge Joiner"] = 15,
            ["Raid Joiner"] = 3,
            ["Boss Bounties Joiner"] = 12,
            ["Regular Challenge Joiner"] = 13,
            ["Stage Joiner"] = 1,
            ["Summer Event Joiner"] = 10,
            ["Daily Challenge Joiner"] = 14,
            ["Rift Joiner"] = 16
        },
        ["Joiner Cooldown"] = 15
    },
    ["Raid Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stat Reroller"] = {
        ["Stat Potential"] = 10,
        ["Teleport Lobby reach Stat Potential"] = false,
        ["Enable"] = true,
        ["Type"] = {
            ["SPA"] = false,
            ["All"] = true,
            ["Range"] = false,
            ["Damage"] = false
        },
        ["Stat"] = {
            ["Z+"] = false,
            ["S"] = true,
            ["Z"] = false
        },
        ["Unit"] = {}
    },
    ["Failsafe"] = {
        ["Teleport Lobby if Player"] = false,
        ["Disable Auto Teleport AFK Chamber"] = true
    },
    ["Unit Feeder"] = {
        ["Auto Feed"] = false,
        ["Feed Level"] = 60
    },
    ["Weekly Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Secure"] = {
        ["Random Offset"] = true,
        ["Walk Around"] = true
    },
    ["Boss Bounties Joiner"] = {
        ["Auto Join"] = false
    },
    ["Limitless Odyssey Joiner"] = {
        ["Auto Force Skip Wave"] = false,
        ["Auto Join"] = false,
        ["Force Skip Wave"] = 1,
        ["Intensity"] = 25,
        ["Leave Floor"] = 1
    },
    ["Performance"] = {
        ["Delete Map"] = true,
        ["Boost FPS"] = true,
        ["Black Screen"] = true,
        ["Delete Entities"] = true
    },
    ["Performance Failsafe"] = {
        ["Teleport Lobby FPS below"] = {
            ["Enable"] = false,
            ["FPS"] = 3
        }
    },
    ["Spring Portal Joiner"] = {
        ["Tier Cap"] = 10,
        ["Auto Next"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Teleport Lobby full Iced Box"] = false,
        ["Ignore Act"] = {
            ["[Land of the Gods] Act2"] = false,
            ["[Planet Namak] Act3"] = false,
            ["[Planet Namak] Act6"] = false,
            ["[Land of the Gods] Act1"] = false,
            ["[Edge of Heaven] Act2"] = false,
            ["[Planet Namak] Act1"] = false,
            ["[Planet Namak] Act5"] = false,
            ["[Land of the Gods] Act3"] = false,
            ["[Edge of Heaven] Act3"] = false,
            ["[Edge of Heaven] Act1"] = false,
            ["[Planet Namak] Act2"] = false,
            ["[Planet Namak] Act4"] = false,
            ["[Edge of Heaven] Act4"] = false,
            ["[Edge of Heaven] Act6"] = false,
            ["[Edge of Heaven] Act5"] = false
        },
        ["Auto Join"] = false,
        ["Teleport Lobby full Wooden Chest"] = false,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            },
            ["Prioritize"] = {
                ["Land of the Gods"] = 1,
                ["Planet Namak"] = 2,
                ["Edge of Heaven"] = 3
            }
        },
        ["Buy if out of Portal"] = false
    },
    ["Skin Deleter"] = {
        ["Enable"] = false
    }
}
if not markNameStatus then
    getgenv().Config["Macros"]["Macro"] = ""
    getgenv().Config["Macros"]["Auto Equip"] = false
    getgenv().Config["Match Finished"]["Replay Amount"] = 5
    getgenv().Config["Stage Joiner"] = {
        ["Join Highest"] = false,
        ["Join Lowest Clear"] = false,
        ["Auto Join"] = true,
        ["Nightmare Mode"] = false,
        ["Stage"] = "Planet Namak",
        ["Act"] = "Act1"
    }
end
repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(3)until Joebiden
`
          break;
        case 'av-gem' :
        case 'av-gem-50' :
        case 'av-gem-100' :
          script = `
getgenv().Key = "${nousigi}"
getgenv().Config = {
    ["Auto Join Equipper"] = {
        ["Macro Equipper"] = {
            ["Enable"] = false
        },
        ["Team Equipper"] = {
            ["Enable"] = false
        }
    },
    ["Gold Buyer"] = {
        ["Enable"] = false
    },
    ["Dungeon Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stage Joiner"] = {
        ["Join Highest"] = false,
        ["Join Lowest Clear"] = false,
        ["Auto Join"] = true,
        ["Nightmare Mode"] = false,
        ["Stage"] = "Planet Namak",
        ["Act"] = "Act1"
    },
    ["Macros"] = {
        ["Macro Retry Limit"] = 0,
        ["Ignore Macro Timing"] = true,
        ["Play"] = true,
        ["Auto Equip"] = false,
        ["No Ignore Sell Timing"] = true,
        ["Macro"] = ""
    },
    ["Summer Event"] = {
        ["Summer Event Joiner"] = {
            ["Auto Join"] = false
        }
    },
    ["Webhook"] = {
        ["Unit Summoned"] = false,
        ["Trait Rerolled"] = false,
        ["URL"] = "https://discord.com/api/webhooks/1410629253262872676/f4VsUnjK4mu1Xx5cgFz3ASeIDgyAElMIg9M-8KwRj56R0hpAOWGtFmhmPRkTseJwjRL6",
        ["Unit Stat Potential"] = false,
        ["Stage Finished"] = true,
        ["Stat Potential Rerolled"] = false,
        ["Match Restarted"] = false
    },
    ["Boss Event Joiner"] = {
        ["Auto Join"] = false,
        ["Nightmare Mode"] = false
    },
    ["Trait Reroller"] = {
        ["Enable"] = false,
        ["Trait"] = {
            ["Vigor 3"] = true,
            ["Fortune"] = true,
            ["Swift 2"] = true,
            ["Vigor 1"] = true,
            ["Range 2"] = true,
            ["Blitz"] = true,
            ["Ethereal"] = true,
            ["Swift 3"] = true,
            ["Vigor 2"] = true,
            ["Swift 1"] = true,
            ["Solar"] = true,
            ["Scholar"] = true,
            ["Range 3"] = true,
            ["Range 1"] = true,
            ["Monarch"] = true,
            ["Deadeye"] = true,
            ["Marksman"] = true
        }
    },
    ["Odyssey Joiner"] = {
        ["Second Team"] = 2,
        ["Auto Join"] = false,
        ["Cash Out Floor"] = 5,
        ["Intensity"] = 200,
        ["First Team"] = 1
    },
    ["Summer Portal Joiner"] = {
        ["Buy if out of Portal"] = false,
        ["Tier Cap"] = 10,
        ["Auto Join"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Auto Next"] = true,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            }
        }
    },
    ["Claimer"] = {
        ["Auto Claim Collection Milestone"] = true,
        ["Auto Claim Quest"] = true,
        ["Auto Claim Milestone"] = true,
        ["Auto Claim Achievement"] = true,
        ["Auto Claim Daily Reward"] = true,
        ["Auto Claim Collection"] = true,
        ["Auto Claim Enemy Index"] = true,
        ["Auto Claim Battle Pass"] = true
    },
    ["Gameplay"] = {
        ["Double Dungeon"] = {
            ["Auto Statue"] = false,
            ["Leave Extra Money"] = 5000,
            ["Upgrade Amount"] = 0
        },
        ["Saber Event"] = {
            ["Auto Select Servant"] = false,
            ["Servant"] = "Berserker"
        },
        ["Steel Ball Run"] = {
            ["Collect Steel Ball"] = false
        },
        ["Random Sacrifice Domain"] = {
            ["Sell Units on Event"] = false
        },
        ["Auto Vote Start"] = true,
        ["Auto Skip Wave"] = {
            ["Enable"] = true,
            ["Stop Skip Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Stop at Wave"] = 15
        },
        ["Auto Use Ability"] = true,
        ["Elemental Dimensions"] = {
            ["Enable"] = false,
            ["Order"] = {
                ["Fire"] = 1,
                ["Ice"] = 2,
                ["Sand"] = 3
            }
        },
        ["Auto Sell"] = {
            ["Auto Sell Farm"] = {
                ["Enable"] = true,
                ["Wave"] = 40,
                ["Stage Type"] = {
                    ["Odyssey"] = true,
                    ["Challenge"] = true,
                    ["Portal"] = true,
                    ["Worldline"] = true,
                    ["Legend Stage"] = true,
                    ["BossEvent"] = true,
                    ["Dungeon"] = true,
                    ["Infinite"] = true,
                    ["Rift"] = true,
                    ["Story"] = false,
                    ["Raid"] = true
                }
            },
            ["Auto Sell Unit"] = {
                ["Enable"] = true,
                ["Wave"] = 10,
                ["Stage Type"] = {
                    ["Odyssey"] = false,
                    ["Challenge"] = false,
                    ["Portal"] = false,
                    ["Worldline"] = false,
                    ["Legend Stage"] = false,
                    ["BossEvent"] = false,
                    ["Dungeon"] = false,
                    ["Infinite"] = true,
                    ["Rift"] = false,
                    ["Story"] = false,
                    ["Raid"] = false
                }
            }
        },
        ["Ant Island"] = {
            ["Auto Plug Ant Tunnel"] = false
        },
        ["Shibuya Station"] = {
            ["Upgrade Amount"] = 0,
            ["Auto Mohato"] = false,
            ["Leave Extra Money"] = 5000
        },
        ["Ruined City"] = {
            ["Use Mount to Travel"] = true,
            ["Active Tower"] = false,
            ["Unhandcuff"] = false
        },
        ["The System"] = {
            ["Auto Shadow"] = {
                ["Enable"] = false,
                ["Order"] = {
                    ["Steel"] = 2,
                    ["Bear"] = 1,
                    ["Healer"] = 3,
                    ["Belu"] = 4
                }
            }
        },
        ["Burn Units"] = {
            ["Enable"] = false,
            ["Slots"] = {
                ["1"] = false,
                ["3"] = false,
                ["2"] = false,
                ["5"] = false,
                ["4"] = false,
                ["6"] = false
            },
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Auto Restart"] = {
            ["Enable"] = false,
            ["Wave"] = 10,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            }
        },
        ["Occult Hunt"] = {
            ["Collect Talisman"] = false,
            ["Use All Talisman"] = {
                ["Enable"] = false,
                ["Wave"] = 1
            },
            ["Use Talisman on Crab"] = false
        },
        ["Martial Island"] = {
            ["Auto Join God Portal"] = false,
            ["Collect Rotara Earring"] = false,
            ["Pause instead of Joining"] = false,
            ["Restart if no Rotara Earring"] = false
        },
        ["Edge of Heaven"] = {
            ["Auto Join Lfelt Portal"] = false,
            ["Pause instead of Joining"] = false
        }
    },
    ["Daily Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Misc"] = {
        ["Auto Open Gift Boxes"] = true,
        ["Right Click Move"] = false,
        ["Max Camera Zoom"] = 40,
        ["Redeem Code"] = true,
        ["Right Click Teleport"] = false,
        ["Auto Delete Portal"] = {
            ["Enable"] = false,
            ["Summer Portal"] = 500,
            ["Spring Portal"] = 500
        }
    },
    ["Summoner"] = {
        ["Teleport Lobby new Banner"] = false,
        ["Unselect if Summoned"] = true,
        ["Special Unit"] = {
            ["Sprintwagon"] = true
        },
        ["Normalize Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        },
        ["Auto Summon Summer"] = false,
        ["Auto Summon Special"] = false,
        ["Auto Summon Spring"] = false,
        ["Delete Rarity"] = {
            ["Legendary"] = false,
            ["Mythic"] = false,
            ["Exclusive"] = false,
            ["Epic"] = false,
            ["Rare"] = false
        }
    },
    ["Unit Deleter"] = {
        ["Enable"] = false,
        ["Rarity"] = {
            ["Epic"] = false,
            ["Legendary"] = false,
            ["Rare"] = false
        }
    },
    ["Worldline Joiner"] = {
        ["Auto Join"] = false
    },
    ["Modifier"] = {
        ["Restart Modifier"] = {
            ["Enable"] = false,
            ["Stage Type"] = {
                ["Odyssey"] = true,
                ["Challenge"] = true,
                ["Portal"] = true,
                ["Worldline"] = true,
                ["Legend Stage"] = true,
                ["BossEvent"] = true,
                ["Dungeon"] = true,
                ["Infinite"] = true,
                ["Rift"] = true,
                ["Story"] = true,
                ["Raid"] = true
            },
            ["Modifier"] = {
                ["Drowsy"] = false,
                ["Warding off Evil"] = false,
                ["King's Burden"] = false,
                ["Champions"] = false,
                ["Exterminator"] = false,
                ["Fisticuffs"] = false,
                ["Lifeline"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["No Trait No Problem"] = false,
                ["Money Surge"] = false
            }
        },
        ["Auto Modifier"] = {
            ["Enable"] = false,
            ["Prioritize"] = {
                ["Range"] = 18,
                ["Revitalize"] = 6,
                ["Unit Draw"] = 31,
                ["Exploding"] = 2,
                ["Immunity"] = 11,
                ["Damage"] = 20,
                ["Lifeline"] = 29,
                ["Evolution"] = 32,
                ["Regen"] = 7,
                ["Press It"] = 14,
                ["Nighttime"] = 30,
                ["Shielded"] = 5,
                ["Cooldown"] = 19,
                ["Money Surge"] = 26,
                ["Strong"] = 3,
                ["Thrice"] = 4,
                ["Warding off Evil"] = 24,
                ["Quake"] = 9,
                ["Fast"] = 1,
                ["Dodge"] = 10,
                ["Fisticuffs"] = 25,
                ["Drowsy"] = 8,
                ["No Trait No Problem"] = 23,
                ["King's Burden"] = 27,
                ["Slayer"] = 16,
                ["Common Loot"] = 21,
                ["Precise Attack"] = 13,
                ["Harvest"] = 17,
                ["Champions"] = 12,
                ["Planning Ahead"] = 15,
                ["Exterminator"] = 28,
                ["Uncommon Loot"] = 22,
                ["Wild Card"] = 33
            }
        }
    },
    ["Auto Play"] = {
        ["Auto Upgrade"] = {
            ["Upgrade Order"] = {
                ["1"] = 1,
                ["3"] = 3,
                ["2"] = 2,
                ["5"] = 5,
                ["4"] = 4,
                ["6"] = 6
            },
            ["Place and Upgrade"] = true,
            ["Enable"] = true,
            ["Focus on Farm"] = false,
            ["Upgrade Limit"] = {
                ["1"] = 0,
                ["3"] = 0,
                ["2"] = 0,
                ["5"] = 0,
                ["4"] = 0,
                ["6"] = 0
            },
            ["Upgrade Method"] = "Hotbar left to right (until Max)"
        },
        ["Place Limit"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Enable"] = true,
        ["Place Wave"] = {
            ["1"] = 0,
            ["3"] = 0,
            ["2"] = 0,
            ["5"] = 0,
            ["4"] = 0,
            ["6"] = 0
        },
        ["Place Order"] = {
            ["1"] = 1,
            ["3"] = 3,
            ["2"] = 2,
            ["5"] = 5,
            ["4"] = 4,
            ["6"] = 6
        }
    },
    ["Match Finished"] = {
        ["Auto Return Lobby"] = false,
        ["Auto Next"] = false,
        ["Replay Amount"] = 20,
        ["Return Lobby Failsafe"] = true,
        ["Auto Replay"] = true
    },
    ["Crafter"] = {
        ["Enable"] = false,
        ["Teleport Lobby full Essence"] = false,
        ["Essence Stone"] = {
            ["Pink Essence Stone"] = true,
            ["Blue Essence Stone"] = true,
            ["Red Essence Stone"] = true,
            ["Yellow Essence Stone"] = true,
            ["Purple Essence Stone"] = true
        },
        ["Essence Stone Limit"] = {
            ["Pink Essence Stone"] = 50,
            ["Blue Essence Stone"] = 50,
            ["Red Essence Stone"] = 50,
            ["Yellow Essence Stone"] = 50,
            ["Purple Essence Stone"] = 50
        }
    },
    ["Rift Joiner"] = {
        ["Join Solo Only"] = false,
        ["Hop Server if no Rift Portal"] = false,
        ["Auto Join"] = false,
        ["Teleport Lobby Rift spawn"] = {
            ["Enable"] = false,
            ["Force teleport"] = false,
            ["Extra Time"] = 60
        }
    },
    ["Legend Stage Joiner"] = {
        ["Auto Join"] = false
    },
    ["Regular Challenge Joiner"] = {
        ["Auto Join"] = false,
        ["Teleport Lobby new Challenge"] = false
    },
    ["Auto Join Setting"] = {
        ["Joiner Priority"] = {
            ["Legend Stage Joiner"] = 2,
            ["Spring Portal Joiner"] = 9,
            ["Limitless Odyssey Joiner"] = 8,
            ["Odyssey Joiner"] = 7,
            ["Boss Event Joiner"] = 5,
            ["Summer Portal Joiner"] = 11,
            ["Worldline Joiner"] = 6,
            ["Dungeon Joiner"] = 4,
            ["Weekly Challenge Joiner"] = 15,
            ["Raid Joiner"] = 3,
            ["Boss Bounties Joiner"] = 12,
            ["Regular Challenge Joiner"] = 13,
            ["Stage Joiner"] = 1,
            ["Summer Event Joiner"] = 10,
            ["Daily Challenge Joiner"] = 14,
            ["Rift Joiner"] = 16
        },
        ["Joiner Cooldown"] = 15
    },
    ["Raid Joiner"] = {
        ["Auto Join"] = false
    },
    ["Stat Reroller"] = {
        ["Stat Potential"] = 10,
        ["Teleport Lobby reach Stat Potential"] = false,
        ["Enable"] = true,
        ["Type"] = {
            ["SPA"] = false,
            ["All"] = true,
            ["Range"] = false,
            ["Damage"] = false
        },
        ["Stat"] = {
            ["Z+"] = false,
            ["S"] = true,
            ["Z"] = false
        },
        ["Unit"] = {}
    },
    ["Failsafe"] = {
        ["Teleport Lobby if Player"] = false,
        ["Disable Auto Teleport AFK Chamber"] = true
    },
    ["Unit Feeder"] = {
        ["Auto Feed"] = false,
        ["Feed Level"] = 60
    },
    ["Weekly Challenge Joiner"] = {
        ["Auto Join"] = false
    },
    ["Secure"] = {
        ["Random Offset"] = true,
        ["Walk Around"] = true
    },
    ["Boss Bounties Joiner"] = {
        ["Auto Join"] = false
    },
    ["Limitless Odyssey Joiner"] = {
        ["Auto Force Skip Wave"] = false,
        ["Auto Join"] = false,
        ["Force Skip Wave"] = 1,
        ["Intensity"] = 25,
        ["Leave Floor"] = 1
    },
    ["Performance"] = {
        ["Delete Map"] = true,
        ["Boost FPS"] = true,
        ["Black Screen"] = true,
        ["Delete Entities"] = true
    },
    ["Performance Failsafe"] = {
        ["Teleport Lobby FPS below"] = {
            ["Enable"] = false,
            ["FPS"] = 3
        }
    },
    ["Spring Portal Joiner"] = {
        ["Tier Cap"] = 10,
        ["Auto Next"] = false,
        ["Ignore Modifier"] = {
            ["Strong"] = false,
            ["Thrice"] = false,
            ["Regen"] = false,
            ["Fast"] = false,
            ["Revitalize"] = false,
            ["Drowsy"] = false,
            ["Exploding"] = false,
            ["Dodge"] = false,
            ["Quake"] = false,
            ["Immunity"] = false,
            ["Shielded"] = false,
            ["Champions"] = false
        },
        ["Teleport Lobby full Iced Box"] = false,
        ["Ignore Act"] = {
            ["[Land of the Gods] Act2"] = false,
            ["[Planet Namak] Act3"] = false,
            ["[Planet Namak] Act6"] = false,
            ["[Land of the Gods] Act1"] = false,
            ["[Edge of Heaven] Act2"] = false,
            ["[Planet Namak] Act1"] = false,
            ["[Planet Namak] Act5"] = false,
            ["[Land of the Gods] Act3"] = false,
            ["[Edge of Heaven] Act3"] = false,
            ["[Edge of Heaven] Act1"] = false,
            ["[Planet Namak] Act2"] = false,
            ["[Planet Namak] Act4"] = false,
            ["[Edge of Heaven] Act4"] = false,
            ["[Edge of Heaven] Act6"] = false,
            ["[Edge of Heaven] Act5"] = false
        },
        ["Auto Join"] = false,
        ["Teleport Lobby full Wooden Chest"] = false,
        ["Portal Reward Picker"] = {
            ["Enable"] = false,
            ["Ignore Modifier"] = {
                ["Strong"] = false,
                ["Thrice"] = false,
                ["Regen"] = false,
                ["Fast"] = false,
                ["Revitalize"] = false,
                ["Drowsy"] = false,
                ["Exploding"] = false,
                ["Dodge"] = false,
                ["Quake"] = false,
                ["Immunity"] = false,
                ["Shielded"] = false,
                ["Champions"] = false
            },
            ["Prioritize"] = {
                ["Land of the Gods"] = 1,
                ["Planet Namak"] = 2,
                ["Edge of Heaven"] = 3
            }
        },
        ["Buy if out of Portal"] = false
    },
    ["Skin Deleter"] = {
        ["Enable"] = false
    }
}
repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(3)until Joebiden
`
          break;

        case "pvb" :
          const listUserCollect = ["DerekHughes62234","PhilipMiles279","HollyNelson7699","SallyOchre9248","JacobPearl34329","WoodsKim12","SnoopyLam10204","DanaCain448","RandallTeagreen089","TerryPhelps16"]
          const listsvv = ["https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=02821309576723617387258178467622",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=19435375224286447140782675910623",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=78867405043292411428221859914612",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=52383503411190972764365991575770",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=47319098145822929255395458391811",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=72447683214807773383680403706573",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=53504870607182643015027535558319",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=03148765241375935676078465173765",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=35317171338687530211449411268886",
          "https://www.roblox.com/games/127742093697776/Plants-Vs-Brainrots?privateServerLinkCode=12263729849129363340035554701571"]
          this.pvbKeyCountDevice += 1
          const keyIndex = Math.ceil(this.pvbKeyCountDevice / 3) - 1
            // script gom
          script = `script_key="${this.pvbkey[keyIndex]}";
          repeat wait() until game:IsLoaded()
          repeat wait() until game.Players.LocalPlayer
          getgenv().Config["Account Main"] = [${listUserCollect.join(",")}]
          if not table.find(getgenv().Config["Account Main"], game.Players.LocalPlayer.Name) then
            setfpscap(10)
            getgenv().pvbConfig = {
                LOW_CPU = false,
                AUTO_COLLECT_GIFT = true,
                AUTO_SELL_RARITY = {"Rare", "Epic", "Legendary"},
            }
          else
            setfpscap(3)
            getgenv().pvbConfig = {
                    LOW_CPU = true,
                    KICK_AFTER_GIFTED_ALL = true,
                    AUTO_SELL_RARITY = {"Rare", "Epic", "Legendary"},
                    GIFT_USERNAME = {${listUserCollect.join(",")}},  -- Add username "username1", "username2"
                    GIFT_BRAINROT = {"Los Tralaleritos","La Tomatoro","Los Sekolitos","Garamararam","Crazylone Pizaione"},  -- Gift brainrot via name
                    GIFT_BRAINROT_MONEY_PER_SECOND = 45000,  -- $10k+/s -> Gift
                    GIFT_PLANT = {},  -- Gift plant via name
                    GIFT_PLANT_DAMAGE = 100000,  -- 100k+ Damage -> Gift
                    GIFTING_COOLDOWN = 5,
                }
          end
          loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/e9de64ec1af8647119eabd5591561876.lua"))()
          `
      //     script = `script_key="${this.pvbkey[keyIndex]}";
      //
      //     getgenv().pvbConfig = {
      //       AUTO_UPDATE_RESTART = true,
      //       MAX_FPS = 3,  -- This will override setfpscap()
      //     LOW_CPU = true,
      //         MAX_REBIRTH = 99,  -- Stop rebirth at set amount
      //     FORCE_REBIRTH_IGNORE_KEEP_BRAINROT = true,  -- Ignore KEEP_BRAINROT related config until max rebirth
      //     FROST_GRENADE_TARGET_MAX_HP = 100000,  -- Use frost grenade 100k+ hp brainrot
      //
      //     OPEN_LUCKY_EGG = {"Godly Lucky Egg", "Secret Lucky Egg", "Meme Lucky Egg"},
      //         FUSE_PLANT = {},  -- Auto keep & fuse required plant + brainrot
      //
      //     BUY_SEED_SHOP = {["Cactus"] = 5, ["Strawberry"] = 5, ["Pumpkin"] = 5, ["Sunflower"] = 5, ["Dragon Fruit"] = 5, ["Eggplant"] = 5, ["Watermelon"] = 5,["Grape"] = 5, "Cocotank", "Carnivorous Plant", "Mr Carrot", "Tomatrio", "Shroombino", "Mango"},
      //         BUY_GEAR_SHOP = {"Frost Grenade", "Frost Blower"},
      //         KEEP_SEED = {},
      //         KEEP_PLANT_RARITY = {"Secret"},
      //         KEEP_BRAINROT_MONEY_PER_SECOND = 20000,  -- Number
      //     KEEP_BRAINROT_RARITY = {"Secret"},
      //     IGNORE_PRISON_EVENT = true,
      //     PLANT_SECRET_LIMITED_SEED_EVENT = {"Frozen"},
      //
      //
      //         SELL_BRAINROT_DELAY = 120,
      //         SELL_PLANT_DELAY = 30,
      //
      //         -- Webhook
      //     BRAINROT_WEBHOOK_URL = "https://discord.com/api/webhooks/1424241453944799326/c4sF4ZqH6DZB6iHHbLIAstOiL3qqsYTcQ796nKGuXwVFEi3cWdOOj4UHvnAomsKxXkrd",
      //         DISCORD_ID = "",
      //         NOTIFY_RARITY = {"Secret"},
      //         NOTIFY_MONEY_PER_SECOND = 20000,
      //         WEBHOOK_NOTE = "",
      //         SHOW_PUBLIC_DISCORD_ID = true,
      //         SHOW_WEBHOOK_USERNAME = true,
      //         SHOW_WEBHOOK_JOBID = true,
      // }
      //
      // loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/1955a9eeb0a6b663051651121e75f7f7.lua"))()`
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
        case 'gag-bone1' :
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
                      ["Giant Pinecone"] = 20,
                      ["Purple Dahlia"] = 20,
                      ["Paradise Petal"]     = 10,
                      ["Horned Dinoshroom"]  = 10,
                      ["Firefly Fern"]       = 10,
                      ["Amber Spine"]        = 10,
                      ["Burning Bud"]        = 10
    },
    ["Keep Seed"] = {"Dragon Pepper", "Elephant Ears", "Sunflower", "Candy Blossom", "Bone Blossom", "Fossilight", "Maple Apple"},
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
            ["Priority"] = 2
        },
        ["Night Egg"] = {
            ["Place"] = true,
            ["Priority"] = 5
        },
        ["Common Summer Egg"] = {
            ["Place"] = true,
            ["Buy"] = true,
            ["Priority"] = 2
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
        ["Rare Summer Egg"] = {
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
            ["Place"] = true,
            ["Priority"] = 6
        },
        ["Zen Egg"] = {
            ["Place"] = true,
            ["Priority"] = 1
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
    ["PetNeedSend"] = {"Kitsune", "Corrupted Kitsune"},
    ["Destroy Mode"] = {
        ["Auto Destroy when have money"] = 100000000, -- its will destroy all trees select when money >= select
        ["Mode Destroy"] = "Auto",
        ["Trees"] = {"Blueberry", "Coconut","Pineapple","Cactus","Rose", "Orange Tulip", "Stonebite", "Carrot", "Strawberry", "Tomato", "Daffodil", "Cauliflower", "Raspberry", "Foxglove", "Peace Lily", "Corn", "Paradise Petal", "Horsetail", "Serenity", "Watermelon", "Pumpkin", "Avocado", "Green Apple", "Apple", "Banana", "Lilac", "Aloe Vera", "Bamboo", "Rafflesia", "Horned Dinoshroom", "Boneboo", "Lingonberry", "Red Lollipop", "Nightshade", "Crocus", "Lavender", "Manuka Flower", "Wild Carrot", "Blue Lollipop", "Monoblooma"},
        ["Rarity Destroy Auto"] = {"Common", "Uncommon"},
        ["Destroy Untill"] = 50
    },
    ["Dino Quest Farm"] = true,
    ["Url"] = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
    ["Boost FPS"] = true,
    ["Black Screen"] = true,
    ["Zen Event"] = {
        ["Restock Max Cost"] = 64000000,
        ["Zen Seed Pack"] = false,
        ["Zen Egg"] = true,
        ["Koi"] = false,
        ["Spiked Mango"] = false
    },
    ["Note"] = "Cyndral Hub",
    ["Pet Mode"] = {
        ["Sell Pet"] = true,
        ["Equip Pet"] = true,
        ["Name Pet Equip"] = {
            ["Starfish"] = 2,
            "Seal","Tanchozuru","Capybara"
        },
        ["Max Slot Pet To Sell"] = 50, -- If Total Pet In Inventory >= ["Max Slot Pet To Sell"] script will sell pet
        ["Upgrade Slot Egg"] = {
            ["Enable"] = true,
            ["Black List Pet For Upgrade Slots"] = {"Queen Bee","Capybara","Tanchozur","Koi", "Red Fox","Seal", "Dragonfly", "Raccoon", "Disco Bee",
                                                    "Butterfly", "Mimic Octopus", "Meerkat", "Sand Snake", "Fennec Fox",
                                                    "Axolotl", "Hyacinth Macaw", "Hamster", "T-Rex", "Spinosaurus", "Kitsune", "Corrupted Kitsune", "Kodama"}
        },
        ["Pet Dont Delete"] = {"Starfish","Tanchozuru","Koi","Ostrich","Seal", "Peacock", "Capybara", "Mimic Octopus", "Meerkat",  "Triceratops", "Stegosaurus", "Pterodactyl",
          "Brontosaurus", "Pachycephalosaurus", "Iguanodon", "Giant Ant", "Red Fox",
           "Snail", "Hyacinth Macaw", "Axolotl", "Ankylosaurus", "Dilophosaurus","Red Fox", "Dragonfly","Raccoon",
            "Queen Bee", "Disco Bee", "Butterfly", "Dragonfly", "Fennec Fox", "T-Rex", "Spinosaurus","Kappa", "Kitsune", "Corrupted Kitsune", "Kodama", "Corrupted Kodama"},
        ["Dont Sell Pet If Weight > x"] = 10 -- Script dont sell pet if this weight >= 10
    },
    ["Webhook Mode"] = {
        ["Enable Send Pet Weight"] = true,
        ["Weight"] = 10
    },
    ["Rejoin Mode"] = {
        ["Auto Rejoin When Error Module Egg"] = true,
        ["Auto rejoin on script update"] = true,
        ["Enable Rejoin After X Time"] = true,
        ["Rejoin After X Time"] = 60 -- Minutes
    },
    ["Limit Tree"] = 100,
    ["White Screen"] = true
}
 script_key="sODGQPHiISgNdIfWpuWQoqzVtdBZZQeg";
 loadstring(game:HttpGet("https://cdn.shouko.dev/RokidManager/neyoshiiuem/main/gag.lua"))()`
          break;

          // script_key="grPApANcmFyFWdDFPtCZDubYlEJxGQQb";
          // loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/153a62fe6e6f165f8aa4643955297d65.lua"))()`
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
          setfpscap(2)
script_key="vFaTUxSNbgNpDcfvweTZMJWhCllzRHSP";

getgenv().gagConfig = {
    -- Event:
    CRAFT_EVENT = { "Anti Bee Egg" },
    BUY_TRAVELING_MERCHANT = { "Bee Egg", "Loquat", "Feijoa", "Pitcher Plant" },
    PLACE_ALL_EVENT_STAFF = true,
    -- General:
    AUTO_UPDATE_RESTART = true,
    REDEEM_CODES = {},
    EXTRA_PET_SLOTS = 8,
    EXTRA_EGG_SLOTS = 8,
    ADD_FRIEND = true,
    OPEN_ALL_SEED_PACK = true,
    MAX_PLANTS = 120,
    PLACE_COSMETIC = {"Cooking Pot","Cooking Cauldron","Pancake Stack"},
    --event
    CLAIM_FOOD_CONNOISSEUR_REWARD = { "Culinarian Chest", "Gorilla Chef", "Gourmet Egg", "Sunny-Side Chicken", "Pet Shard Aromatic", "Cooking Cauldron", "Gourmet Seed Pack", "Bitter Melon Seed", "Pricklefruit Seed", "Butternut Squash Seed", "Spring Onion Seed", "Kitchen Crate", "Kitchen Flooring", "Kitchen Cart", "Smoothie Fountain" },
    FORCE_COOK_MUTATION_ONLY = true,
    --event
    DESTROY_UNTIL_MIN_PLANTS = 100,
    DELETE_PLANTS_AFTER_MAX = { "Carrot", "Strawberry", "Blueberry", "Tomato", "Apple", "Dragon Fruit","Mango","Cactus","Ember Lily","Pepper","Burning Bud","Coconu"},
    LIMIT_PLANT_SEED = {},
    BUY_EGGS = { "Bug Egg", "Bee Egg", "Paradise Egg", "Mythical Egg", "Rare Summer Egg", "Common Summer Egg", "Rare Egg", "Uncommon Egg" },
    PLANT_EGGS = { "Sprout Egg","Gourmet Egg","Dinosaur Egg", "Zen Egg","Rare Summer Egg", "Primal Egg", "Anti Bee Egg", "Night Egg", "Bug Egg", "Paradise Egg", "Mythical Egg", "Common Summer Egg", "Rare Egg", "Uncommon Egg" },
    --BUY_SEED_SHOP = {"Serenity","Spiked Mango", "Giant Pinecone", "Burning Bud", "Sugar Apple", "Ember Lily", "Beanstalk", "Cacao","Maple Apple","Serenity", "Pepper", "Mushroom", "Grape", "Mango", "Dragon Fruit", "Pumpkin", "Watermelon", ["Dragon Fruit"] = 10,["Coconut"] = 10,["Apple"] = 10,["Cactus"] = 10,["Bamboo"] = 10,["Daffodil"] = 10, ["Tomato"] = 10, ["Orange Tulip"] = 10, ["Blueberry"] = 10, ["Strawberry"] = 10, ["Carrot"] = 10 },
    BUY_SEED_SHOP = {"Grand Tomato",
            "Pepper",
            "Mango",
            "Grape",
            "Beanstalk",
            "Giant Pinecone",
            "Elder Strawberry",
            "Ember Lily",
            "Burning Bud",
            "Sugar Apple",
            "King Cabbage",
            "Taco Fern",
            "Maple Apple",
            "Sunflower",
            "Dragon Pepper",
            "Elephant Ears",
            "Bone Blossom",
            "Fossilight",
            "Tranquil Bloom","Dezen","Lucky Bamboo","Tranquil Bloom","Monoblooma", "Serenity", "Taro Flower", "Zen Rocks", "Hinomai", "Maple Apple", "Zenflare", "Soft Sunshine", "Spiked Mango","Sugar Apple",["Strawberry"] = 10, ["Carrot"] = 10},
    KEEP_SEEDS = {},
    BUY_EVENT_SHOP = { "Zen Egg" ,"Zen Seed Pack","Zenflare ","Soft Sunshine","Spiked Mango" },
    KEEP_SEEDS_AFTER_MAX_PLANTS = {"Dezen","Lucky Bamboo","Tranquil Bloom","Monoblooma", "Serenity", "Taro Flower", "Zen Rocks", "Hinomai", "Maple Apple", "Zenflare", "Soft Sunshine", "Spiked Mango","Carrot", "Strawberry", "Blueberry", "Tomato", "Apple"},
    FAVOURITE_FRUIT_MUTATIONS = {},  -- Stop Autosell
    SKIP_HARVEST_MUTATIONS = {},  -- Stop Harvest
    KEEP_PETS = {["Chicken"] = 5,["Tanchozuru"]= 2,["Kappa"]= 2,"Koi","Seal", "Capybara", "Mimic Octopus", "Meerkat",  "Triceratops", "Stegosaurus", "Pterodactyl",
          "Brontosaurus", "Pachycephalosaurus", "Iguanodon", "Red Fox","Sunny-Side Chicken","Lobster Thermidor","Junkbot","Spaghetti Sloth",["Gorilla Chef"]=4,
           "Hyacinth Macaw", "Axolotl", "Ankylosaurus", "Dilophosaurus","Red Fox", "Dragonfly","Raccoon",
            "Queen Bee", "Disco Bee", "Butterfly", "Dragonfly", "Fennec Fox", "T-Rex","Kitsune", "Corrupted Kitsune","French Fry Ferret","Kodama","Golden Goose"},
    EQUIP_PETS = {["Starfish"] = 3,["Dairy Cow"]= 2,"Sunny-Side Chicken","Koi","Seal","Chicken","Capybara"},
    REMOVE_PET_MAX_UPGRADE = {"Starfish"},
    KEEP_PETS_WEIGHT = { ["Sea Turtle"] = 5,["Ostrich"] = 5,["Stegosaurus"] = 5},
    KEEP_PETS_AGE = {},
    BUY_GEAR_SHOP = { "Master Sprinkler", "Godly Sprinkler", "Advanced Sprinkler", "Basic Sprinkler" ,"Grandmaster Sprinkler"},
    USE_SPRINKLER = { "Basic Sprinkler", "Master Sprinkler", "Godly Sprinkler", "Advanced Sprinkler" },

    PET_WEBHOOK_URL = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
    SEED_WEBHOOK_URL = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
    NOTIFY_PETS = {"Golden Goose", "Lobster Thermidor","Kitsune",},
    NOTIFY_PETS_WEIGHT = 10,
    DISCORD_ID = "663236418499379240",
    WEBHOOK_NOTE = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
    SHOW_WEBHOOK_USERNAME = true,
    SHOW_WEBHOOK_JOBID = true,
}
repeat
    local success, err = pcall(function() loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/c916e5b90dc37c71ecf1ec00dfce3d5d.lua"))() end)
    task.wait(20)
until success`
          break;
          case 'gag-bone1' :
          script =`
                    repeat wait() until game:IsLoaded()
          setfpscap(2)
          spawn(function()
                while wait() do
                  local old = tick()
                  repeat wait() until tick() - old >= 7200
                  game.Players.LocalPlayer:Kick("kick sau 2h")
                end
          end)
              getgenv().ConfigsKaitun = {
                Beta_Fix_Data_Sync = true,
                NoDeletePlayer = false,
                ["Block Pet Gift"] = true,
                Collect_Cooldown = 60, -- cooldown to collect fruit
            JustFuckingCollectAll = false, -- Collect all (fruit not wait mutation)
            ["Low Cpu"] = true,
                ["Auto Rejoin"] = true,
                ["Rejoin When Update"] = true,
                ["Limit Tree"] = {
                  ["Limit"] = 130,
                  ["Destroy Untill"] = 120,
                  ["Safe Tree"] = {
                    "Moon Blossom",
                    "Fossilight",
                    "Tranquil Bloom",
                    "Maple Apple",
                    "Serenity",
                  }
                },

                Seed = {
                  Buy = {
                    Mode = "Auto", -- Custom , Auto
                  Custom = { -- any fruit u need to place
                  "Carrot",
                }
      },
      Place = {
        Mode = "Lock", -- Select , Lock
      Select = {
        "Carrot"
      },
          Lock = {
            "Grand Tomato",
            "Pepper",
            "Mango",
            "Grape",
            "Beanstalk",
            "Giant Pinecone",
            "Elder Strawberry",
            "Ember Lily",
            "Burning Bud",
            "Sugar Apple",
            "King Cabbage",
            "Taco Fern",
            "Maple Apple",
            "Sunflower",
            "Dragon Pepper",
            "Elephant Ears",
            "Bone Blossom",
            "Fossilight",
            "Tranquil Bloom",
          }
    }
    },

      ["Seed Pack"] = {
        Locked = {

        }
      },

      Events = {
            ["Bean Event"] = {
               Minimum_Money = 10_000_000, -- minimum money to start play this event
            },
            Shop = { -- un comment to buy
               "Sprout Egg",
               "Sprout Seed Pack",
               -- "Mandrake",
               "Silver Fertilizer",
               -- "Canary Melon",
               "Spriggan",
               "Amberheart",
            },
            ["Traveling Shop"] = {
               "Bee Egg",
            },
            Craft = {
               "Anti Bee Egg",
            },
            Start_Do_Honey = 2_000_000 -- start trade fruit for honey at money
    },
      ["Traveling Shop"] = {
        "Bald Eagle",
        "Night Staff",
        "Star Caller",
        "Bee Egg",
      },
          Craft = {
            "Primal Egg",
            "Ancient Seed Pack",
            "Bee Egg",
            "Lightning Rod",
            "Anti Bee Egg",
          },
          Shop = {
            "Zen Egg",
            "Pet Shard Tranquil",
            "Pet Shard Corrupted",
          },
          Start_Do_Honey = 2_000_000 -- start trade fruit for honey at money
    },

      Gear = {
        Buy = { "Grandmaster Sprinkler",
          "Tanning Mirror",
          "Master Sprinkler",
          "Godly Sprinkler",
          "Advanced Sprinkler",
          "Basic Sprinkler",
          "Lightning Rod",
          "Level Up Lollipop",
          "Medium Treat",
          "Medium Toy",
        },
        Lock = {"Grandmaster Sprinkler",
        },
      },

          Eggs = {
            Place = {
              "Sprout Egg",
              "Zen Egg",
              "Gourmet Egg",
              "Dinosaur Egg",
              "Primal Egg",
              "Oasis Egg",
              "Anti Bee Egg",
              "Paradise Egg",
              "Night Egg",
              "Bug Egg",
              "Mythical Egg",
              "Rare Summer Egg",
              "Common Summer Egg",
            },
            Buy = {
              "Anti Bee Egg",
              "Oasis Egg",
              "Paradise Egg",
              "Bee Egg",
              "Night Egg",
              "Bug Egg",
              "Mythical Egg",
              "Common Summer Egg",
            }
          },

          Pets = {
            ["Start Delete Pet At"] = 40,
            ["Upgrade Slot"] = {
              ["Pet"] = {
                ["Kodama"] = { 4, 100 ,1},
                ["Starfish"] = { 3, 75, 2 },
                ["Gorilla Chef"] = { 8, 100 ,5},
                ["Sunny-Side Chicken"] = {8, 100},
              },
              ["Limit Upgrade"] = 5, -- max is 5 (more than or lower than 1 will do nothing)
      ["Equip When Done"] = {
        ["Kodama"] = { 4, 100, 1 },
        ["Gorilla Chef"] = { 4, 100 ,2},
        ["Sunny-Side Chicken"] = {3, 100},
        ["Seal"] = { 8, 100 },
      },
    },
      Favorite_LockedPet = true,
          Locked_Pet_Age = 60, -- pet that age > 60 will lock
      Locked = {
        "Golden Goose",
        "Golem",
        "Lobster Thermidor",
        "French Fry Ferret",
        "Spaghetti Sloth",
        "Corrupted Kitsune",
        "Corrupted Kodama",
        "Raiju",
        "Junkbot",
        "Kodama",
        "Kitsune",
        "Koi",
        "Tanchozuru",
        "T-Rex",
        "Spinosaurus",
        "Dragonfly",
        "Night Owl",
        "Queen Bee",
        "Raccoon",
        "Disco Bee",
        "Fennec Fox",
        "Disco Bee",
        "Butterfly",
        "Mimic Octopus",
        "Queen Bee",
        "Red Fox",
        "Blood Owl",
        "Blood Kiwi",
        ["Sunny-Side Chicken"] = 8,
        ["Gorilla Chef"] = 5,
        ["Rooster"] = 5,
        ["Starfish"] = 5,
        ["Capybara"] = 5,
        ["Spriggan"] = 3,
      },
          LockPet_Weight = 7, -- if Weight >= 10 they will locked
    },

      Webhook = {
        UrlPet = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
        UrlSeed = "https://discord.com/api/webhooks/1403381030731124837/wuOqYJVyBwPBDxwksEzg_kIwvbsZERxspZtQzFaeDgZh30aCA7MOGLW2vptRtPk0AcVi",
        PcName = "PC",

        Noti = {
          Seeds = {
          },
          SeedPack = {
            "Idk"
          },
          Pets = {
            "Golden Goose",
            "Lobster Thermidor",
            "Kitsune"
          },
          Pet_Weight_Noti = true,
        },
      }
      License = "sLvWZ0WO0W6OAnGysjVmLtTws1PGYBPP"
      loadstring(game:HttpGet('https://raw.githubusercontent.com/Real-Aya/Loader/main/Init.lua'))()`
      break;
      }
      // if (script_sl === "gag-bone-ayaya"){
      //   script_sl = "gag-bone"
      // }
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
    refreshScript(config = null){
      this.refreshScriptStat = true
      console.log('refreshScript')
      if (config && (config === 'av-auto' || config === 'av-inf')){
        this.avConfig = config
      }
      // const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      // Object.entries(map_device_data).forEach((device,index) => {
      //   if (device[1]?.script){
      //     this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
      //   }
      // })
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const list_data1 = Object.entries(map_device_data)
      console.log("list_data1",list_data1)
      let  list_data = []
      for (let i = 0; i < list_data1.length; i++) {
        const device = list_data1[i]
        console.log("device",device)
          if (device[1]?.script && this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))){
            list_data.push(device)
          }
      }
      let index = 0
      console.log("list_data",list_data)
      const interval = setInterval(() => {
        const device = list_data[index]
        if (device[1]?.script && this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))){
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
        index+=1
        if (index > list_data.length - 1){
          clearInterval(interval)
          alert('refreshScript done');
          this.refreshScriptStat = false
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
      if (option) {
        const gameConfig = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device_id}/configs/${config_id}`, {
          use_private_server: option.private_server,
          join_low_players_server: !option.private_server && !option.join_low_players_server,
          place_id: option.game_id,
        }, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        if (option?.shoukoTrack) {
          const scriptTrack =
              btoa(unescape(encodeURIComponent(`repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
          getgenv().Setting = {
            ["UUID"] = "d6a9706a-34cd-44b5-938a-70e74cee3b13", -- #bot-commands | use /get-uuid
            ['Discord ID'] = '663236418499379240',
            ['Device Name'] = '${this.map_device_id_code[device_id]}'
          }
          loadstring(game:HttpGet('https://cdn.shouko.dev/RokidManager/neyoshiiuem/main/trackstat.lua'))()`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        } else if (option?.yummyTrack) {
          const scriptTrack = btoa(unescape(encodeURIComponent(`_G.Config = { UserID = "08432d86-5203-427d-bab2-298b2ab63da7", discord_id = "663236418499379240" , Note = "${this.map_device_id_code[device_id]}", } loadstring(game:HttpGet("https://raw.githubusercontent.com/skadidau/yummytrack/main/tracker"))()`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
          // map_device_id_code[item.device_id] = item.device_code
        } else if (option?.iscanurTrack) {
          const iscanurTrackWH = "https://discord.com/api/webhooks/1420798690028687514/odwrvmr_uTsMA1A-DExl3tzNR-pnQXibmhQ-AcQPjEeZ_CFj2NfuoHYVWJ-HA6B1viD8"
          const scriptTrack = btoa(unescape(encodeURIComponent(`
          repeat wait(5) until game:IsLoaded() and game:GetService("Players")
          local count = 0
          local Players2 = game:GetService("Players")
local LocalPlayer2 = Players2.LocalPlayer
local HttpService2 = game:GetService("HttpService")
local function SendWebHook()
    count = 21
    local msg = {
        ['content'] = LocalPlayer2.Name
    }
    request({
        Url = "${iscanurTrackWH}",
        Method = "POST",
        Headers = {["Content-Type"] = "application/json"},
        Body = HttpService2:JSONEncode(msg)
    })
end
local function unitCheck()
    local ignore = {
        UICorner = true,
        UIGridLayout = true,
        UIPadding = true,
        BuyMoreSpace = true,
    }
    local unitsFolder = LocalPlayer2:WaitForChild("PlayerGui")
        :WaitForChild("Windows")
        :WaitForChild("Units")
        :WaitForChild("Holder")
        :WaitForChild("Main")
        :WaitForChild("Units")
    for _, child in ipairs(unitsFolder:GetChildren()) do
        if not ignore[child.Name] then
            print("=== Unit:", child.Name)
            for _, sub in ipairs(child:GetDescendants()) do
                if sub:IsA("TextLabel") or sub:IsA("TextButton") then
                    if sub.Text == "Iscanur (Pride)" then
                        SendWebHook()
                    end
                end
            end
        end
    end
end
repeat
    task.wait(10)
    count = count + 1
    unitCheck()
until count > 19
`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        } else if (option?.gem50ktrack) {
          const gem50ktrackWH = "https://discord.com/api/webhooks/1423567297662156821/NUoS2xZXlOcifOySiTAE2i0o5_p9CWILhb3FxPue79R9at1BnGcNTb7BOtB4F-2wAeCD"
          const scriptTrack = btoa(unescape(encodeURIComponent(`
          local count = 0
                    local Players2 = game:GetService("Players")
local LocalPlayer2 = Players2.LocalPlayer
local HttpService2 = game:GetService("HttpService")
local function SendWebHook()
    count = 21
    local msg = {
        ['content'] = LocalPlayer2.Name
    }
    request({
        Url = "${gem50ktrackWH}",
        Method = "POST",
        Headers = {["Content-Type"] = "application/json"},
        Body = HttpService2:JSONEncode(msg)
    })
end
local function safeRequire(m)
    local ok, mod = pcall(require, m)
    if ok then return mod end
    warn("StartQuest require error:", mod)
    return nil
end
local function num(v) return (typeof(v) == "number") and v or 0 end
local function getCurrencies()
    local ch = safeRequire(game.StarterPlayer.Modules.Gameplay.CurrencyHandler)
    if ch and typeof(ch.GetCurrencies) == "function" then
        local ok, tbl = pcall(function() return ch:GetCurrencies() end)
        if ok and typeof(tbl) == "table" then
            return tbl
        end
    end
    return {}
end
local function gemcheck()
    local c = getCurrencies()
    local gems = num(c.Gems or c.Gem or c.gems)
    local level = game.Players.LocalPlayer:GetAttribute("Level")
    if gems > 1 and level > 1 then
       count = 21
       if gems > 50000 and level > 30 then
          SendWebHook()
       end
    end
end
repeat
    task.wait(10)
    count = count + 1
    gemcheck()
until count > 19
`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        } else if (option?.gem100ktrack) {
          const gem100ktrackWH = "https://discord.com/api/webhooks/1423567389534060554/eVMH-V7-9CQD5AX5QqZF3WgpBFB3dqIOT_sSqkQfHJFVJcJa-ugOh2xOZTf1LzSVnTZt"
          const scriptTrack = btoa(unescape(encodeURIComponent(`local count = 0
                    local Players2 = game:GetService("Players")
local LocalPlayer2 = Players2.LocalPlayer
local HttpService2 = game:GetService("HttpService")
local function SendWebHook()
    count = 21
    local msg = {
        ['content'] = LocalPlayer2.Name
    }
    request({
        Url = "${gem100ktrackWH}",
        Method = "POST",
        Headers = {["Content-Type"] = "application/json"},
        Body = HttpService2:JSONEncode(msg)
    })
end
local function safeRequire(m)
    local ok, mod = pcall(require, m)
    if ok then return mod end
    warn("StartQuest require error:", mod)
    return nil
end
local function num(v) return (typeof(v) == "number") and v or 0 end
local function getCurrencies()
    local ch = safeRequire(game.StarterPlayer.Modules.Gameplay.CurrencyHandler)
    if ch and typeof(ch.GetCurrencies) == "function" then
        local ok, tbl = pcall(function() return ch:GetCurrencies() end)
        if ok and typeof(tbl) == "table" then
            return tbl
        end
    end
    return {}
end
local function gemcheck()
    local c = getCurrencies()
    local gems = num(c.Gems or c.Gem or c.gems)
    local level = game.Players.LocalPlayer:GetAttribute("Level")
    if gems > 1 and level > 1 then
       count = 21
       if gems > 100000 and level > 70 then
          SendWebHook()
       end
    end
end
repeat
    task.wait(10)
    count = count + 1
    gemcheck()
until count > 19
`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        } else {
          const scriptTrack = btoa(unescape(encodeURIComponent(`--no track`)))
          const script_id = await this.getData(device_id, "script_id2");
          if (!script_id) {
            const resSetScript = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          } else {
            const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${config_id}/scripts/${script_id}`, {
              "script_name": "scriptTrack",
              script_data: scriptTrack
            }, {
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
