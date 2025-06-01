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
  <select v-model="showOption">
    <option value="">All</option>
    <option value="ttd">TTD</option>
    <option value="gag">GAG</option>
    <option value="bgsi">BGSI</option>
  </select>
  <template  v-if="$config.DEVICE_ROLE === 'manager'">
    <div style="display: flex;flex-direction: row;gap: 20px;margin-top: 40px">
      <div style="display: flex;flex-direction: row;gap: 5px">
        <input v-model="rollUnit" id="rollUnit" type="checkbox">
        <label for="rollUnit">RollUnit</label>
        <input v-model="AutoBuyCrate" id="AutoBuyCrate" type="checkbox">
        <label for="AutoBuyCrate">AutoBuyCrate</label>
        <input v-model="userCollectCreate" type="text" placeholder="User collect">
        <button @click="autoEnableDevice(!isIntervalEnable)">Auto enable <span v-if="isIntervalEnable">(active)</span></button>
        <button @click="enableDevice">Enable Device</button>
        <button @click="refreshScriptBgsi('nsg')">BGSI NSG</button>
        <button @click="refreshScriptBgsi('exodus')">BGSI Exodus</button>
        <button @click="autoPlay5game">Play 5 game <span v-if="isPlay5game">(active)</span> </button>
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
    <div v-for="data in roblox_data.devices" class="remote-pc-item" v-if="hideDevice.includes(data.device_name) && data?.script && (!showOption || data?.script.includes(showOption))" :class="getStatusClass(data)" :key="data.device_code" :style="`${$config.DEVICE_ROLE === 'manager' ? 'padding: 0 24px' : 'font-size: 32px'}`">
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
        if (this.sortInactive){
          let data = JSON.parse(JSON.stringify(value))
          if (data?.devices && data?.devices.length > 0){
            data.devices.sort((a, b) => b.inactive_accounts - a.inactive_accounts)
            data.devices.forEach(device => {
              device.script = map_device_data[device?.device_id]?.script || ""
              if (device?.running && this.hideDevice.includes(device?.device_name)){
                this.activeDevice.push(device?.device_id)
              }
            })
            this.roblox_data = data
          }
        } else {
          this.roblox_data = JSON.parse(JSON.stringify(value))
        }
        console.log("activeDevice",this.activeDevice)
      },deep: true
    }
  },

  beforeDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    this.endTaskAutoGom();
    clearInterval(this.intervalEnable);
    clearInterval(this.intervalId);
    clearInterval(this.interval_auto_gom);
    clearInterval(this.interval_auto_gom_time);
    clearTimeout(this.autoPlay5gameTimeout);
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
        {code : 'ttd-drill',label : 'TTD-Drill',game_id: '13775256536',private_server : false},
        {code : 'ttd-time',label : 'TTD-Time',game_id: '13775256536',private_server : false},
        {code : 'ttd-noel',label : 'TTD-Noel',game_id: '13775256536',private_server : false},
        {code : 'ttd-pvp',label : 'TTD-PvP',game_id: '13775256536',private_server : false},
        {code : 'petgum',label : 'PetGum',game_id: '85896571713843',private_server : false},
        {code : 'play5game',label : 'Play5game',game_id: '9921763607',private_server : false},
        {code : 'ttd-create',label : 'TTD-OpenCreateCustom',game_id: '85896571713843',private_server : false},
        {code : 'ttd-noel-Thangcachepp04',label : 'TTD-Noel-Main',game_id: '13775256536',private_server : false},
        {code : 'awp-gag',label : 'Grow a Garden -AWP',game_id: '126884695634066',private_server : false, yummyTrack : "https://raw.githubusercontent.com/skadidau/unfazedfree/refs/heads/main/gag"},
        {code : 'awp-bgsi',label : 'BGSI -AWP',game_id: '85896571713843',private_server : false, yummyTrack : "https://raw.githubusercontent.com/skadidau/unfazedfree/refs/heads/main/gag"},
      ],
      option: {
        "awp-bgsi" : {
          count: 0,
          listUser : ['Thangcachepp01']
        },
        "awp-gag" : {
          count: 0,
          listUser : ['Thangcachepp01']
        },
        "petgum" : {
          count: 0,
          listUser : ['Thangcachepp02','Thangcachepp04']
        },
        "ttd-create" : {
          count: 0,
          listUser : ['']
        },
        "ttd-time" : {
          count: 0,
          listUser : ['']
        },
        "ttd-noel" : {
          count: 0,
          listUser : ['JamesSonyas49','LawrenceTamarak887']
        },
        "ttd-pvp" : {
          count: 0,
          // listUser : ['TrungHien_2011']
          listUser : ['120991bl']
          //ReedKarlad31 EnglishOctopust44
        },
      },
      autoGomActive: [],
      autoGomFrom: '',
      autoGomTo: '',
      autoGomLastCurrent: 0,
      editDevice: '',
      sortInactive: true,
      roblox_data: [],
      is_auto_gom: false,
      intervalId: null,
      AutoBuyCrate: true,
      interval_auto_gom: null,
      interval_auto_gom_device_name: "",
      interval_auto_gom_time: null,
      interval_auto_gom_time_count: 5400,
      interval_auto_gom_timeInterVal: 5400,
      userCollectCreate: '',
      hideDevice: [],
      intervalEnable: null,
      isIntervalEnable: false,
      rollUnit: false,
      activeDevice: [],
      petgumScript: 'exodus',
      showOption: '',
      isPlay5game: false,
      autoPlay5gameTimeout : null
    }
  },
  async mounted() {
    this.hideDevice =  JSON.parse(localStorage.getItem('hideDevice')) || [];
    this.userCollectCreate =  JSON.parse(localStorage.getItem('userCollectCreate')) || '';
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
      if (this.userCollectCreate) {
        this.option[script_sl].listUser = this.userCollectCreate.split(',')
      }
      if (this.option[script_sl].count >= this.option[script_sl].listUser?.length - 1){
        this.option[script_sl].count = 0
      } else {
        this.option[script_sl].count += 1
      }
      if (script_sl.includes("ttd-")){

      }
      let marcoUrl = ''
      let SelectMacro = ''
      let WebhookURL = JSON.parse(localStorage.getItem('webhookUrl')) || 'https://discord.com/api/webhooks/1364687929951387710/M1-OFBPn3poDRjVmzTjHSZ9bxGYLiXVyKA9SVYkFgvAZvDD6mIzuZ5BnIuA-K_m9iCSR'
      let WebhookCreate = 'https://discord.com/api/webhooks/1326099391630540863/F24-G3lDKUaRWQqCp3TiTE71fyJY2MVjh0n6RrXagbNqB0eUY5BJDXMD1_Djct7_Vpf9'
      let SelectOpenCrate = ''
      let SelectBuyCrate = ''
      let SelectMap = ''
      let AutoJoinPVP = false
      let AutoJoinMatch = true
      let AutoReplay = true
      let AutoVoteDifficulty = true
      let AutoReturnToLobby = false
      let WH_MatchComplete = false
      let AutoSummonTroop = true
      let PVPMarcoRed = "https://raw.nousigi.com/macro/663236418499379240_bbb5d13218ac54a804da9cf427404d3a.json?macroname=m1"
      let WH_Clone = "https://discord.com/api/webhooks/1347963702598701137/VhJNEyCY8DO4MozFw_s8XxNSkejHK-AOOQ4qKeAwEr9ineqH8m25gjYCQg2ATxaYKKkn"
      let BlueMacro = "m1"
      let AutoBuyCrate = this.AutoBuyCrate
      let EventType = 'Drill Type'
      let SelectDifficulty = 'Easy'
      if (script_sl === 'ttd-pvp'){
        marcoUrl = 'https://raw.githubusercontent.com/DThang200/testweb/refs/heads/main/static/css/abc/oidoioi.json'
        BlueMacro= 'Macro9Action'
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
      }

      if (script_sl === 'ttd-drill'){
        marcoUrl = 'https://raw.nousigi.com/macro/663236418499379240_7c038bccd00ca3d2ac9f7e51f54cc430.json?macroname=test'
        SelectMacro= 'test'
        SelectBuyCrate = 'UltraDrillCrate'
        SelectMap= 'DrillWorld'
        AutoReturnToLobby = true
        // AutoReplay = false
        // AutoJoinMatch = true
      }
      if (script_sl === 'ttd-time'){
        marcoUrl = 'https://cdn.discordapp.com/attachments/1294178906987036732/1327943269686181979/message.txt?ex=6784e70b&is=6783958b&hm=33cdacca4020d45933bb1ee0b9eeeb2d52109ed432ec9350251a797702fca386&'
        SelectMacro= 'message'
        WH_MatchComplete= true
        AutoReplay = true
        SelectBuyCrate = ''
        SelectMap= 'TimeFactory'
      }
      // if (script_sl === 'ttd-pvp'){
      //   WH_MatchComplete= true
      //   AutoReplay = true
      //   SelectBuyCrate = 'CherryBlossomCrate'
      //   SelectMap= 'MountFuji'
      // }
      if (this.rollUnit){
        AutoJoinMatch = false
        AutoJoinPVP = false
        AutoReturnToLobby = true
        AutoSummonTroop = true
      }
      if (script_sl.includes('ttd-dice')){
        SelectBuyCrate = 'RNGCrate'
        SelectMap= 'DiceWorld'
      }

      script = `getgenv().Key = "${nousigi}"
                      getgenv().EquipMacroTroop = true
                      getgenv().ImportMacro = {
                          "${marcoUrl}",
                          "${PVPMarcoRed}"
                      }
                      getgenv().Config = {
                        ["JoinFailsafe"] = true,
                        ["AutoSave"] = true,
                        ["SellRarities"] = {
                          ["Legendary"] = true,
                          ["Basic"] = true,
                          ["Epic"] = true,
                          ["Mythic"] = true,
                          ["Uncommon"] = true,
                          ["Rare"] = true
                        },
                        ["SelectPVPMacro"] = {
                          ["Blue"] = "${BlueMacro}",
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
                        ["Summon10"] = true,
                        ["AutoJoinPVP"] = ${AutoJoinPVP},
                        ["AutoReturnToLobby"] = ${AutoReturnToLobby},
                        ["AutoReplay"] = ${AutoReplay},
                        ["ABE_Gift"] = false,
                        ["BlackScreen"] = false,
                        ["SellWave"] = 1,
                        ["AutoClaimEventPass"] = false,
                        ["DelayJoin"] = 25,
                        ["DeleteMap"] = true,
                        ["RequireRoll"] = 10,
                        ["AutoJoinMatch"] = ${AutoJoinMatch},
                        ["ALFS_HopServer"] = false,
                        ["SelectCase"] = "MythicCrate",
                        ["AutoSellOW"] = false,
                        ["WalkAround"] = true,
                        ["MailName"] = "may2vs187036",
                        ["AutoClaimVIP"] = false,
                        ["AutoBuyEvent"] = false,
                        ["AutoListForSale"] = false,
                        ["AutoClaimEventQuest"] = true,
                        ["AutoRejoin"] = true,
                        ["WebhookURL"] = "${WebhookURL}",
                        ["SummonDelay"] = 1,
                        ["SelectMap"] = "${SelectMap}",
                        ["AutoClaimDailyReward"] = true,
                        ["GiftCrate"] = true,
                        ["RequiredGem"]=500,
                        ["AutoDeleteTroop"]=true,
                        ["AutoUseBoost"] = true,
                        ["UseAll"] = true,
                        ["UseBoosts"] = {
                          ["2xCoinsBoost_1"] = true,
                          ["2xLuckBoost_1"] = true,
                        },
                        ["SelectTroop"] = {
                          ["ToyClockman"] = true,
                          ["KneeSurgeryClockman"] = true,
                          ["ChariotCameraman"] = true,
                          ["TitanSnowman"] = true,
                          ["CandyCaneCameraman"] = true,
                          ["PresentSpeakerman"] = true,
                          ["GladiatorSpeakerman"] = true,
                          ["BarbarianLargeTVMan"] = true,
                        },
                        ["AutoOpenCrate"] = true,
                        ["SelectCrate"] = {
                          ["ActivityCrate"] = true,
                        },
                        ["AutoSummonTroop"] = ${AutoSummonTroop}
                      }
                      repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`
      if (script_sl === 'ttd-time2'){
        SelectOpenCrate = 'Time'
        script = `getgenv().Webhook = '${WH_Clone}'
        repeat wait() until game:IsLoaded()
        repeat wait() until game.Players.LocalPlayer
        local Plr = game.Players.LocalPlayer
        repeat wait() until Plr.Character
        repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
        repeat wait() until Plr.Character:FindFirstChild("Humanoid")
        local Plrgui =game:GetService("Players").LocalPlayer.PlayerGui
        function CheckRarity(rarity)
           if rarity =="Ultimate" or rarity=="Godly" then
                 return true
           end
           return false
        end
        function SendWebHook(v)
           local msg = {
               ['content'] = "@everyone",
               ["embeds"] = {{
                   ["title"] = "Thangcachepp",
                   ["description"] = "Crate Opened",
                   ["type"] = "rich",
                   ["color"] = tonumber(0xbdce44),
                   ["fields"] = {
                       {
                           ["name"] = "User",
                           ["value"] = string.sub(game.Players.LocalPlayer.Name, 1, 5).. "...",
                           ["inline"] = false
                       },
                       {
                           ["name"] = "Name",
                           ["value"] = v.Holder.UnitName.Text,
                           ["inline"] = true
                       },
                       {
                           ["name"] = "Rarity",
                           ["value"] = v.Holder.RarityFrame.Rarity.Text,
                           ["inline"] = true
                       },

                   }
               }}
           }
           request({
               Url = getgenv().Webhook,
               Method = "POST",
               Headers = {["Content-Type"] = "application/json"},
               Body = game:GetService("HttpService"):JSONEncode(msg)
           })
        end
        Plrgui.ResultsGui.TroopResultsFrame.SummonResults.ChildAdded:connect(function(Unit)
              if Unit:IsA("Frame") then
                 if CheckRarity(Unit.Holder.RarityFrame.Rarity.Text) then
                       SendWebHook(Unit)
                 end
              end

        end)`
      }
      if (script_sl === 'petgum'){
        user_collect = this.petgumScript
        if (this.petgumScript === 'nsg'){
          script =
              `
        getgenv().Key = "${nousigi}"
        getgenv().Config = {
          ["Potions"] = {
            ["Use Potions"] = {
              ["Enable"] = true,
              ["Potions"] = {
                ["Coins II"] = true,
                ["Speed Evolved"] = true,
                ["Coins IV"] = true,
                ["Lucky IV"] = true,
                ["Lucky III"] = true,
                ["Mythic Evolved"] = true,
                ["Coins V"] = true,
                ["Coins I"] = true,
                ["Mythic II"] = true,
                ["Coins Evolved"] = true,
                ["Lucky V"] = true,
                ["Speed V"] = true,
                ["Speed IV"] = true,
                ["Mythic V"] = true,
                ["Mythic I"] = true,
                ["Lucky II"] = true,
                ["Coins III"] = true,
                ["Speed I"] = true,
                ["Speed II"] = true,
                ["Infinity Elixir"] = true,
                ["Lucky Evolved"] = true,
                ["Speed III"] = true,
                ["Lucky I"] = true,
                ["Mythic IV"] = true,
                ["Mythic III"] = true
              }
            }
          },
          ["Hatcher"] = {
            ["Egg"] = "Nightmare Egg",
            ["Hatch Location"] = "Island",
            ["Auto Hatch"] = true
          },
          ["Webhook"] = {
            ["Egg Hatched"] = {
              ["Enable"] = true,
              ["Chance"] = 200000
            },
            ["URL"] = "https://discord.com/api/webhooks/1364674373923115060/HXZVGwwSaI1ok5uTwxhDhyOKNd9eOiJImpJhLnJAOeqSqIYiNPVqgTTJ5M8CtaDhhnxJ"
          },
          ["Upgrade"] = {
            ["Auto Flavor"] = false,
            ["Auto Gum"] = false,
            ["Auto Mastery"] = true
          },
          ["Rift Hatcher"] = {
            ["Egg"] = {
              ["Bunny Egg"] = true,
              ["Pastel Egg"] = true,
              ["Nightmare Egg"] = true,
              ["Void Egg"] = true
            },
            ["Auto Hatch Rift"] = true
          },
          ["Islands"] = {
            ["Unlock Islands"] = true,
            ["Island Hop"] = {
              ["Enable"] = false,
              ["Cooldown"] = 7,
              ["Islands"] = {
                ["The Void"] = true
              }
            }
          },
          ["Chest"] = {
            ["Auto Royal Chest"] = true,
            ["Auto Golden Chest"] = true,
            ["Required Open Chest"] = 100
          },
          ["Shop"] = {
            ["Auto Alien Shop"] = {
              ["Enable"] = true,
              ["Product"] = {
                ["Mystery Box"] = true
              }
            },
            ["Auto Black Market"] = {
              ["Enable"] = true,
              ["Product"] = {
                ["Coins Evolved"] = false,
                ["Mythic Evolved"] = true,
                ["Lucky Evolved"] = true,
                ["Speed Evolved"] = false
              }
            }
          },
          ["Aura Hatcher"] = {
            ["Auto Hatch Aura"] = true
          },
          ["Automation"] = {
            ["Auto Gift"] = true,
            ["Auto Blow"] = false,
            ["Auto Pickup"] = true,
            ["Auto Sell"] = false
          },
          ["Claimer"] = {
            ["Auto Playtime"] = true,
            ["Auto Doggy Jump"] = true,
            ["Auto Wheel Spin"] = true,
            ["Auto Season"] = true,
            ["Auto Chest"] = true,
            ["Auto Quest"] = true,
            ["Auto Index"] = true
          },
          ["Inventory"] = {
            ["Auto Equip Best"] = true,
            ["Auto Delete"] = {
              ["Enable"] = true,
              ["Rarity"] = {
                ["Unique"] = true,
                ["Common"] = true,
                ["Epic"] = true,
                ["Rare"] = true
              },
              ["Chance"] = 2000
            }
          },
          ["Performance"] = {
            ["Disable Hatch Animation"] = true,
            ["Boost FPS"] = true,
            ["Disable Popups"] = true,
            ["Black Screen"] = false
          },
          ["Powerups"] = {
            ["Auto Golden Orb"] = true,
            ["Auto Mystery Box"] = true
          }
        }
        repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`
        }else {
          script =`getgenv().Settings = {
            ["Egg Settings"] = {
              OpenEggs = true,
              Egg = "Best",

              ["Notifications"] = {
                Webhook = "https://discord.com/api/webhooks/1364674373923115060/HXZVGwwSaI1ok5uTwxhDhyOKNd9eOiJImpJhLnJAOeqSqIYiNPVqgTTJ5M8CtaDhhnxJ",
                DiscordID = 663236418499379240,
                Difficulty = 100000,
              },
              ["Rifts"] = {
                FindRifts = true,
                SortByMultiplier = true, --// false will still sort multi, but out of BEST egg.
              Targets = {"Pastel Egg", "Bunny Egg", "Nightmare Egg"},
          --// No targets will let the script automatically find the top 3 best eggs.
        },
        },

          ["Enchant Settings"] = {
            EnchantPets = false,

            ["Require All Enchants"] = true,
            ["Enchants Needed"] = {
              ["Team Up"] = {Tier = 1, HigherTiers = true},
            },
          },
              ["Debug"] = {
                DisableUI = false,
              },
        }
          repeat wait() until game:IsLoaded()
          loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/aab9fba1c9d41f8edf82e1d0bd14b1ea.lua"))()`
        }
      }
      if (this.isPlay5game){
        script =
            ` repeat wait() until game:IsLoaded()
              local TeleportService = game:GetService("TeleportService")
              local Players = game:GetService("Players")
              local Player = Players.LocalPlayer
              --default 9921763607
              local placeIds = {
                  9921763607,
                  116495829188952,
                  124938816195155,
                  98576266411293,
                  12877981041,
              }

              local function findCurrentIndex()
                  local currentPlaceId = game.PlaceId
                  for i, id in ipairs(placeIds) do
                      if id == currentPlaceId then
                          return i
                      end
                  end
                  return 1
              end

              local function loopTeleport()
                  while true do
                      local currentIndex = findCurrentIndex()
                      if currentIndex then
                          wait(30)
                          local nextIndex = currentIndex + 1
                          if nextIndex > #placeIds then
                              nextIndex = 1
                          end
                          TeleportService:Teleport(placeIds[nextIndex], Player)
                          break -- break để đợi teleport sang game mới rồi tiếp tục
                      else
                          wait(5)
                      end
                  end
              end
              loopTeleport()`
      }
      if (this.isPlay5game){
        scriptOption.label = "Play5game"
        scriptOption.game_id = "9921763607"
      }
      if (script_sl === 'awp-gag'){
        user_collect = null
        script = `getgenv().Config = {
                  ["Time To Sell"] = 60, -- Seconds
                  ["Seed"] = {
                      ["Strawberry"] = 44,
                      ["Corn"] = 44,
                      ["Coconut"] = 44,
                      ["Apple"] = 44,
                      ["Watermelon"] = 44,
                      ["Mushroom"] = 44,
                      ["Pumpkin"] = 44,
                      ["Pepper"] = 44,
                      ["Cacao"] = 44,
                      ["Dragon Fruit"] = 44,
                      ["Mango"] = 44,
                      ["Cactus"] = 44,
                      ["Beanstalk"] = 44,
                      ["Grape"] = 44,
                      ["Bamboo"] = 44
                  },
                  ["FPS"] = 3,
                  ["Buy Egg"] = true,
                  ["Egg"] = {
                      ["Common Egg"] = false,
                      ["Uncommon Egg"] = true,
                      ["Rare Egg"] = false,
                      ["Mythical Egg"] = true,
                      ["Legendary Egg"] = false,
                      ["Bug Egg"] = true
                  },
                  ["Honey Item"] = {
                      ["Nectarine"] = false,
                      ["Flower Seed Pack"] = false,
                      ["Honey Sprinkler"] = false,
                      ["Honey Torch"] = false,
                      ["Bee Chair"] = false,
                      ["Honey Walkway"] = false,
                      ["Bee Egg"] = true,
                      ["Bee Crate"] = false,
                      ["Hive Fruit"] = false,
                      ["Honey Comb"] = false
                  },
                  ["ItemBlood"] = {
                      ["Blood Banana"] = false,
                      ["Blood Owl"] = false,
                      ["Night Seed Pack"] = false,
                      ["Moon Melon"] = false,
                      ["Mysterious Crate"] = false,
                      ["Blood Kiwi"] = true,
                      ["Night Egg"] = true,
                      ["Star Caller"] = false,
                      ["Blood Hedgehog"] = false
                  },
                  ["Item Twilight"] = {
                      ["Moon Mango"] = false,
                      ["Celestiberry"] = false,
                      ["Twilight Crate"] = false,
                      ["Night Seed Pack"] = false,
                      ["Night Egg"] = true,
                      ["Moon Cat"] = false,
                      ["Star Caller"] = false
                  },
                  ["Sprinkler"] = {
                      ["Basic Sprinkler"] = false,
                      ["Advanced Sprinkler"] = true,
                      ["Master Sprinkler"] = true,
                      ["Godly Sprinkler"] = true
                  },
                  ["Plant Candy"] = false,
                  ["PetNeedSend"] = {"Red Fox", "Dragonfly", "Raccoon", "Queen Bee"},
                  ["Destroy Mode"] = {
                      ["Auto Destroy when have money"] = 500000000, -- its will destroy all trees select when money >= select
                      ["Trees"] = {"Strawberry", "Blueberry", "Corn", "Tomato", "Apple", "Banana"}
                  },
                  ["Url"] = "https://discord.com/api/webhooks/1373337547488628856/tpHmmxFCiu8iaWhQTbTB79BZJy8X9QJ3GtoOzE2t-Krw9NxCxC_NvS05XLG46UNvrrvS", -- Webhook
                  ["Boost FPS"] = true,
                  ["Black Screen"] = true,
                  ["Note"] = "Cachepp",
                  ["Pet Mode"] = {
                      ["Sell Pet"] = true,
                      ["Equip Pet"] = true,
                      ["Name Pet Equip"] = {
                          ["Blood Kiwi"] = true,
                          ["Chicken"] = true,
                          ["Kiwi"] = true,
                      },
                      ["Rarity"] = { -- Rarity Sell Pet
                          ["Common"] = true,
                          ["Uncommon"] = true,
                          ["Rare"] = true,
                          ["Legendary"] = true,
                          ["Divine"] = false,
                          ["Mythical"] = false
                      }
                  },
                  ["Rejoin After X Time"] = 120,
              }
              setfpscap(getgenv().Config["FPS"] or 3)
              script_key="sODGQPHiISgNdIfWpuWQoqzVtdBZZQeg";

              repeat
                  wait()
                          loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/be5eb6eb83a60b4c87954ddf66dd7413.lua"))()    task.wait(10)
                  task.wait(10)
              until getgenv().Loaded`
      }
      if (this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))),scriptOption)){
        this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label + (user_collect ? '           ----' + user_collect : '')})
        this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
      }else {
        setTimeout(()=> {
          this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))),scriptOption)
          this.setStatusDevice({device_id: device_id,key: 'script_label',value: scriptOption?.label + (user_collect ? '           ----' + user_collect : '') })
          this.setStatusDevice({device_id: device_id,key: 'script',value: scriptOption?.code})
        },30000)
      }
    },
    autoPlay5game(){
      this.isPlay5game = true
      this.StopAll()
      setTimeout(() => {
        this.refreshScript(true)
      },60 * 1000)
      setTimeout(() => {
        this.PlayAll()
      },300 * 1000)

      this.autoPlay5gameTimeout = setTimeout(() => {
        this.StopAll()
        this.isPlay5game = false
        setTimeout(() => {
          this.refreshScript(true)
        },60 * 1000)
        setTimeout(() => {
          this.PlayAll()
        },300 * 1000)
      },2700 * 1000)
    },
    autoEnableDevice(active){
      this.isIntervalEnable = active
      if (!this.isIntervalEnable){
        clearInterval(this.intervalEnable);
      } else {
        console.log('autoEnableDevice')
        this.intervalEnable = setInterval(() => {
          this.enableDevice()
          console.log('autoEnableDevice')
        }, 10 * 60 * 1000);
      }
    },
    async enableDevice() {
      let listToiletDevice = []
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      Object.entries(map_device_data).forEach((device,index) => {
        if (device[1]?.script && device[1]?.script.includes('ttd-') && this.hideDevice.includes((this.map_device_id_code[device[0]]).replace(/_/g, " "))){
          listToiletDevice.push(device[0]);
        }
      })
      let count = 0
      for (let i = 0; i < this.roblox_data.devices.length; i++) {
        const device = this.roblox_data.devices[i];
        console.log('device',device.device_id)
        if (listToiletDevice.includes(device.device_id)){
          count++;
          let total_account = 22;
          const listAccount = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/accounts`,{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
          let countEnable = 0
          let listDisable = []
          if (listAccount?.accounts?.length > 0){
            listAccount?.accounts.forEach(acc => {
              if (acc?.enabled){
                countEnable += 1
              } else {
                listDisable.push({
                  username_look_for: acc?.username,
                  enabled: true,
                })
              }
            })
            console.log('listDisable.slice(0,(this.active_account - countEnable))',countEnable,listDisable.slice(0,(total_account - countEnable)))
            await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`,listDisable.slice(0,(total_account - countEnable)),{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }

        }}
      console.log('count',count)
      // https://frontend.robloxmanager.com/v1/devices/930cf8350e6a91ca3d463597e892766521e5729cada6d34c22546f87e3ac3336/accounts
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
      }, this.$config.INTERVAL_TIME || 10000);
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
    refreshScriptBgsi(script){
      this.petgumScript = script
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      Object.entries(map_device_data).forEach((device,index) => {
        if (device[1]?.script && device[1]?.script === 'petgum'){
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
      })
    },
    refreshScript(pass = false){
      localStorage.setItem('userCollectCreate', JSON.stringify(this.userCollectCreate));
      if (!pass){
        const correctPassword = "matkhau123@"; // Mật khẩu cố định
        const userPassword = prompt("Vui lòng nhập mật khẩu để chạy lệnh:");
        if (userPassword !== correctPassword) {
          alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
          return false
        }
      }
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const list_data = Object.entries(map_device_data)
      let index = 0

      const interval = setInterval(() => {
        const device = list_data[index]
        if (device[1]?.script && (device[1]?.script.includes('ttd-') || device[1]?.script.includes('awp-'))){
          console.log('refreshScript',device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
        }
        index+=1
        if (index > list_data.length - 1){
          clearInterval(interval)
        }
      },300)
      // Object.entries(map_device_data).forEach((device,index) => {
      //   if (device[1]?.script && device[1]?.script.includes('ttd-')){
      //     console.log('refreshScript',device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
      //     this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script)
      //   }
      // })
    },
    async PlayAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        console.log("device[0]",device[0],!this.activeDevice.includes(device[0]))
        if (device[1]?.script && (device[1]?.script.includes('ttd-') || device[1]?.script.includes('awp-')) && !this.activeDevice.includes(device[0])) {
          const responseCompleted = await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device[0]}/start`, {},{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
        // https://frontend.robloxmanager.com/v1/devices/cd42b76bdc6ad726b6690ad474a8cafe4184a663f47336e1be8e6f931a23a64b/stop
      }
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
    async StopAll() {
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data'));
      const arr = Object.entries(map_device_data)
      for (let i = 0; i < arr.length; i++) {
        const device = arr[i]
        if (device[1]?.script && (device[1]?.script.includes('ttd-') || device[1]?.script.includes('awp-')) && this.activeDevice.includes(device[0])) {
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
        if (option?.yummyTrack) {
          const scriptTrack = btoa(unescape(encodeURIComponent(`_G.Config = { UserID = "08432d86-5203-427d-bab2-298b2ab63da7", discord_id = "663236418499379240" , Note = "${this.map_device_id_code[device_id]}", } loadstring(game:HttpGet("${option.yummyTrack}"))()`)))
          const script_id = await this.getData(device_id, "script_id1")
          const resSetScript = await this.$axios.$put(`https://frontend.robloxmanager.com/v1/configs/${device_id}/scripts/${script_id}`, {
            "script_name": "scriptTrack",
            script_data: scriptTrack
          },{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
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
    }
  }
};
</script>

<style>
</style>
