<template>
  <div style="display: flex;flex-direction: row">
    <div style="border-right:  black solid 1px;flex: 1">
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(listNoMythicFruit)">Copy</button>
          List no fruit
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="listNoMythicFruit">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(list3TrashMythic)">Copy</button>
          List 3 trash mythic
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="list3TrashMythic">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(listGodMaxNoMythicFruit)">Copy</button>
          List god max no mythic
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="listGodMaxNoMythicFruit">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(listDisable)">Copy</button>
          listDisable
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="listDisable">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(list1TrashMythicGod)">Copy</button>
          List 1 trash god-mythic
          <button @click="deleteAccount(list1TrashMythicGod,'list1TrashMythicGod')">Delete</button>
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="list1TrashMythicGod">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          <button @click="copyContent(ListBothMythic)">Copy</button>
          List both mythic
        </div>
        <textarea  style="width: 500px;height: 300px" disabled v-model="ListBothMythic">

      </textarea>
        {{countListBoth}}
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          User pass cookie => user pass
          <button @click="copyContent(user_pass)">Copy</button>
        </div>
        <textarea  style="width: 500px;height: 300px" v-model="user_pass_cookie" @change="renderUPCtoUP">

      </textarea>
        <textarea  style="width: 500px;height: 300px" v-model="user_pass">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          User pass cookie => cookie
          <button @click="copyContent(input_ck)">Copy</button>
        </div>
        <textarea  style="width: 500px;height: 300px" v-model="input_ck" @change="getCk">

      </textarea>
        <textarea  style="width: 500px;height: 300px" v-model="output_ck">

      </textarea>
      </div>
      <div class="field-acc">
        <div style="font-size: 24px;font-weight: bold">
          User pass cookie => File Format
          <button @click="copyContent(user_pass_cookie2)">Copy</button>
        </div>
        <textarea  style="width: 500px;height: 300px" v-model="user_pass_cookie2" @change="renderUPCtoFileFormat">

      </textarea>
        <textarea  style="width: 500px;height: 300px" v-model="user_pass_cookie_file">

      </textarea>
      </div>
      <div class="field-acc" style="background: red">
        <div style="font-size: 24px;font-weight: bold">
          Delete acc per row
          <button @click="deleteAccPerRow()">Delete</button>
        </div>
        <textarea  style="width: 500px;height: 300px" v-model="delete_acc">

      </textarea>
      </div>
    </div>
    <div style="flex: 1">
      <div class="field-action">
        <input v-model="usernameFind">
        <button @click="Findaccbyusername">Find acc by username</button>
        <div v-if="usernameFindData">
          <div>Device : {{map_device_id_code[usernameFindData?.device_id]}} </div>
          <div><button @click="copyContent(usernameFindData?.username + ':' + usernameFindData?.password + ':' + usernameFindData?.cookie);">Copy User:pass:cookie</button></div>
          <div><button @click="copyContent(usernameFindData?.cookie);">Copy cookie</button></div>
          <div><button @click="copyContent(usernameFindData?.username + ':' + usernameFindData?.password)">Copy User:pass</button></div>
        </div>
      </div>
      <div class="field-action">

        <div style="display: flex;flex-direction: row;gap: 8px">
          From
          <select v-model="selectStartDeviceIndex">
            <option value="0">0</option>
            <option :value="index" v-for="(device,index) in roblox_data.devices">{{device.device_code}}</option>
          </select>
          To
          <select v-model="selectEndDeviceIndex">
            <option :value="roblox_data.devices?.length">All</option>
            <option :value="index" v-for="(device,index) in roblox_data.devices">{{device.device_code}}</option>
          </select>
          <button @click="getDetailAcc">Copy username pass</button>
        </div>
      </div>
      <div class="field-action">
        NumberAccount:
        <input v-model="numberAccountGet">
        <button @click="getEmptyAcc">getEmptyAcc</button> (from : https://robloxmanager.com/dashboard/emptyaccounts)
      </div>
      <div class="field-action">
        DeadAccount:
        <button @click="getDeadAccount">Copy dead account (user:pass:cookie)</button>
        <button @click="deleteDeadAccount">Delete dead account and copy</button>

      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState({
      roblox_data: state => state.roblox_data,
      map_device_id_code: state => state.map_device_id_code,
    }),
  },
  beforeDestroy() {
  },
  data () {
    return {
      listCompletedAcc : [],
      listDisable : '',
      listNoMythicFruit : '',
      listGodMaxNoMythicFruit : '',
      list1TrashMythicGod : '',
      list3TrashMythic : '',
      listVipMythic : ["Leopard-Leopard","Dragon-Dragon","Kitsune-Kitsune","Gas-Gas","Yeti-Yeti"],
      listVipMythic2 : ["Leopard-Leopard","Dragon-Dragon","Kitsune-Kitsune","Gas-Gas","Yeti-Yeti","Dough-Dough","T-Rex-T-Rex"],
      ListBothMythic : [],
      countListBoth: {},
      user_pass_cookie: '',
      user_pass_cookie2: '',
      user_pass_cookie_file: '',
      user_pass: '',
      input_ck: '',
      output_ck: '',
      delete_acc: '',



      usernameFind: '',
      usernameFindData: '',
      selectStartDeviceIndex: '',
      selectEndDeviceIndex: '',
      listAccSelected: [],

      numberAccountGet:0
    }
  },
  async mounted() {
    this.listVipMythic.forEach(fruit => {
      this.countListBoth[fruit] = 0
    })





    this.getDataRoblox();
    await this.getCompletedAccount();
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'setSaveDeleteAccount',
    ]),
    async getCompletedAccount() {
      const listCompleted = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const map_device_data = JSON.parse(localStorage.getItem('map_device_data')) || {};
      if (listCompleted && listCompleted?.accounts?.length > 0){
        this.listCompletedAcc = listCompleted.accounts
        this.listNoMythicFruit = ''
        listCompleted.accounts.forEach((item) => {
          if (item && item?.status){
            const status = JSON.parse(item?.status)
            /// acc no fruit
            if (status?.Fruits?.Mythical?.length === 0){
              this.listNoMythicFruit += `${item.username}:${item.password}:${item.cookie}` + '\n'
            }

            let isTrashMythic = true

            /// acc 3 mythic trash
            if (status?.Fruits?.Mythical?.length >= 2){
              let isTrashMythic = true
              let countVipMythic = 0
              const countVipMythicObj = this.listVipMythic.reduce((obj, item) => {
                obj[item] = 0;
                return obj;
              }, {});
              this.listVipMythic.forEach(fruit => {
                if (status?.Fruits?.Mythical.includes(fruit)){
                  countVipMythicObj[fruit] +=1
                  countVipMythic +=1
                  isTrashMythic = false
                }
              })
              if (countVipMythic >= 2){
                console.log('itemitemitemitem',item)
                const result = {};
                for (const key in this.countListBoth) {
                  result[key] = this.countListBoth[key] + (countVipMythicObj[key] || 0); // Nếu obj2[key] không tồn tại, sử dụng 0
                }
                this.countListBoth = result
                this.ListBothMythic += `${item.username}:${item.password}:${item.cookie}` + '\n'
              }
              if (isTrashMythic && status?.Fruits?.Mythical?.length >= 3){
                this.list3TrashMythic += `${item.username}:${item.password}:${item.cookie}` + '\n'
              }
            } else if (status?.Fruits?.Mythical?.length === 1 && status?.Melees.includes("Godhuman")){
              let isTrashMythic = true
              this.listVipMythic.forEach(fruit => {
                if (status?.Fruits?.Mythical.includes(fruit)){
                  isTrashMythic = false
                }
              })
              if (isTrashMythic){
                this.list1TrashMythicGod += `${item.username}:${item.password}:${item.cookie}` + '\n'
                if (status?.Level === 2600){
                  this.listGodMaxNoMythicFruit += `${item.username}:${item.password}:${item.cookie}` + '\n'
                }
              }
            } else if (status?.Level === 2600 &&  status?.Melees.includes("Godhuman")){
              let isTrashMythic = true
              this.listVipMythic2.forEach(fruit => {
                if (status?.Fruits?.Mythical.includes(fruit)){
                  isTrashMythic = false
                }
              })
              if (isTrashMythic){
              }
              if (isTrashMythic || status?.Fruits?.Mythical?.length === 0){
                this.listGodMaxNoMythicFruit += `${item.username}:${item.password}:${item.cookie}` + '\n'
              }
            }
          }
          if (!item?.enabled && ['bloxFruit-25maru','bloxFruit-fruit','bloxFruit-2550','bloxFruit-maru'].includes(map_device_data[item?.device_id]?.script)){
            this.listDisable += `${item.username}:${item.password}:${item.cookie}` + '\n'
          }
        })
      }
    },
    copyContent(content) {
      navigator.clipboard.writeText(content);
      console.log('copyContent',content)
    },
    async deleteAccount(content, key) {
      if (!key) {
        return false
      }

      const listAcc = content.split('\n')
      this.downloadFile(this.delete_acc,`delete-${listAcc?.length}account`)
      await this.setSaveDeleteAccount(key, content);
      const listUsername = listAcc.map(user => {
        if (user){
          return  user.split(':')[0]
        }
      })

      // const resSetScriptFisch = await this.$axios.delete(`https://frontend.robloxmanager.com/v1/bulk/accounts`, {
      //   data: deleteAcc,
      //   headers: {
      //     'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
      //   },
      // });
    },
    renderUPCtoUP(){
      const user_pass_cookie = this.user_pass_cookie.split('\n')
      let result = ''
      user_pass_cookie.forEach(item => {
        if (item){
          const acc_arr = item.split(':')
          if (acc_arr?.length > 0){
            result += `${acc_arr[0]}:${acc_arr[1]}` + '\n'
          }
        }
      })
      this.user_pass = result
    },
    getCk(){
      console.log('getCk')
      const user_pass_cookie = this.input_ck.split('\n')
      let result = ''
      user_pass_cookie.forEach(item => {
        if (item){
          result += item.substring(item.indexOf('_|WARNING')) + '\n'
        }
      })
      this.output_ck = result
    },
    renderUPCtoFileFormat(){
      console.log('getCk')
      const user_pass_cookie = this.user_pass_cookie2.split('\n')
      let result = ''
      let resultup = ''
      let resultck = ''
      let count = 0
      user_pass_cookie.forEach(item => {
        if (item){
          const acc_arr = item.split(':')
          result += item + '\n'
          resultup += `${acc_arr[0]}:${acc_arr[1]}` + '\n'
          resultck += item.substring(item.indexOf('_|WARNING')) + '\n'
          count += 1
        }
      })
      this.user_pass_cookie_file = result + '\n' + resultup + '\n' + `Số dòng của cookie sẽ bằng dòng (line cookie by) userpass + ${count + 1} ` + '\n' + resultck + '\n'+ '\n'+ '\n'+ '\n'+ '\n'+ '\n'+ '\n'+ '\n' + 'link shop fb : https://www.facebook.com/profile.php?id=61571050329694'
    },
    async deleteAccPerRow() {
      if (confirm("Bạn có muốn xóa tài khoản")){
        const correctPassword = "matkhau123@"; // Mật khẩu cố định
        const userPassword = prompt("Vui lòng nhập mật khẩu để xóa tài khoản");

        if (userPassword !== correctPassword) {
          alert("Mật khẩu không chính xác");
          return false
        }
      } else {
        return false
      }
      const user_pass_cookie = this.delete_acc.split('\n')
      console.log('user_pass_cookie',user_pass_cookie)
      this.downloadFile(this.delete_acc,`delete-${user_pass_cookie?.length}account`)
      await this.setSaveDeleteAccount({key: 'deleteAccPerRow',value: this.delete_acc});
      let deleteAcc = []
      user_pass_cookie.forEach(item => {
        if (item) {
          const acc_arr = item.split(':')
          if (acc_arr?.length > 0) {
            deleteAcc.push({username_look_for:acc_arr[0]})
          }
        }
      })
      const resDelete = await this.$axios.delete(`https://frontend.robloxmanager.com/v1/bulk/accounts`, {
        data: deleteAcc,
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      // deleteAcc
      alert("Delete done");
    },

    Findaccbyusername(){
      //
      this.usernameFindData = this.listCompletedAcc.find( acc => acc.username === this.usernameFind)
    },
    getDetailAcc(){
      //
      let listDevice = []
      for (let i = this.selectStartDeviceIndex; i <= this.selectEndDeviceIndex; i++) {
        listDevice.push(this.roblox_data.devices[i]?.device_id)
      }
      let resultData = []
      let result = ''
      this.listCompletedAcc.forEach(acc => {
        if (listDevice.includes(acc.device_id)){
          // resultData.push(acc)
          result += `${acc?.username}:${acc?.password}:${acc?.cookie}`+ '\n'
        }
      })
      navigator.clipboard.writeText(result);
      console.log('resultData',resultData)
    },
    async getEmptyAcc() {
      const listCompleted = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/emptyaccounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const listAcc = listCompleted.accounts.slice(0,this.numberAccountGet)
      console.log('listAcc',listAcc)
      let result = ''
      listAcc.forEach(acc => {
        result += `${acc?.username}:${acc?.password}:${acc?.cookie}`+ '\n'
      })
      await navigator.clipboard.writeText(result);
    },
    async getDeadAccount() {
      const listDead = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/cookie-dead-accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      let result = ''
      listDead.accounts.forEach(acc => {
        result += `${acc?.username}:${acc?.password}:${acc?.cookie}`+ '\n'
      })
      await navigator.clipboard.writeText(result);
    },
    async deleteDeadAccount() {
      const listDead = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/cookie-dead-accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      let result = ''
      listDead.accounts.forEach(acc => {
        if (acc){
          result += `${acc?.username}:${acc?.password}:${acc?.cookie}`+ '\n'
        }
      })
      this.delete_acc = result
      await this.deleteAccPerRow();
    },
    downloadFile(content,fileName) {
      // Nội dung file
      const today = new Date();

      // Lấy ngày, tháng, năm
      const day = String(today.getDate()).padStart(2, '0'); // Đảm bảo 2 chữ số
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const year = String(today.getFullYear()).slice(-2); // Lấy 2 số cuối của năm
      const hours = String(today.getHours()).padStart(2, "0");
      const minutes = String(today.getMinutes()).padStart(2, "0");
      const seconds = String(today.getSeconds()).padStart(2, "0");

      const datekey = `${day}-${month}-${year}-${hours}h-${minutes}m-${seconds}s`

      // Tạo đối tượng Blob
      const blob = new Blob([content], { type: "text/plain" });

      // Tạo đường dẫn tải file
      const url = URL.createObjectURL(blob);

      // Tạo thẻ <a> để tải file
      const link = document.createElement("a");
      link.href = url;
      link.download = datekey + '/' + fileName + ".txt"; // Tên file

      // Thêm thẻ <a> vào DOM, kích hoạt tải và xóa nó
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Giải phóng URL
      URL.revokeObjectURL(url);
    },
  }
};
</script>

<style>
.field-acc {
}
.field-action {
  border: black solid 1px;
  padding: 20px;
  width: 100%;
}
</style>
