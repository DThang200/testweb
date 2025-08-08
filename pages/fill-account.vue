<template>
  <div style="padding: 8px">
    <div class="d-flex flex-row" style="gap: 8px;align-items: center">
      <div>
        <label for="fillttd">Fill acc game</label>
<!--        <input id="fillttd" v-model="fillttd" type="checkbox">-->
        <select v-model="fillOption">
<!--          <option value="ttd">TTD</option>-->
<!--          <option value="bgsi">BGSI</option>-->
          <option value="astd">ASTD</option>
<!--          <option value="gag">GAG</option>-->
          <option value="gag-bone">GAG-Bone</option>
<!--          <option value="bloxFruit">BloxFruit</option>-->
        </select>
        <textarea v-model="fill_acc" rows="5" style="width: 500px"/>
        <button type="button" @click="fillAcc()">
          Fill
        </button>
        <button type="button" @click="copyRemainAcc()">
          Copy the remaining account
        </button>

        <button type="button" @click="enableDevice()">
          Enable device
        </button>
        <template v-if="remain_acc_copy">
          <label>Remain acc</label>
          <textarea v-if="remain_acc_copy" v-model="remain_acc_copy" rows="5" style="width: 500px"/>
        </template>
      </div>
    </div>
    <button @click="showLowDevice = !showLowDevice" style="width: 150px">
      show Low device
    </button>
    <button @click="showStrongDevice = !showStrongDevice" style="width: 170px">
      show Strong device
    </button>
    <div>Need more : Other - {{needAccount || 0}}     ASTD - {{needAccountASTD || 0}}     GAG - {{needAccountGAG || 0}}</div>
    <div v-if="showLowDevice" style="width: 500px;display: flex;flex-direction: row;overflow-y: auto;height: 200px;font-size: 12px;flex-wrap: wrap;gap: 12px">
      <div v-for="data in roblox_data" style="border: 1px solid black;padding: 4px">
        <input :id="data.device_name+ 'low'" type="checkbox" v-model="lowDevice" :value="data.device_name">
        <label :for="data.device_name+ 'low'">{{data.device_name}}</label>
      </div>
    </div>
    <div v-if="showStrongDevice" style="width: 500px;display: flex;flex-direction: row;overflow-y: auto;height: 200px;font-size: 12px;flex-wrap: wrap;gap: 12px">
      <div v-for="data in roblox_data" style="border: 1px solid black;padding: 4px">
        <input :id="data.device_name+ 'low'" type="checkbox" v-model="strongDevice" :value="data.device_name">
        <label :for="data.device_name+ 'low'">{{data.device_name}}</label>
      </div>
    </div>
    <div v-for="data in roblox_data" class="remote-pc-item"  v-if="hideDevice.includes(data.device_name)" :class="getStatusClass(data)" :key="data.device_code" style="margin: 10px">
      <div>
        {{data.device_name}} {{data?.running ? '' : '(stop)'}} {{strongDevice.includes(data.device_name) ? '(Strong)' : ''}} {{lowDevice.includes(data.device_name) ? '(Low)' : ''}}
      </div>
      <!--      <div>-->
      <!--        tổng {{data.total_accounts}} máy-->
      <!--      </div>-->
      <div>
        {{data.active_accounts}} ({{data.total_accounts}})
      </div>
      <div style="min-width: 300px">
        {{map_device_data[data?.device_id]?.script_label}}
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      map_device_data: state => state.map_device_data,
      map_device_id_code: state => state.map_device_id_code,
      roblox_data_state: state => state.roblox_data,
    }),
  },
  data() {
    return {
      active_account : 22,
      total_account : 66,
      circle : 0,
      showLowDevice : false,
      showStrongDevice : true,
      time_circle : 120 * 60 * 1000,
      countdown_circle : 120 * 60 * 1000,
      interval_farm : null,
      script_code : 'bloxFruit-fruit',
      device_stat: [],
      roblox_data: [],
      fill_acc: [],
      remain_acc: [],
      hideDevice: [],
      lowDevice: [],
      strongDevice: [],
      fillDevice: [],
      remain_acc_copy: '',
      fillOption : "astd",
      fillttd: true,
      fillgag: false,
      needAccount: 0,
      needAccountGAG: 0,
      needAccountASTD: 0,
      needAccountBf: 0,
      farmOption : [
        {code : 'bloxFruit-maru',label : 'Blox Fruit-Maru',game_id: '2753915549',total_account: 27},
        {code : 'bloxFruit-2600',label : 'Blox Fruit-2550',game_id: '2753915549',total_account: 22},
        {code : 'bloxFruit-fruit',label : 'Blox Fruit-X3',game_id: '2753915549',total_account: 44,active_account : 22},
        {code : 'bloxFruit-25tab',label : 'Blox Fruit-MagmaV2',game_id: '2753915549',total_account: 25},
        {code : 'ttd-pvp',label : 'TTD-PvP',game_id: '13775256536',total_account: 25},
        {code : 'petgum',label : 'TTD-PvP',game_id: '13775256536',total_account: 28},
        {code : 'awp-gag',label : 'TTD-PvP',game_id: '13775256536',total_account: 65},
        {code : 'awp-bgsi',label : 'TTD-PvP',game_id: '13775256536',total_account: 65},
        {code : 'awp-bf-2650',label : 'TTD-PvP',game_id: '13775256536',total_account: 35},
        {code : 'astd',label : 'astd',game_id: '17687504411',total_account: 30},
        {code : 'farm-gag',label : 'farm-gag',game_id: '126884695634066',total_account: 30},
        {code : 'gag-bone',label : 'GAG-Bone',game_id: '126884695634066',total_account: 45},
        // {code : 'Fisch-lv500',label : 'Fisch-lv500',game_id: '16732694052',total_account: 22},
        // {code : 'Fisch-lv750',label : 'Fisch-lv750',game_id: '16732694052',total_account: 22},
      ],
    }
  },
  watch:{
    roblox_data_state: {
      handler(value){
        const list_device = []
        if (value?.devices){
          value?.devices.forEach(device => {
            list_device.push(device)
          })
          this.roblox_data = JSON.parse(JSON.stringify(list_device))
          setTimeout(() => {
            this.getNeedAccount(JSON.parse(JSON.stringify(list_device)));
          },2000)
        }
      },deep: true
    },
    lowDevice : {
      handler(value) {
        localStorage.setItem('lowDevice', JSON.stringify(value));
      }
    },
    strongDevice : {
      handler(value) {
        localStorage.setItem('strongDevice', JSON.stringify(value));
      }
    },
  },
  mounted() {
    this.hideDevice =  JSON.parse(localStorage.getItem('hideDevice')) || [];
    this.lowDevice =  JSON.parse(localStorage.getItem('lowDevice')) || [];
    this.strongDevice =  JSON.parse(localStorage.getItem('strongDevice')) || [];
    this.getDataRoblox();
    // this.runFarmFruit();
    this.initData();
    this.initStatusDevice();
    // this.interval_farm = setInterval(async () => {
    //   await this.runFarmFruit()
    // }, this.time_circle);
  },
  beforeDestroy() {
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'initStatusDevice',
    ]),
    async fillAcc() {
      const emptyAcc = this.fill_acc.split('\n')
      const listEmptyAcc = []
      emptyAcc.forEach((line) => {
        const arr_acc = line.split(':')
        const username = arr_acc[0]
        const password = arr_acc[1]
        const cookieAcc = arr_acc[2] + ':' + arr_acc[3]
        listEmptyAcc.push({username: username, password: password, cookie: cookieAcc})
      })
      let getAccIndex = 0
      for (let i = 0; i < this.roblox_data.length; i++) {
      // for (let i = 0; i < 5; i++) {
        let listAccFill = []
        const device = this.roblox_data[i];
        let total_account = 0;
        this.farmOption.forEach(scr => {
          if (scr?.code === this.map_device_data[device?.device_id]?.script){
            if (!(!this.fillttd)){
              if (scr?.code.includes(this.fillOption) && this.map_device_id_code[device?.device_id] && this.hideDevice.includes((this.map_device_id_code[device?.device_id]).replace(/_/g, " "))){
                total_account = scr?.total_account
              } else {
                total_account = 0
              }
            }
          }
        })
        if (total_account > 0 || false) {
          if (device?.total_accounts < total_account) {
            let minusAcc = 0
            if (this.lowDevice.includes(this.map_device_id_code[device?.device_id].replace(/_/g, " "))){
              minusAcc = 2
              if (this.map_device_data[device?.device_id]?.script.includes('awp-')){
                minusAcc = 15
              }
            }
            if (this.strongDevice.includes(this.map_device_id_code[device?.device_id].replace(/_/g, " "))){
              minusAcc = -2
            }
            const needAcc = total_account - device?.total_accounts - minusAcc
            // if (needAcc > 0 ){
            //   this.fillDevice.push(device?.device_id)
            // }
            if (needAcc > 0){
              listAccFill = listEmptyAcc.slice(getAccIndex, getAccIndex + needAcc)
              getAccIndex = getAccIndex + needAcc
              console.log('listAccFill',device?.device_name,needAcc,listAccFill)
              if (listAccFill?.length > 0 && needAcc > 0){
                await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`, listAccFill,{
                  headers: {
                    'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
                  },
                });
              }
            }
          }
        }

      }
      this.remain_acc = []
      const remain_acc = listEmptyAcc.slice(getAccIndex, listEmptyAcc.length)
      remain_acc.forEach(acc => {
        this.remain_acc.push(acc)
      })
      await this.enableDevice();
      this.copyRemainAcc();
      console.log('fill_acc', this.fill_acc.split('\n'))
      alert('Fill done');
    },
    async enableDevice() {
      for (let i = 0; i < this.roblox_data.length; i++) {
        const device = this.roblox_data[i];
        if (this.fillDevice.includes(device?.device_id)){
          let total_account = 0;
          this.farmOption.forEach(scr => {
            if (scr?.code === this.map_device_data[device?.device_id]?.script){
              total_account = scr?.active_account || scr?.total_account
            }
          })
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
        }
      }
      // https://frontend.robloxmanager.com/v1/devices/930cf8350e6a91ca3d463597e892766521e5729cada6d34c22546f87e3ac3336/accounts
    },
    copyRemainAcc() {
      let copyContent = ''
      this.remain_acc.forEach(item => {
        if (item && item?.username){
          copyContent += `${item.username}:${item.password}:${item.cookie}` + '\n'
        }
      })
      this.remain_acc_copy = copyContent
      navigator.clipboard.writeText(copyContent);
    },
    initData() {
      this.intervalId = setInterval(() => {
        this.getDataRoblox()
      }, this.$config.INTERVAL_TIME || 10000);
    },
    getNeedAccount(data) {
      this.needAccountGAG = 0
      this.needAccountASTD = 0
      if (this.needAccount > 0){
        return false
      }
      data.forEach(device => {
        this.farmOption.forEach(scr => {
          if (scr?.code === this.map_device_data[device?.device_id]?.script){
            console.log('this.map_device_id_code[device?.device_id]',this.map_device_id_code[device?.device_id])
            if (this.map_device_id_code[device?.device_id] && this.hideDevice.includes((this.map_device_id_code[device?.device_id]).replace(/_/g, " "))){
              if (scr?.total_account > device.total_accounts){
                this.fillDevice.push(device?.device_id)
                let minusAcc = 0
                if (this.lowDevice.includes(this.map_device_id_code[device?.device_id].replace(/_/g, " "))){
                  minusAcc = 2
                  if (this.map_device_data[device?.device_id]?.script.includes('awp-')){
                    minusAcc = 15
                  }
                }
                if (this.strongDevice.includes(this.map_device_id_code[device?.device_id].replace(/_/g, " "))){
                  minusAcc = -2
                }
                if (scr?.code.includes('gag')){
                  this.needAccountGAG += scr?.total_account - device.total_accounts - minusAcc
                } else if (scr?.code.includes('astd')){
                  this.needAccountASTD += scr?.total_account - device.total_accounts - minusAcc
                } else {
                  this.needAccount += scr?.total_account - device.total_accounts - minusAcc
                }
              }
            }
          }
        })
      })
      console.log('this.fillDevice',this.fillDevice)
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
  }
}
</script>
