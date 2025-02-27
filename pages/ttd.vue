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
    <div v-for="data in roblox_data.devices" class="remote-pc-item" v-if="hideDevice.includes(data.device_name)" :class="getStatusClass(data)" :key="data.device_code" :style="`${$config.DEVICE_ROLE === 'manager' ? 'padding: 0 24px' : 'font-size: 32px'}`">
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
        {code : 'ttd-drill',label : 'TTD-Drill',game_id: '13775256536',private_server : false},
        {code : 'ttd-time',label : 'TTD-Time',game_id: '13775256536',private_server : false},
        {code : 'ttd-noel',label : 'TTD-Noel',game_id: '13775256536',private_server : false},
        {code : 'ttd-pvp',label : 'TTD-PvP',game_id: '13775256536',private_server : false},
        {code : 'ttd-create',label : 'TTD-OpenCreateCustom',game_id: '13775256536',private_server : false},
        {code : 'ttd-noel-Thangcachepp04',label : 'TTD-Noel-Main',game_id: '13775256536',private_server : false},
      ],
      option: {
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
          // listUser : ['FullerDeang8542']
          listUser : ['lazza1ki','ReeseTerryv881','EnglishOctopust44','PerezCaitlinw4793','ReedKarlad31']

          // GoodwinJodic4
          // listUser : ['lazza1ki','ReeseTerryv881', 'MaddenJennyf28', 'SchneiderJayi7440', 'FoxTonie9', 'SepiaJillianm1177']
          //'GambleSusanx8714','KellyEmilyf3450' , 'JacksonJefferyz4194','CobbAmyg72','MontoyaLeafp680','HardyDebraa4','HammondMistyf089','GoodmanKendrae129'
          //lucky acc : CowanJoannat2 JacksonJefferyz4194
          //sell acc : AyalaGracef2940 GoodmanKendrae129 GambleSusanx8714 SandovalKiarax4479
          //dead : 'RichardsMiguelo9268','TylerJoshuab1089','MullinsSophiak93','KimSheliat648','RangelAngies069' 'BergerTrevorm09','JohnsKayleea9','RossCherylj50'
          // stephennelson897 TomatoNancyj7926 LittleHectors7645 BentleyBethanyr88 McconnellJustinv926 SanchezBillp83 GardnerFaithm614 NormanGabriellat2 PastelSharonk7 AquamarinePamelao2
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
      let WebhookURL = 'https://discord.com/api/webhooks/1327936685522292747/3uZitd5JmAsq-3kr-Unee4zTJ1MV43Y1a1ehkuxKrHgaD0yXXYK1jDV8ycd0Y4-p1Lap'
      let WebhookCreate = 'https://discord.com/api/webhooks/1326099391630540863/F24-G3lDKUaRWQqCp3TiTE71fyJY2MVjh0n6RrXagbNqB0eUY5BJDXMD1_Djct7_Vpf9'
      let SelectOpenCrate = ''
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
      let OpenCreate =
          '["Golden Gladiator"] = "rbxassetid://129368477907107",\n' +
          '["Christmas"] = "rbxassetid://77647395502645",\n' +
          '["Drill"] = "rbxassetid://00917304333417",\n'
      if (script_sl === 'ttd-pvp'){
        marcoUrl = 'https://raw.nousigi.com/macro/663236418499379240_7c038bccd00ca3d2ac9f7e51f54cc430.json?macroname=abc'
        SelectMacro= 'abc'
        SelectBuyCrate = 'GoldenGladiatorCrate'
        AutoJoinPVP = true
        AutoJoinMatch = false
        AutoReturnToLobby = true
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
      if (script_sl.includes('ttd-dice')){
        SelectBuyCrate = 'RNGCrate'
        SelectMap= 'DiceWorld'
      }

      script = `getgenv().Key = "${nousigi}"
                      getgenv().EquipMacroTroop = true
                      getgenv().ImportMacro = {
                          "${marcoUrl}"
                      }
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
                        ["WebhookURL"] = "${WebhookURL}",
                        ["SummonDelay"] = 0.3,
                        ["SelectMap"] = "${SelectMap}",
                        ["AutoClaimDailyReward"] = true,
                        ["GiftCrate"] = true,
                        ["RequiredGem"]=500,
                        ["AutoDeleteTroop"]=true,
                        ["SelectTroop"] = {
                          ["ToyClockman"] = true,
                          ["KneeSurgeryClockman"] = true,
                        },
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
      if (script_sl === 'ttd-time2'){
        SelectOpenCrate = 'Time'
        script = `
        getgenv().Webhook = '${WebhookCreate}'
        -- getgenv().Crate = 'Golden Gladiator'
        getgenv().Crate = '${SelectOpenCrate}'

        repeat wait() until game:IsLoaded()
        repeat wait() until game.Players.LocalPlayer
        local Plr = game.Players.LocalPlayer
        repeat wait() until Plr.Character
        repeat wait() until Plr.Character:FindFirstChild("HumanoidRootPart")
        repeat wait() until Plr.Character:FindFirstChild("Humanoid")
        local Plrgui =game:GetService("Players").LocalPlayer.PlayerGui
        local vim = game:GetService("VirtualInputManager")
        local StarterGui = game:GetService("StarterGui")
        local DelayTIme = 3
        StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)
        StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Chat, false)

        function ClickButton(a)
           game:GetService("VirtualInputManager"):SendMouseButtonEvent(a.AbsolutePosition.X+a.AbsoluteSize.X/2,a.AbsolutePosition.Y+65,0,true,a,1)
           game:GetService("VirtualInputManager"):SendMouseButtonEvent(a.AbsolutePosition.X+a.AbsoluteSize.X/2,a.AbsolutePosition.Y+65,0,false,a,1)
        end
        local function ClickButton1(a)
           game:GetService("GuiService").SelectedObject = a
           game:GetService("VirtualInputManager"):SendKeyEvent(true, "Return", false, game)
           game:GetService("VirtualInputManager"):SendKeyEvent(false, "Return", false, game)
        end
        local listCrate = {
           ["Golden Gladiator"] = "rbxassetid://129368477907107",
           ["Christmas"] = "rbxassetid://77647395502645",
           ["Drill"] = "rbxassetid://00917304333417",
           ["Time"] = "rbxassetid://140708017990778"
        }
        function GetUnitList()
           unitlist = {}
           if Plrgui.Lobby.UnitFrame.Visible then
              if #Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren() <= 1 then
                 repeat
                       ClickButton(Plrgui.Lobby.LeftSideFrame.Units.Button)
                 until #Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren() > 1 or  Plrgui.Lobby.UnitFrame.Visible
              end
              unitlist = {}
              for i, v in pairs(Plrgui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren()) do
                 if v:IsA("Frame") then
                       if v.TroopsFrame.TroopIcon.Image == "rbxassetid://15798757056" then
                          v:Destroy()
                       else
                          table.insert(unitlist, v.Name)
                       end
                 end
              end

              table.sort(unitlist)
           else
              ClickButton(Plrgui.Lobby.LeftSideFrame.Units.Button)
              wait(1)
           end
        return unitlist
        end
        GetUnitList()
        local function isCrate(crate)
           print(crate.TroopsFrame.TroopIcon.Image)
           if crate.TroopsFrame.TroopIcon.Image == listCrate[getgenv().Crate] then
              return crate
           end

           return
        end

        local function getNotEnoughSpaceGui()
           for i,v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.NotificationFrame:GetChildren()) do
              if v.Name == "BigNotification" and v.Parent.Visible then
                 if string.find(v.NotificationMessage.Text,"enough space") then
                    return v
                 end
              end
           end
           return

        end



        local function getOpenGui()
           for i,v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.NotificationFrame:GetChildren()) do
              if v.Name == "BigNotification" and v.Parent.Visible then
                 if v.NotificationMessage.Text == "Are you sure you want to open this crate?" then
                    return v
                 end
              end
           end
           return
        end
        function CheckRarity(rarity)
           if rarity =="Ultimate" or rarity=="Godly" then
                 return true
           end
           return false
        end
        function SendWebHook(v)
           local msg = {
               ['content'] = (v.Holder.RarityFrame.Rarity.Text == "Ultimate") and "@everyone" or nil,
               ["embeds"] = {{
                   ["title"] = "Toilet Tower Defense",
                   ["description"] = "Crate Opened",
                   ["type"] = "rich",
                   ["color"] = tonumber(0xbdce44),
                   ["fields"] = {
                       {
                           ["name"] = "User",
                           ["value"] = game.Players.LocalPlayer.Name,
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
        local function getOkButton(frame)
           if frame:FindFirstChild("OkButton") and frame.OkButton.Visible then
              return frame.OkButton
           end
           return
        end
        local function getOpenButton(frame)
           if frame:FindFirstChild("Button3") and frame.Button3.Visible and    frame.Button3.Btn.Text == "Open 8" then
              return frame.Button3
           else
              return frame.Button1
           end
        end
        local movementRadius = 10
        local speed = 16
        local origin = Plr.Character.HumanoidRootPart.Position
        local function moveRandomly()
           local randomX = math.random(-movementRadius, movementRadius)
           local randomZ = math.random(-movementRadius, movementRadius)
           local targetPosition = Vector3.new(origin.X + randomX, origin.Y, origin.Z + randomZ)
           Plr.Character.Humanoid:MoveTo(targetPosition)
           Plr.Character.Humanoid.MoveToFinished:Wait()
        end
        if game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.Visible then
           repeat wait()
              ClickButton1(game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.LogHolder.Frame.CloseButton)
           until not game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UpdateLog.Visible
        end
        _G.TradeOff = false
        while _G.TradeOff do wait()

           if game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible then
              if game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On.Visible then
                 repeat wait()
                    ClickButton1( game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On)
                    wait(.5)
                 until not  game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Frame.SettingsList.Trading.On.Visible or not _G.TradeOff
                 _G.TradeOff = false
                 wait()
                 game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = false
              else
                 _G.TradeOff = false
                 wait()
                 game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = false
              end
           else
              game:GetService("Players").LocalPlayer.PlayerGui.MainFrames.SettingsFrame.Visible = true
           end
        end
        _G.farm = true
        spawn(function()
           while _G.farm do wait()
              pcall(function()
                -- if game.PlaceId == 13775256536 then  if Plrgui.Teleports["Lobby -> TradingPlaza"].Visible then  ClickButton(Plrgui.Teleports["Lobby -> TradingPlaza"].Teleport) else Plr.Character.HumanoidRootPart.CFrame = CFrame.new(-489.68457, 246.229614, 51.8587036) end else
                    for i, v in pairs(game:GetService("Players").LocalPlayer.PlayerGui.Lobby.UnitFrame.UnitHolder.UnitList:GetChildren()) do
                       if not  Plrgui.Lobby.UnitFrame.Visible then
                          repeat wait()
                             ClickButton1(Plrgui.Lobby.LeftSideFrame.Units.Button)
                             wait(1)
                          until  Plrgui.Lobby.UnitFrame.Visible
                          wait(1)
                       end

                       if v:IsA("Frame") and isCrate(v) then

                          repeat wait()
                             ClickButton1(v.TroopsFrame.InteractiveButton)
                             wait(DelayTIme)
                          until getOpenGui() or not _G.farm
                          wait(DelayTIme)
                          repeat wait()
                             print(Plr.Name ..'bam nut mo ruong')
                             ClickButton1(getOpenButton(getOpenGui().Buttons).Btn)
                             wait(DelayTIme)
                          until not _G.farm or not getOpenGui() or getNotEnoughSpaceGui() or not  Plrgui.Lobby.UnitFrame.Visible
                          wait(DelayTIme)
                          if getNotEnoughSpaceGui() then

                             repeat wait()
                                print('tat not enough')
                                ClickButton1(getOkButton(getNotEnoughSpaceGui().Buttons).Btn)
                                wait(1)
                             until not getNotEnoughSpaceGui() or not _G.farm
                             wait(2)
                          end
                       end
                    end
                    _G.farm = false
                 --end
              end)
           end
        end)
        spawn(function()
           while _G.farm do wait()

              moveRandomly()
              wait(.5)
          end
        end)
        Plrgui.ResultsGui.TroopResultsFrame.SummonResults.ChildAdded:connect(function(Unit)
              if Unit:IsA("Frame") then
                 if CheckRarity(Unit.Holder.RarityFrame.Rarity.Text) then
                       SendWebHook(Unit)
                 end
              end

        end)`
      }
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
