<template>
  <div style="padding: 8px">
    <div class="d-flex flex-row" style="gap: 8px;align-items: center">
      <div>
        <label >active_account</label>
        <input v-model="active_account">
      </div>
      <div>
        <label >total_account</label>
        <input v-model="total_account">
      </div>
      <div>
        <label >time_circle</label>
        <input v-model="time_circle">
      </div>
    </div>
    <div class="d-flex flex-row" style="gap: 8px;align-items: center">
      <div>
        Circle : {{circle}} ({{circle * active_account}} - {{((circle + 1) * active_account) - 1}})
      </div>
      <div>
        Countdown Circle: {{secToTime(countdown_circle)}}
      </div>
      <button type="button" @click="runFarmFruit()">
        runFarmFruit
      </button>
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
    </div>
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
        <label>Remain acc</label>
        <textarea v-if="remain_acc_copy" v-model="remain_acc_copy" rows="5" style="width: 500px"/>
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
      active_account : 30,
      total_account : 60,
      accPerCircle : 5,
      circle : -1,
      time_circle : 20 * 60 * 1000,
      total_circle : 12,
      countdown_circle : 40 * 60,
      interval_countdown : null,
      interval_farm : null,
      script_code : 'bloxFruit-fruit',
      device_stat: [],
      roblox_data: [],
      fill_acc: [],
      remain_acc: [],
      remain_acc_copy: '',
    }
  },
  watch:{
    roblox_data_state: {
      handler(value){
        const map_device_data = JSON.parse(localStorage.getItem('map_device_data')) || {};
        const list_device = []
        if (value?.devices){
          value?.devices.forEach(device => {
            if (map_device_data[device?.device_id] && map_device_data[device?.device_id]?.script == this.script_code){
              list_device.push(device)
            }
          })
          console.log('display',list_device)
          this.roblox_data = JSON.parse(JSON.stringify(list_device))
          // this.roblox_data = JSON.parse(JSON.stringify(list_device.slice(0,5)))

        }
      },deep: true
    }
  },
  mounted() {
    this.getDataRoblox();
    this.runFarmFruit();
    this.initData();
    this.interval_farm = setInterval(async () => {
      await this.runFarmFruit()
    }, this.time_circle);
  },
  beforeDestroy() {
    // Xóa công việc khi component bị hủy
    if (this.interval_farm || this.intervalId) {
      clearInterval(this.interval_farm);
      clearInterval(this.intervalId);
      clearInterval(this.interval_countdown);
      console.log('Đã xóa công việc setInterval');
    }
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
    ]),
    async runFarmFruit() {
      if (this.circle >= this.total_circle){
        this.circle = 0;
      } else {
        this.circle += 1;
      }
      console.log('next circle', this.roblox_data)
      // stopAll
      for (let i = 0; i < this.roblox_data.length; i++) {
        if (this.roblox_data[i] && this.roblox_data[i]?.device_id) {
          const device = this.roblox_data[i]
          await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/stop`, {}, {
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
      }
      for (let i = 0; i < this.roblox_data.length; i++) {
        const device = this.roblox_data[i]
        const listAccount = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/accounts`,{
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        let listEnableAcc = []
        if (listAccount && listAccount?.accounts?.length > 0){
          listAccount.accounts.forEach((acc,index) => {
            const enable = (index >= this.circle * this.accPerCircle) && (index < ((this.circle + 1) * this.active_account))
            listEnableAcc.push({
              "username_look_for": acc?.username,
              "enabled": enable
            })
          })
        }
        await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`, listEnableAcc,{
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
      }
      //start all
      clearInterval(this.interval_countdown);
      this.countdown_circle = JSON.parse(JSON.stringify(this.time_circle / 1000))
      this.interval_countdown = setInterval(() => {
        this.countdown_circle -= 1
      }, 1000)
      setTimeout(async () => {
        for (let i = 0; i < this.roblox_data.length; i++) {
          if (this.roblox_data[i] && this.roblox_data[i]?.device_id) {
            const device = this.roblox_data[i]
            await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/start`, {}, {
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        }
      }, 120 * 1000)
    },
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
      console.log('listEmptyAcc',listEmptyAcc)
      let getAccIndex = 0
      for (let i = 0; i < this.roblox_data.length; i++) {
      // for (let i = 0; i < 5; i++) {
        let listAccFill = []
        const device = this.roblox_data[i];
        if (device?.total_accounts < this.total_account) {
          const needAcc = this.total_account - device?.total_accounts
          listAccFill = listEmptyAcc.slice(getAccIndex, getAccIndex + needAcc)
          getAccIndex = getAccIndex + needAcc
        }
        console.log('listAccFill',device?.device_code,getAccIndex,listAccFill)
        if (listAccFill?.length > 0){
          await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`, listAccFill,{
            headers: {
              'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
            },
          });
        }
      }
      this.remain_acc = listEmptyAcc.slice(getAccIndex, listEmptyAcc.length)
      await this.enableDevice();
      this.copyRemainAcc();
      alert('Fill done');
    },
    async enableDevice() {
      for (let i = 0; i < this.roblox_data.length; i++) {
        const device = this.roblox_data[i];
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
          console.log('listDisable.slice(0,(this.active_account - countEnable))',countEnable,listDisable.slice(0,(this.active_account - countEnable)))
          await this.$axios.$put(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/bulk/accounts`,listDisable.slice(0,(this.active_account - countEnable)),{
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
        copyContent += `${item.username}:${item.password}:${item.cookie}` + '\n'
      })
      this.remain_acc_copy = copyContent
      navigator.clipboard.writeText(copyContent);
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
    secToTime(seconds) {
      console.log('seconds',seconds)
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
  }
}
</script>
