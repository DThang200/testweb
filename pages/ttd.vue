<template>
<main class="page-content">
  <template  v-if="$config.DEVICE_ROLE === 'manager'">
    <button type="button" @click="refreshScript()">
      Refresh script
    </button>
    <div style="display: flex;flex-direction: row;gap: 8px">
      Menu
      <nuxt-link to="/setup-key">
        Setup Keys
      </nuxt-link>
      -
      <nuxt-link to="/history">
        History
      </nuxt-link>
    </div>
  </template>
  <template  v-if="$config.DEVICE_ROLE === 'manager'">
    <div style="display: flex;flex-direction: row;gap: 20px;margin-top: 40px">
      <div style="display: flex;flex-direction: row;gap: 5px">
        <input v-model="AutoBuyCrate" id="AutoBuyCrate" type="checkbox">
        <label for="AutoBuyCrate">AutoBuyCrate</label>
      </div>
    </div>
  </template>
  <div style="margin-left: auto;font-size: 24px" :style="`${$config.DEVICE_ROLE === 'manager' ? '' : 'transform: scale(3);margin-bottom: 32px'}`">
    <button @click="StopAll">StopAll</button>
    <button @click="PlayAll">PlayAll</button>
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
        // {code : 'ttd-pvp-lindseychristopher76',label : 'TTD-PvP-lind',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-marylopez355',label : 'TTD-PvP-mary',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-angelacardenas989',label : 'TTD-PvP-angel',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-uevans031',label : 'TTD-PvP-uevans031',game_id: '13775256536',private_server : false},
        // {code : 'ttd-drill-carrie79912',label : 'TTD-Drill-carrie',game_id: '13775256536',private_server : false},
        // {code : 'ttd-drill-wharris187',label : 'TTD-Drill-wharis',game_id: '13775256536',private_server : false},
        // {code : 'ttd-dice-richardbarrett314',label : 'TTD-Dice-richar',game_id: '13775256536',private_server : false},
        // {code : 'ttd-dice-uevans031',label : 'TTD-Dice-uevan',game_id: '13775256536',private_server : false},
        // {code : 'ttd-pvp-CyanSabrinad410',label : 'TTD-PvP-GOM',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-wendy86083',label : 'TTD-Noel-wendy86083',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-nduarte6',label : 'TTD-Noel-nduarte6',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-robert72304',label : 'TTD-Noel-robert72304',game_id: '13775256536',private_server : false},
        // // {code : 'ttd-noel-sally10633',label : 'TTD-Noel-sally10633',game_id: '13775256536',private_server : false},
        // // {code : 'ttd-noel-carrie79912',label : 'TTD-Noel-carrie79912',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-wharris187',label : 'TTD-Noel-wharris187',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-richardbarrett314',label : 'TTD-Noel-richardbarrett314',game_id: '13775256536',private_server : false},
        // {code : 'ttd-noel-rjohnson700',label : 'TTD-Noel-rjohnson700',game_id: '13775256536',private_server : false},
        // {code : 'ttd-drill-JordanKristig29',label : 'TTD-Drill-Gom',game_id: '13775256536',private_server : false},

        {code : 'ttd-noel',label : 'TTD-Noel',game_id: '13775256536',private_server : false},
        {code : 'ttd-pvp',label : 'TTD-PvP',game_id: '13775256536',private_server : false},
        {code : 'ttd-noel-Thangcachepp04',label : 'TTD-Noel-Main',game_id: '13775256536',private_server : false},
      ],
      option: {
        "ttd-noel" : {
          count: 0,
          listUser : ['BergerTrevorm09','JohnsKayleea9','JamesSonyas49','LawrenceTamarak887','RossCherylj50']
        },
        "ttd-pvp" : {
          count: 0,
          listUser : ['RichardsMiguelo9268','TylerJoshuab1089','MullinsSophiak93','KimSheliat648','RangelAngies069']
          //'GambleSusanx8714','KellyEmilyf3450' , 'JacksonJefferyz4194','CobbAmyg72','MontoyaLeafp680','HardyDebraa4','HammondMistyf089','GoodmanKendrae129'
          //lucky acc : CowanJoannat2 JacksonJefferyz4194
          //sell acc : AyalaGracef2940 GoodmanKendrae129 GambleSusanx8714 SandovalKiarax4479
        },
      },
      autoGomActive: [],
      autoGomFrom: '',
      autoGomTo: '',
      autoGomLastCurrent: 0,
      editDevice: '',
      sortInactive: false,
      roblox_data: [],
      is_auto_gom: false,
      intervalId: null,
      AutoBuyCrate: false,
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
    setFarmScript(device_id,device_name,script_sl = 'lava',option=null){
      const token = this.map_key_token_farm.find(data => data.key == device_name)?.token
      const nousigi = this.map_key_token_farm.find(data => data.key == device_name)?.nousigi || "keabc481d8e57b0bc872c89d"
      let script = ''
      let scriptOption = {}
      this.farmOption.forEach(option => {
        if (option?.code === script_sl){
          scriptOption = option
        }
      })
      let user_collect = this.option[script_sl].listUser[this.option[script_sl]?.count || 0]
      if (this.option[script_sl].count >= this.option[script_sl].listUser?.length - 1){
        this.option[script_sl].count = 0
      } else {
        this.option[script_sl].count += 1
      }
      let marcoUrl = ''
      let SelectMacro = 'message'
      let SelectBuyCrate = ''
      let SelectMap = ''
      let AutoJoinPVP = false
      let AutoJoinMatch = true
      let AutoReplay = true
      let AutoReturnToLobby = false
      let WH_MatchComplete = false
      let AutoBuyCrate = this.AutoBuyCrate
      let EventType = 'Drill Type'
      let SelectDifficulty = 'Easy'
      if (script_sl === 'ttd-pvp'){
        marcoUrl = 'https://raw.nousigi.com/macro/663236418499379240_7c038bccd00ca3d2ac9f7e51f54cc430.json?macroname=abc'
        SelectMacro= 'abc'
        SelectBuyCrate = 'GoldenGladiatorCrate'
        AutoJoinPVP = true
        AutoJoinMatch = false
        AutoReturnToLobby = true
        WH_MatchComplete= true
      }
      if (script_sl === 'ttd-noel'){
        marcoUrl = 'https://raw.nousigi.com/macro/458441366834249728_e76526c5469acc12a8e872ea6cd59abd.json?macroname=test123'
        SelectMacro= 'test123'
        SelectBuyCrate = 'ChristmasCrate'
        SelectMap= 'Christmas2024'
        WH_MatchComplete= true
      }
      if (script_sl.includes('ttd-drill')){
        marcoUrl = 'https://raw.nousigi.com/macro/663236418499379240_7c038bccd00ca3d2ac9f7e51f54cc430.json?macroname=abc'
        SelectMacro= 'abc'
        SelectBuyCrate = 'UltraDrillCrate'
        SelectMap= 'DrillWorld'
        WH_MatchComplete= true
        AutoReturnToLobby = true
        // AutoJoinMatch = false
      }
      if (script_sl.includes('ttd-dice')){
        SelectBuyCrate = 'RNGCrate'
        SelectMap= 'DiceWorld'
      }

      script = `getgenv().Key = "${nousigi}"
                      getgenv().ImportMacro = {
                          "${marcoUrl}"
                      }
                      getgenv().EquipMacroTroop = true
                      getgenv().Config = {
                        ["JoinFailsafe"] = true,
                        ["AutoSave"] = true,
                        ["SellRarities"] = {
                          ["Legendary"] = true,
                          ["Basic"] = true,
                          ["Epic"] = true,
                          ["Mythic"] = false,
                          ["Uncommon"] = true,
                          ["Rare"] = true
                        },
                        ["DelayReplay"] = 5,
                        ["EventType"] = "${EventType}",
                        ["WH_MatchComplete"] = ${WH_MatchComplete},
                        ["AutoSkip"] = true,
                        ["AutoClaimQuest"] = true,
                        ["TPLobbyIfPlayer"] = false,
                        ["SelectBuyCrate"] = "${SelectBuyCrate}",
                        ["BuyAmount"] = "Buy3",
                        ["WH_MailSent"] = true,
                        ["IgnoreMacroTiming"] = true,
                        ["SelectMacro"] = "${SelectMacro}",
                        ["ALFS_DelayHop"] = 30,
                        ["AutoVoteDifficulty"]=true,
                        ["SelectDifficulty"]="${SelectDifficulty}",
                        ["BuyCrateName"] = "${user_collect}",
                        ["AutoClaimPlaytimeReward"] = true,
                        ["PlaceFailsafe"] = true,
                        ["AutoJoinEndless"] = false,
                        ["PlayMacro"] = true,
                        ["AutoBuyCrate"] = ${AutoBuyCrate},
                        ["AutoMail"] = true,
                        ["BoostFPS"] = true,
                        ["Summon10"] = false,
                        ["AutoUseBoost"] = false,
                        ["AutoJoinPVP"] = ${AutoJoinPVP},
                        ["AutoReturnToLobby"] = ${AutoReturnToLobby},
                        ["AutoReplay"] = ${AutoReplay},
                        ["ABE_Gift"] = false,
                        ["BlackScreen"] = false,
                        ["SellWave"] = 1,
                        ["AutoClaimEventPass"] = false,
                        ["DelayJoin"] = 25,
                        ["DeleteMap"] = true,
                        ["RequireRoll"] = 0,
                        ["AutoJoinMatch"] = ${AutoJoinMatch},
                        ["ALFS_HopServer"] = false,
                        ["UseAll"] = false,
                        ["SelectCase"] = "BasicCrate",
                        ["AutoSellOW"] = false,
                        ["WalkAround"] = true,
                        ["MailName"] = "Thangcachepp04",
                        ["AutoClaimVIP"] = false,
                        ["AutoBuyEvent"] = false,
                        ["AutoListForSale"] = false,
                        ["AutoVoteDifficulty"] = false,
                        ["AutoClaimEventQuest"] = true,
                        ["AutoRejoin"] = true,
                        ["WebhookURL"] = "https://discord.com/api/webhooks/1326094822334795816/8e60M7JGQVcmU4s-_Ze2FLV4JyprHgen8FufjYDlIKcnzYF1-2d7M2e98TLjl6SDYLHa",
                        ["SummonDelay"] = 0.3,
                        ["SelectMap"] = "${SelectMap}",
                        ["AutoClaimDailyReward"] = true,
                        ["GiftCrate"] = true,
                        ["RequiredGem"]=500,
                        ["UseBoosts"] = {
                          ["2xLuckBoost_1"] = false,
                          ["2xEggsBoost"] = false,
                          ["2xLuckBoost_10"] = false,
                          ["2xHalloweenCandyBoost_1"] = false,
                          ["2xEventXPBoost"] = false,
                          ["2xXPBoost"] = false,
                          ["2xCoinsBoost"] = false,
                          ["2xClocksBoost"] = false,
                          ["2xCoinsBoost_1"] = false,
                          ["2xHalloweenCandyBoost_10"] = false,
                          ["2xEventXPBoost_1"] = false,
                          ["2xHalloweenEventXPBoost"] = false,
                          ["Weekend_2xCoinsBoost"] = false,
                          ["2xXPBoost_10"] = false,
                          ["2xCoinsBoost_10"] = false,
                          ["2xXPBoost_Easter2024"] = false,
                          ["2xCloversBoost"] = false,
                          ["2xLuckBoost"] = false,
                          ["Weekend_2xEndlessXPBoost"] = false,
                          ["2xEventXPBoost_10"] = false,
                          ["2xDrillBoost"] = true,
                          ["2xDrillXPBoost"] = true,
                          ["2xXPBoost_1"] = false,
                          ["2xHalloweenCandyBoost"] = false
                        },
                        ["AutoSummonTroop"] = false
                      }
                      repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`

      this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))),scriptOption)
      this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label + '           ----' + user_collect})
      this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
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
    initData() {
      this.intervalId = setInterval(() => {
        this.getDataRoblox()
      }, this.$config.INTERVAL_TIME);
    },
    getStatusClass(data = null){
      if (!(data?.total_accounts > 0)) {
        return 'disable'
      }
      if (data?.inactive){
        if (data?.inactive > 10) {
          return 'danger'
        } else if (data?.inactive > 5){
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
    refreshScript(){
      const correctPassword = "matkhau123@"; // Mật khẩu cố định
      const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");

      if (userPassword !== correctPassword) {
        alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
        return false
      }
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      Object.entries(map_device_data).forEach((device,index) => {
        if (device[1]?.script && device[1]?.script.includes('ttd-')){
          console.log('refreshScript',device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
      })
    },
    async PlayAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        if (device[1]?.script && device[1]?.script.includes('ttd-')) {
          const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device[0]}/start`, {},{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
    },
    async StopAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        if (device[1]?.script && device[1]?.script.includes('ttd-')) {
          const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device[0]}/stop`, {},{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
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
    }
  }
};
</script>

<style>
</style>
