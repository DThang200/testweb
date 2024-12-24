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
        Circle : {{circle}}
      </div>
      <div>
        Countdown Circle In : {{countdown_circle}}
      </div>
    </div>
    <div v-for="data in roblox_data" class="remote-pc-item" :class="getStatusClass(data)" :key="data.device_code" style="margin: 10px">
      <div>
        {{data.device_name}}
      </div>
      <!--      <div>-->
      <!--        tổng {{data.total_accounts}} máy-->
      <!--      </div>-->
      <div>
        {{data.active_accounts}}
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
        }
      },deep: true
    }
  },
  mounted() {
    this.getDataRoblox();
    this.runFarmFruit();
  },
  beforeDestroy() {
    // Xóa công việc khi component bị hủy
    if (this.interval_farm) {
      clearInterval(this.interval_farm);
      console.log('Đã xóa công việc setInterval');
    }
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
    ]),
    runFarmFruit(){
      this.intervalId = setInterval(async () => {
        for (let i = 0; i < this.roblox_data.length; i++) {
          if (this.roblox_data[i] && this.roblox_data[i]?.device_id){
            const device = this.roblox_data[i]
            await this.$axios.$post(`https://frontend.robloxmanager.com/v1/devices/${device?.device_id}/stop`,{
              headers: {
                'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
              },
            });
          }
        }
      }, this.time_circle);
    },
    getStatusClass(data = null){
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
  }
}
</script>
