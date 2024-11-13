<template>
  <div>
    {{roblox_data_account?.accounts?.length? 'Đã xong' : ''}}
    <select :disabled="!(roblox_data_account?.accounts?.length)" v-model="select_pc">
      <option value="">All</option>
      <option :value="device.device_id" v-for="device in roblox_data.devices">{{device.device_code}}</option>
    </select>
    <div style="display: flex;flex-direction: row;gap: 12px">
      <div>
        Total Crystal : <span style="font-weight: bold;font-size: 20px">{{total_crystal_all.toLocaleString('de-DE')}}</span>
      </div>
      <div>
        Total Gems : <span style="font-weight: bold;font-size: 20px">{{total_gems_all.toLocaleString('de-DE')}}</span>
      </div>
      <div style="margin-left: 40px">
        0h Crystal : <span style="font-weight: bold;font-size: 20px">{{today_save_history_data['All']?.Crystal.toLocaleString('de-DE')}}(<span :style="`color: ${total_crystal_all - today_save_history_data['All']?.Crystal > 0 ?'#0ECB81' : '#F6465D'}`">{{(total_crystal_all - today_save_history_data['All']?.Crystal).toLocaleString('de-DE')}}</span>)</span>
      </div>
      <div>
        0h Gems : <span style="font-weight: bold;font-size: 20px">{{today_save_history_data['All']?.Gems.toLocaleString('de-DE')}}(<span :style="`color: ${total_gems_all - today_save_history_data['All']?.Gems > 0 ?'#0ECB81' : '#F6465D'}`">{{(total_gems_all - today_save_history_data['All']?.Gems).toLocaleString('de-DE')}}</span>)</span>
      </div>
      <div style="margin-left: 40px">
        Last day Crystal : <span style="font-weight: bold;font-size: 20px">{{last_save_history_data['All']?.Crystal.toLocaleString('de-DE')}}(<span :style="`color: ${today_save_history_data['All']?.Crystal - last_save_history_data['All']?.Crystal > 0 ?'#0ECB81' : '#F6465D'}`">{{(today_save_history_data['All']?.Crystal - last_save_history_data['All']?.Crystal).toLocaleString('de-DE')}}</span>)</span>
      </div>
      <div>
        Last day Gems : <span style="font-weight: bold;font-size: 20px">{{last_save_history_data['All']?.Gems.toLocaleString('de-DE')}}(<span :style="`color: ${today_save_history_data['All']?.Gems - last_save_history_data['All']?.Gems > 0 ?'#0ECB81' : '#F6465D'}`">{{(today_save_history_data['All']?.Gems - last_save_history_data['All']?.Gems).toLocaleString('de-DE')}}</span>)</span>
      </div>
    </div>
    <!--    <div style="margin: 16px 0">-->
    <!--      <div style="display: flex;flex-direction: row;gap: 8px;flex-wrap: wrap">-->
    <!--        History :-->
    <!--        <template v-for="history in device_history_show">-->
    <!--          <div v-for="history_data in  [history[select_pc ? map_device_id_code[select_pc] : 'All']]" style="border: black solid 1px; padding: 8px;white-space: nowrap">-->
    <!--            {{historyTime(history['time'])}}-->
    <!--            RR({{history_data?.Crystal}}(<span :style="`color: ${ total_crystal - history_data?.Crystal > 0 ? '#0ECB81' : '#F6465D'};`">-->
    <!--              {{total_crystal - history_data?.Crystal}}-->
    <!--            </span>)-G({{history_data?.Gems}}(<span :style="`color: ${ total_gems - history_data?.Gems > 0 ? '#0ECB81' : '#F6465D'};`">-->
    <!--              {{total_gems - history_data?.Gems}}-->
    <!--            </span>)-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </div>-->
    <!--    </div>-->
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
      <template  v-if="viewTable.includes('pc')">
        <div>
          <button class="px-2" @click="copyUserPassFunction" type="button" style="margin-bottom: 24px">
            Copy (user:pass:cookie)
          </button>
          <div class="d-flex" style="align-items: center">
            <label for="sort_pc_pc" style="margin-bottom: 0">Pc</label>
            <input value="" type="radio" name="sort_pc" v-model="sort_pc" id="sort_pc_pc" style="margin-right: 10px">
            <label for="sort_pc_crystal" style="margin-bottom: 0">Crystals</label>
            <input value="crystal" type="radio" name="sort_pc" v-model="sort_pc" id="sort_pc_crystal" style="margin-right: 10px">
            <label for="sort_pc_gems" style="margin-bottom: 0">Gems</label>
            <input value="gems" type="radio" name="sort_pc" v-model="sort_pc" id="sort_pc_gems" style="margin-right: 10px">
          </div>
          <table style="height: fit-content">
            <thead>
            <tr>
              <th>STT</th>
              <th>PC</th>
              <th>Crystal</th>
              <th>Gems</th>
              <th colspan="2">1h</th>
              <th colspan="2">Last Day</th>
            </tr>
            </thead>
            <tbody>
            <template>
              <tr v-for="(item,index) in map_code_detail_display">
                <td class="px-2">{{index + 1}}</td>
                <td class="px-2">
                  <label :for="`checkbox_showPc_${item?.code}`">
                    {{item?.code}}
                  </label>
                  <input :id="`checkbox_showPc_${item?.code}`" v-model="selectAccCopy" :value="map_code_device_id[item?.code]" type="checkbox">
                </td>
                <td class="px-2" style="color: #9928f4">{{item?.value?.Crystal}}</td>
                <td class="px-2">{{item?.value?.Gems}}</td>
                <td class="px-2" :style="`${item.colorPerHourCrystal ? 'background:' + item.colorPerHourCrystal + ';color: white' : 'color:#9928f4'}`" v-if="today_save_history_data">{{item.profitPerHourCrystal}}</td>
                <td class="px-2" v-if="today_save_history_data">{{item.profitPerHourGems}}</td>
                <td class="px-2" v-if="today_save_history_data">{{item?.value?.Crystal - last_save_history_data[item?.code]?.Crystal}}</td>
                <td class="px-2" :style="`color: ${(item?.value?.Gems - last_save_history_data[item?.code]?.Gems) > 0 ? '#0ECB81' : '#F6465D'}`" v-if="today_save_history_data">{{(item?.value?.Gems - last_save_history_data[item?.code]?.Gems) > 0 ? '+' : ''}} {{item?.value?.Gems - last_save_history_data[item?.code]?.Gems}}</td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </template>
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
      map_code_device_id: state => state.map_code_device_id,
      map_code_detail: state => state.map_code_detail,
      today_save_history_data: state => state.today_save_history_data,
      last_save_history_data: state => state.last_save_history_data,
    }),
  },
  watch: {
    select_pc(value){
      this.getDataByDeviceId();
    },
    sort_pc(value){
      this.renderListPc(value);
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
      viewTable : ['acc','pc'],
      selectAccCopy: [],
      sort_pc: ''
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
    this.initDataHistory()
    this.intervalId = setInterval(() => {
      this.getDataAccount()
    }, 600 * 1000);
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getDataAccount',
      'initDataHistory',
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
    renderListPc(sort = ''){
      this.map_code_detail_display = Object.keys(this.map_code_detail).map(key => {
        return { code: key, value: this.map_code_detail[key]};
      });
      this.map_code_detail_display.sort((a, b) => {
        if (sort === 'crystal'){
          if (!a.value?.Crystal) return 1;
          if (!b.value?.Crystal) return -1;
          return b.value?.Crystal - a.value?.Crystal;
        } else if (sort === 'gems'){
          if (!a.value?.Gems) return 1;
          if (!b.value?.Gems) return -1;
          return b.value?.Gems - a.value?.Gems ;
        } else {
          if (!a.code) return 1;
          if (!b.code) return -1;
          let numberA = parseInt(a.code.split('_')[1]);
          let numberB = parseInt(b.code.split('_')[1]);
          return numberA - numberB;
        }
      });
      this.map_code_detail_display.forEach(item => {
        item.profitPerHourCrystal = this.getProfitPerHour(item?.value?.Crystal,this.today_save_history_data[item?.code]?.Crystal,this.today_save_history_data['time'])
        item.profitPerHourGems = this.getProfitPerHour(item?.value?.Gems,this.today_save_history_data[item?.code]?.Gems,this.today_save_history_data['time'])
        if (item.profitPerHourCrystal < 251) {
          item.colorPerHourCrystal = '#ff8f00'
        }
        if (item.profitPerHourCrystal < 151) {
          item.colorPerHourCrystal = 'red'
        }
      })
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
    },
    copyUserPassFunction(){
      let copyContent = ''
      this.roblox_data_account.accounts.forEach(item => {
        if (item?.device_id && this.selectAccCopy.includes(item?.device_id)){
          copyContent += `${item.username}:${item.password}:${item.cookie}` + '\n'
        }
      })
      navigator.clipboard.writeText(copyContent);
    },
    renderHistory(value){
      let data_result = []
      Object.entries(value).forEach(data => {
        data_result.push(data[1])
      })
      data_result.sort((a, b) => b.time - a.time);
      this.device_history_show = data_result
    },
    getProfitPerHour(now,start,start_timeStamp){
      const timeStamp = new Date().getTime()
      const timeChange = timeStamp - start_timeStamp
      return ((now - start) * (3600000 / timeChange)).toFixed(1)
    },
    historyTime(timeStamp){
      const now = new Date(timeStamp);
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      return `${hours}:${minutes}(${day}/${month})`
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
