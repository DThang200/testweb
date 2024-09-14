<template>
  <div>
    {{roblox_data_account?.accounts?.length? 'Đã xong' : ''}}
    <select :disabled="!(roblox_data_account?.accounts?.length)" v-model="select_pc">
      <option :value="device.device_id" v-for="device in roblox_data.devices">{{device.device_code}}</option>
    </select>
    <table>
      <thead>
      <tr>
        <th>User name</th>
        <th>Crystal</th>
        <th>Gold</th>
        <th>cookie</th>
      </tr>
      </thead>
      <tbody>
      <template>
        <tr v-for="item in roblox_data_account_display">
          <td>{{item.username}}</td>
          <td>{{getCrystal(item.status)}}</td>
          <td>{{getGold(item.status)}}</td>
          <td>
            <div style="width: 100px;max-width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :title="item.cookie">{{item.cookie}}</div>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
      roblox_data_account: state => state.roblox_data_account,
      map_code_device_id: state => state.map_code_device_id,
    }),
  },
  watch: {
    select_pc(value){
      this.getDataByDeviceId();
    }
  },
  data() {
    return {
      select_pc: '',
      roblox_data_account_display: '',
    };
  },
  mounted() {
    this.getDataRoblox()
    this.getDataAccount()
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getDataAccount',
    ]),
    getDataByDeviceId(){
      this.roblox_data_account_display = []
       this.roblox_data_account.accounts.forEach(item => {
        if (item.device_id === this.select_pc){
          this.roblox_data_account_display.push(item)
        }
      })
      console.log('roblox_data_account_display',this.roblox_data_account_display)
    },
    getCrystal(status){
      if (!status){
        return ''
      }
      return  JSON.parse(status).Items["Trait Crystal"]
    },
    getGold(status){
      if (!status){
        return ''
      }
      return  JSON.parse(status).Currencies["Gold"]
    },
  }
};
</script>
