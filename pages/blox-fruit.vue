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
    </div>
  </template>
  <div style="margin-left: auto;font-size: 24px" :style="`${$config.DEVICE_ROLE === 'manager' ? '' : 'transform: scale(3);margin-bottom: 32px'}`">
    <input v-model="sortInactive" id="sortInactive" type="checkbox">
    <label for="sortInactive">Xắp xếp theo trạng thái không hoạt động</label>
  </div>
  <div class="list-remote-pc" v-if="roblox_data?.devices?.length > 0">
    <div v-for="data in roblox_data.devices" v-if="show_device.includes(data.device_name)" class="remote-pc-item" :class="getStatusClass(data)" :key="data.device_code" :style="`${$config.DEVICE_ROLE === 'manager' ? 'padding: 0 24px' : 'font-size: 32px'}`">
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
      <template v-if="$config.DEVICE_ROLE === 'manager'">
        <div style="width: 450px">
          <template v-if="map_device_data && map_device_data[data?.device_id]">
            {{map_device_data[data?.device_id]?.script}}
          </template>
          <template v-else>Farm</template>
        </div>
        <div v-show="editDevice == data.device_code">
          <select @change="(e) => {setToiletScript(data?.device_id,data?.device_name,e?.target?.value)}" v-if="toiletUsername?.length > 0">
            <option value="">Không</option>
            <template v-for="username in toiletUsername">
              <option :value="username" >{{username}}</option>
            </template>
<!--            <template v-for="data in map_key_token_gom">-->
<!--              <option :value="data?.key">{{data?.key}}</option>-->
<!--            </template>-->
          </select>
          <button @click="setFarmScript(data?.device_id,data?.device_name,'blox-fruit')">Farm script</button>
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
      toiletUsername: ["lindseychristopher76","marylopez355","lunabobby7","carrie79912"],
      show_device: ["VPS 1","VPS 2","VPS 3","VPS 4","VPS 5","VPS 6","VPS 7","VPS 8","VPS 9","VPS 10","VPS 235","VPS 236","VPS 237","VPS 238","VPS 239","VPS 240","VPS 241","VPS 242","VPS 243","VPS 244","VPS 245","VPS 246","VPS 247","VPS 248","VPS 249","VPS 250"],
      autoGomActive: [],
      autoGomFrom: '',
      autoGomTo: '',
      autoGomLastCurrent: 0,
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
    setToiletScript(device_id,device_name,user_collect){
      if (!user_collect){
        return
      }
      const token = this.map_key_token_farm.find(data => data.key == device_name)?.nousigi
      console.log('this.map_key_token_farm',this.map_key_token_farm,token,device_name)
      const script = `getgenv().Key = "${token}"
                      getgenv().ImportMacro = {
                          "https://cdn.discordapp.com/attachments/1290994164179144734/1290994222316519497/okkkkkkkkkkk.txt?ex=66fe7b90&is=66fd2a10&hm=e212b079ae492eb4fd9ca9e2e21d5d419b87782e01274168c7b78fa945a5ac02&"
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
                        ["EventType"] = "Drill Type",
                        ["WH_MatchComplete"] = false,
                        ["AutoSkip"] = true,
                        ["AutoClaimQuest"] = true,
                        ["TPLobbyIfPlayer"] = false,
                        ["SelectBuyCrate"] = "GoldenGladiatorCrate",
                        ["BuyAmount"] = "Buy3",
                        ["WH_MailSent"] = true,
                        ["IgnoreMacroTiming"] = true,
                        ["SelectMacro"] = "Macro105Action",
                        ["ALFS_DelayHop"] = 30,
                        ["BuyCrateName"] = "${user_collect}",
                        ["AutoClaimPlaytimeReward"] = true,
                        ["PlaceFailsafe"] = true,
                        ["AutoJoinEndless"] = false,
                        ["PlayMacro"] = true,
                        ["AutoBuyCrate"] = true,
                        ["AutoMail"] = true,
                        ["BoostFPS"] = true,
                        ["Summon10"] = false,
                        ["AutoUseBoost"] = false,
                        ["AutoJoinPVP"] = true,
                        ["AutoReturnToLobby"] = true,
                        ["AutoReplay"] = false,
                        ["ABE_Gift"] = false,
                        ["BlackScreen"] = false,
                        ["SellWave"] = 1,
                        ["AutoClaimEventPass"] = false,
                        ["DelayJoin"] = 25,
                        ["DeleteMap"] = true,
                        ["RequireRoll"] = 0,
                        ["AutoJoinMatch"] = false,
                        ["ALFS_HopServer"] = false,
                        ["UseAll"] = false,
                        ["SelectCase"] = "BasicCrate",
                        ["AutoSellOW"] = false,
                        ["WalkAround"] = false,
                        ["MailName"] = "Thangcachepp02",
                        ["AutoClaimVIP"] = false,
                        ["AutoBuyEvent"] = false,
                        ["AutoListForSale"] = false,
                        ["AutoVoteDifficulty"] = false,
                        ["AutoClaimEventQuest"] = true,
                        ["AutoRejoin"] = true,
                        ["WebhookURL"] = "https://discord.com/api/webhooks/1311003539438571630/B4vyCwjlQnfBGM1a4GeKGVVdH9Zp32e9uxI_bc1LcK-f2N3Es_aMosz0L6UObuNGmlgk",
                        ["SummonDelay"] = 0.3,
                        ["SelectMap"] = "HalloweenGraveyard",
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
                          ["2xDrillBoost"] = false,
                          ["2xDrillXPBoost"] = false,
                          ["2xXPBoost_1"] = false,
                          ["2xHalloweenCandyBoost"] = false
                        },
                        ["AutoSummonTroop"] = false
                      }
                      repeat wait()spawn(function()loadstring(game:HttpGet("https://nousigi.com/loader.lua"))()end)wait(10)until Joebiden`;
      this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))))
      this.setStatusDevice({device_id: device_id,key: 'script',value: `Farm-Toilet - ${user_collect}`})
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
    setFarmScript(device_id,device_name,unit = 'lava'){
      console.log('device_id,device_name,unit',device_id,device_name,unit)
      const token = this.map_key_token_farm.find(data => data.key == device_name)?.token
      if (unit === 'blox-fruit') {
        const script =
            `repeat wait() until game:IsLoaded() and game.Players.LocalPlayer
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
                  ["Auto Saber"] = false,
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
              loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/main/BananaCat-kaitunBF.lua"))()`;
        this.saveScript(device_id, btoa(unescape(encodeURIComponent(script))))
      }
      this.setStatusDevice({device_id: device_id,key: 'script',value: `Farm-${unit}`})
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
          this.setFarmScript(device[0],(this.map_device_id_code[device[0]]).replace(/_/g, " "),device[1]?.script.replace("Farm-", "") || 'lava')
        }
      })
    },
    async saveScript(device_id, script) {
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
    }
  }
};
</script>

<style>
</style>
