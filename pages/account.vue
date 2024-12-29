<template>
  <div>
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
    <div class="field-acc" style="background: red">
      <div style="font-size: 24px;font-weight: bold">
        Delete acc per row
        <button @click="deleteAccPerRow()">Delete</button>
      </div>
      <textarea  style="width: 500px;height: 300px" v-model="delete_acc">

      </textarea>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
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
      user_pass: '',
      input_ck: '',
      output_ck: '',
      delete_acc: '',
    }
  },
  async mounted() {
    this.listVipMythic.forEach(fruit => {
      this.countListBoth[fruit] = 0
    })






    await this.getCompletedAccount();
  },
  methods: {
    ...mapActions([
      'setSaveDeleteAccount',
    ]),
    async getCompletedAccount() {
      const listCompleted = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      if (listCompleted && listCompleted?.accounts?.length > 0){
        this.listCompletedAcc = listCompleted.accounts
        this.listNoMythicFruit = ''
        const statusTest = JSON.parse(listCompleted.accounts[0]?.status)
        listCompleted.accounts.forEach((item) => {
          if (item && item?.status){
            const status = JSON.parse(item?.status)
            if (status?.melee_statuses && !item?.enabled && !item?.done){
              this.listDisable += `${item.username}:${item.password}:${item.cookie}` + '\n'
            }
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
                this.listGodMaxNoMythicFruit += `${item.username}:${item.password}:${item.cookie}` + '\n'
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
        })
      }
    },
    copyContent(content) {
      navigator.clipboard.writeText(content);
    },
    async deleteAccount(content, key) {
      if (!key) {
        return false
      }
      await this.setSaveDeleteAccount(key, content);
      const listAcc = content.split('\n')
      const listUsername = listAcc.map(user => {
        return  user.split(':')[0]
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
      const user_pass_cookie = this.user_pass_cookie.split('\n')
      let result = ''
      user_pass_cookie.forEach(item => {
        if (item){
          const acc_arr = item.split(':')
          if (acc_arr?.length > 0){
            // result +=  `${acc_arr[0]}:${acc_arr[1]}` + '\n'
            result = acc_arr.match(/:_\|WARNING:(.*?)\n/g).map(match => match.trim().slice(11).trim())[0] + + '\n';
          }
        }
      })
      this.user_pass = result
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
      await this.setSaveDeleteAccount({key: 'deleteAccPerRow',value: this.delete_acc});
      const user_pass_cookie = this.delete_acc.split('\n')
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
    }
  }
};
</script>

<style>
.field-acc {
}
</style>
