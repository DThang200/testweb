<template>
  <div style="padding: 8px">
    <div class="d-flex flex-row" style="gap: 8px;align-items: center">
      <div>
        <label>Fill acc</label>
        <textarea v-model="fill_acc" rows="5" style="width: 500px"/>
        <button type="button" @click="fillAcc()">
          Fill
        </button>
        <button type="button" @click="copyRemainAcc()">
          Copy the remaining account
        </button>
        <template v-if="remain_acc_copy">
          <label>Remain acc</label>
          <textarea v-if="remain_acc_copy" v-model="remain_acc_copy" rows="5" style="width: 500px"/>
        </template>
      </div>
    </div>
    <div v-for="data in roblox_data" class="remote-pc-item" :class="getStatusClass(data)" :key="data.device_code" style="margin: 10px">
      <div>
        {{data.device_name}} {{data?.running ? '' : '(stop)'}}
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
      roblox_data_state: state => state.roblox_data,
    }),
  },
  data() {
    return {
      active_account : 22,
      total_account : 66,
      circle : 0,
      time_circle : 120 * 60 * 1000,
      countdown_circle : 120 * 60 * 1000,
      interval_farm : null,
      script_code : 'bloxFruit-fruit',
      device_stat: [],
      roblox_data: [],
      fill_acc: [],
      remain_acc: [],
      remain_acc_copy: '',
      farmOption : [
        {code : 'bloxFruit-maru',label : 'Blox Fruit-Maru',game_id: '2753915549',total_account: 22},
        {code : 'bloxFruit-2550',label : 'Blox Fruit-2550',game_id: '2753915549',total_account: 22},
        {code : 'bloxFruit-fruit',label : 'Blox Fruit-Fruit',game_id: '2753915549',total_account: 66},
        {code : 'bloxFruit-magma',label : 'Blox Fruit-MagmaV2',game_id: '2753915549',total_account: 22},
        {code : 'Fisch-lv500',label : 'Fisch-lv500',game_id: '16732694052',total_account: 22},
        {code : 'Fisch-lv750',label : 'Fisch-lv750',game_id: '16732694052',total_account: 22},
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
        }
      },deep: true
    }
  },
  mounted() {
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
            total_account = scr?.total_account
          }
        })
        if (total_account > 0) {
          if (device?.total_accounts < total_accounts) {
            const needAcc = total_accounts - device?.total_accounts
            listAccFill = listEmptyAcc.slice(getAccIndex, getAccIndex + needAcc)
            getAccIndex = getAccIndex + needAcc
          }
          console.log('listAccFill',device?.device_name,listAccFill,listAccFill)
          // if (listAccFill?.length > 0){
          //   await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`, listAccFill,{
          //     headers: {
          //       'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          //     },
          //   });
          // }
        }
      }
      this.remain_acc = []
      const remain_acc = listEmptyAcc.slice(getAccIndex, listEmptyAcc.length)
      remain_acc.forEach(acc => {
        this.remain_acc.push(acc)
      })
      // await this.enableDevice();
      this.copyRemainAcc();
      alert('Fill done');
    },
    async enableDevice() {
      for (let i = 0; i < this.roblox_data.length; i++) {
        const device = this.roblox_data[i];
        let total_account = 0;
        this.farmOption.forEach(scr => {
          if (scr?.code === this.map_device_data[device?.device_id]?.script){
            total_account = scr?.total_account
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
      // https://frontend.robloxmanager.com/v1/devices/930cf8350e6a91ca3d463597e892766521e5729cada6d34c22546f87e3ac3336/accounts
      console.log('fill_acc', this.fill_acc.split('\n'))
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
  }
}
</script>
