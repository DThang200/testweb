<template>
  <div>
    {{roblox_data_account?.accounts?.length? 'Đã xong' : ''}}
    <select :disabled="!(roblox_data_account?.accounts?.length)" v-model="select_pc">
      <option :value="device.device_id" v-for="device in roblox_data.devices">{{device.device_code}}</option>
    </select>
    {{copyField}}
    <div class="d-flex">
<!--      <div class="px-2">-->
<!--        <label>Username</label>-->
<!--        <input type="checkbox" value="username" v-model="copyField">-->
<!--      </div>-->
<!--      <div class="px-2">-->
<!--        <label>Crystal</label>-->
<!--        <input type="checkbox" value="Crystal" v-model="copyField">-->
<!--      </div>-->
<!--      <div class="px-2">-->
<!--        <label>Gems</label>-->
<!--        <input type="checkbox" value="Gems" v-model="copyField">-->
<!--      </div>-->
<!--      <div class="px-2">-->
<!--        <label>Cookie</label>-->
<!--        <input type="checkbox" value="Cookie" v-model="copyField">-->
<!--      </div>-->
      <button class="px-2" @click="copyFunction" type="button">
        Copy
      </button>
    </div>
    <table>
      <thead>
      <tr>
        <th>STT ({{roblox_data_account_display.length}})</th>
        <th>User name</th>
        <th>Crystal ({{total_crystal}})</th>
        <th>Gems ({{total_gems}})</th>
        <th>cookie</th>
      </tr>
      </thead>
      <tbody>
      <template>
        <tr v-for="(item,index) in roblox_data_account_display">
          <td class="px-2">{{index + 1}}</td>
          <td class="px-2">{{item.username}}</td>
          <td class="px-2">{{getCrystal(item.status)}}</td>
          <td class="px-2">{{getGems(item.status)}}</td>
          <td class="px-2">
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
      total_crystal: 0,
      total_gems: 0,
      copyField: [],
    };
  },
  beforeMount() {
    const correctPassword = "matkhau123@"; // Mật khẩu cố định
    const userPassword = prompt("Vui lòng nhập mật khẩu để truy cập:");

    if (userPassword !== correctPassword) {
      alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
      this.$router.push("/"); // Chuyển hướng về trang chủ nếu mật khẩu sai
    }
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
      this.total_crystal = 0
      this.total_gems = 0
       this.roblox_data_account.accounts.forEach(item => {
        if (item.device_id === this.select_pc){
          this.roblox_data_account_display.push(item)
          if (item?.status){
            this.total_crystal += JSON.parse(item.status).Items["Trait Crystal"]
            this.total_gems += JSON.parse(item.status).Currencies["Gems"]
          }
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
    getGems(status){
      if (!status){
        return ''
      }
      return new Intl.NumberFormat().format(JSON.parse(status).Currencies["Gems"]);
    },

    copyFunction(){
      let copyContent = ''
      this.roblox_data_account_display.forEach(item => {
        copyContent += item.cookie + '\n'
      })
      console.log('copyContent',copyContent)
      navigator.clipboard.writeText(copyContent);
    }
  }
};
</script>
