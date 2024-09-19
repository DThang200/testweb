<template>
  <div>
    {{roblox_data_account?.accounts?.length? 'Đã xong' : ''}}
    <select :disabled="!(roblox_data_account?.accounts?.length)" v-model="select_pc">
      <option value="">All</option>
      <option :value="device.device_id" v-for="device in roblox_data.devices">{{device.device_code}}</option>
    </select>
    Total Crystal : {{total_crystal_all}}
    Total Gems : {{total_gems_all}}
    <div class="d-flex" style="align-items: center">
      <label for="checkbox_showAcc" style="margin-bottom: 0">Show Acc</label>
      <input value="acc" type="checkbox" v-model="viewTable" id="checkbox_showAcc">
      <label for="checkbox_showPc" style="margin-bottom: 0">Show Pc</label>
      <input value="pc" type="checkbox" v-model="viewTable" id="checkbox_showPc">
    </div>
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
    <div class="d-flex" style="justify-content: space-between">
      <table v-if="viewTable.includes('acc')">
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
      <table v-if="viewTable.includes('pc')" style="height: fit-content">
        <thead>
        <tr>
          <th>STT</th>
          <th>PC</th>
          <th>Crystal</th>
          <th>Gems</th>
        </tr>
        </thead>
        <tbody>
        <template>
          <tr v-for="(item,index) in map_code_detail_display">
            <td class="px-2">{{index + 1}}</td>
            <td class="px-2">{{item?.code}}</td>
            <td class="px-2">{{item?.value?.Crystal}}</td>
            <td class="px-2">{{item?.value?.Gems}}</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
      roblox_data_account: state => state.roblox_data_account,
      map_device_id_code: state => state.map_device_id_code,
      map_code_detail: state => state.map_code_detail,
    }),
  },
  watch: {
    select_pc(value){
      this.getDataByDeviceId();
    },
    roblox_data_account(){
      if (this.passPrivate){
        this.getDataByDeviceId();
      }
    },
    map_code_detail(){
      if (this.passPrivate){
        this.renderListPc();
      }
    },
  },
  data() {
    return {
      select_pc: '',
      map_code_detail_display: [],
      roblox_data_account_display: '',
      total_crystal: 0,
      total_gems: 0,
      total_crystal_all: 0,
      total_gems_all: 0,
      copyField: [],
      passPrivate: false,
      viewTable : ['acc','pc']
    };
  },
  beforeMount() {
    this.passPrivate = false
    const correctPassword = "matkhau123@"; // Mật khẩu cố định
    const userPassword = prompt("Vui lòng nhập mật khẩu để truy cập:");

    if (userPassword !== correctPassword) {
      alert("Mật khẩu không chính xác. Bạn sẽ được chuyển hướng về trang chủ.");
      this.$router.push("/"); // Chuyển hướng về trang chủ nếu mật khẩu sai
    }else {
      this.passPrivate = true
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
      this.total_crystal_all = 0
      this.total_gems_all = 0
      this.total_gems = 0
       this.roblox_data_account.accounts.forEach(item => {
         let crystal = 0
         let gems = 0
         if (item?.status){
           crystal = JSON.parse(item.status).Items["Trait Crystal"]
           gems = JSON.parse(item.status).Currencies["Gems"]
           this.total_crystal_all += crystal ? crystal : 0
           this.total_gems_all += gems ? gems : 0
         }
        if (!this.select_pc || item.device_id === this.select_pc){
          this.roblox_data_account_display.push(item)
          if (item?.status){
            this.total_crystal += crystal ? crystal : 0
            this.total_gems += gems ? gems : 0
          }
        }
      })
      console.log('roblox_data_account_display',this.roblox_data_account_display)
    },
    renderListPc(){
      this.map_code_detail_display = Object.keys(this.map_code_detail).map(key => {
        return { code: key, value: this.map_code_detail[key]};
      });
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
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>
