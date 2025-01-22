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
        <select v-model="select_empty_acc">
          <option value="bf">Blox-fruit</option>
          <option value="fisch">Fisch</option>
          <option value="dead">Dead</option>
        </select>
        <button @click="getEmptyAcc">getEmptyAcc</button>
      </div>
      <div class="field-action">
        DeadAccount:
        <button @click="getDeadAccount">Copy dead account (user:pass:cookie)</button>
        <button @click="deleteDeadAccount">Delete dead account and copy</button>

      </div>
      <div class="field-action">
        ByPass:
        <textarea  style="width: 500px;height: 300px" v-model="bypass_cookie" placeholder="Cookie"></textarea>
        <textarea  style="width: 500px;height: 300px" v-model="bypass_email" placeholder="Email"></textarea>
        <textarea  style="width: 500px;height: 300px" v-model="bypass_proxy" placeholder="Proxy"></textarea>
        <button @click="actionByPass">Action</button>
        <button @click="getProxy">getProxy</button>
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
      select_empty_acc: 'bf',
      // bf || fisch || dead



      usernameFind: '',
      usernameFindData: '',
      selectStartDeviceIndex: '',
      selectEndDeviceIndex: '',
      listAccSelected: [],

      numberAccountGet:0,
      bypass_proxyIndex: 0,
      bypass_proxy: '',
      bypass_email: 'duongbsaobs261707521111111111111118@ancd.us',
      bypass_cookie: '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_4D49312456199D54AE46597D804376A2F730CBCC649FA2BE1A8BF8E69A33C260640BD452E04631AEFB14323DAD47D7A81EF8F3C7C34E9CE8444FDA4D38F3F24D34C425FB3EECF746578DEFDAB1485A47C1DEECBA9967D502EBE78F2C5BD5BA8C7D27E2772BA5B41887C634F71BA6C6435FE66F5D9FD696C837960D65C820B8CEB66B5C64984517EB882CAEBD94358A7D92F157637501BBDABF0ABB7370C8DF4AC662988A4B7C15B7BED24B08714FB0D40E4B020581EEB1DEDA8251C98708F681D802B541805FFCC924BBC62AB97007B41E65F7EEFAD5C318B733BD54C31C0EA5386AB04D54C13EB29E8837AE10C8042960FE85AE63FC1613E69D1863E029E566FB2F18C74A5C0EA3A6FD5D96EEF2CBEE4F5CC6B64D594BDE46BC8496B92AAF8C302F6188675C6B7FA117FA13DF62146A81501B2DFB1175858DBD9F36D5E730A4E6C31240A5EF0471FCDEA495EAF85DD7FF83E374C4ACF6D6D5B15F3E22D884FA6BBC9582E1BE870AEB922758CB86AD55BE974890A05931E66C8936219E4CC0D78E54689F0D90482BE8E42100DB1CB1DB76C7843755A04C8E8ACBEF46852F5EE470897EEB71AD1C0F80ED134AFF488FDF8A92DE81CC9AE3FA96DBFF43516ED272CA7C154C2474206FEDFB71804D7FC5125DBB699AD20A5FBCDD68D3E0D0C94F8E612DA5435FDB96E3D8B3FEC4255C54C841C716B5C8FEAA45BE2E9D408694927F1B4C4A6C'
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
      console.log('resultData',result)
    },
    async getEmptyAcc() {
      const empty_url = (this.select_empty_acc === 'fisch' ? 'fischemptyaccounts' : (this.select_empty_acc === 'dead' ? 'replacement-accounts' : 'emptyaccounts')) || 'emptyaccounts'
      const listCompleted = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/${empty_url}`, {
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
    async actionByPass() {
      const accountPerMail = 15
      const listEmail = this.bypass_email.split('\n').filter(Boolean)
      const listCookie = this.bypass_cookie.split('\n').filter(Boolean)
      const needMail = Math.ceil(listCookie.length / accountPerMail)
      console.log('needMail',needMail)
      if (needMail > listEmail.length){
        alert(`Need more ${needMail - listEmail.length} email!`);
        return false
      }
      console.log('listEmail',listEmail)
      console.log('listCookie',listCookie)
      let count = 0
      let mailIndex = 0
      for (let i = 0; i < listCookie.length; i++) {

        const cookie = listCookie[i]
        if (cookie){
          count+=1
          // get X-Csrf-Token
          let xCsrfToken = this.getXCsrfToken(cookie,listEmail[mailIndex])
          // try {
          //   const response = await this.$axios.$post(`https://accountsettings.roblox.com/v1/email`, {
          //     emailAddress: listEmail[mailIndex],
          //     password: ""
          //   },{
          //     Cookie: '.ROBLOSECURITY=' + cookie,
          //     headers: {
          //       'Content-Type': 'application/json;charset=UTF-8',
          //     },
          //   });
          // } catch (error) {
          //   if (error.response && error.response.status === 403) {
          //     xCsrfToken = error.response.headers['x-csrf-token'];
          //     console.log(`X-Csrf-Token: ${xCsrfToken}`);
          //   } else {
          //     console.error('Lỗi:', error.message);
          //   }
          // }
          const response = await this.$axios.$post(`https://accountsettings.roblox.com/v1/email`, {
            emailAddress: listEmail[mailIndex],
            password: ""
          },{
            headers: {
              'Cookie': '.ROBLOSECURITY=' + cookie,
              'Content-Type': 'application/json;charset=UTF-8',
              'X-Csrf-Token': xCsrfToken,
            },
          });
          if (count >=accountPerMail){
            mailIndex +=1
            count = 1
          }
        }
      }
    },
    async getXCsrfToken(cookie,email) {
      const listProxy = this.bypass_proxy.split('\n').filter(Boolean)
      let xCsrfToken = ''
      try {
        const response = await this.$axios.$post(`https://accountsettings.roblox.com/v1/email`, {
          emailAddress: email,
          password: ""
        },{
          Cookie: '.ROBLOSECURITY=' + cookie,
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          xCsrfToken = error.response.headers['x-csrf-token'];
          console.log(`X-Csrf-Token: ${xCsrfToken}`);
        } else {
          console.error('Lỗi:', error.message);
        }
      }
    },
    async getProxy(){
      const listProxy = this.bypass_proxy.split('\n').filter(Boolean)
      console.log('listProxy',listProxy)
      for (let i = 0; i < listProxy.length; i++) {
        const proxyAr = listProxy[i].split(':')
        const proxy = {host: proxyAr[0],port: proxyAr[1]}
        console.log('proxy',proxy)
        try {
          const response = await this.$axios.$post(`https://accountsettings.roblox.com/v1/email`, {
            emailAddress: 'duongbsaobs261707521111111111111118@ancd.us',
            password: ""
          },{
            Cookie: '.ROBLOSECURITY=' + '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_E2E6CD9490BE5F6B52BDE80F36856B998122815EF8278F01EFB74EC59215D846C7CD56F3E56C17D01CE839196AEC8B5FFB485A0A473BE55AE123EC7C8D4368130DCE1F5436ACB75B02BD8CB83A0189556B73CD52828E43929C220A1578C3E4DD1882F970975A36E7074E96F176710A94F68654347FCAD4FD850A51A36A5395A5CB409705D9D9A4529F063F958C700255B975C00AAD14B6E29F18D1BA2D3CF47F4069DF7940706EE6469ABAB83AE6C8B670B6A6910CB4EB7C379468FE64CBA02DD8989ADD110B3581F7D291ADCCF0B89E6E6AC5D9D584D8867EA1AB8AEE248CA02CD54D547524FDF62E6D2540F4E5C8BF684E21A726A4C5CD804E3D997A6C7480F5DBB8EB02FA5E26DB71DDC161C84E8BD596194F05F60E657832A00CE7407783C6E4D00A9E1C2A872A90715B3BCBD915E791E54D86AD581D8F2E1B2DCEA451ECBC95166E8CFE40C6BE74DFA7C0349729F05EE6ADB2024BC5580B2BBC841774699C967F870DFD75105B45DDE4BE608381EA033FEDBC630D9343C403ADFA7FD32377A6A2F00D1E2070973B9553301F015547CC68C09B8C208A7D4778F1A39AB12FDBB12741C211006CA8D270786F53A1ED84D64A43CCEC393BB8449F8CBE436F71EEC904A67A3768E1D9F1505EDAF638548676EAEBD2BB2F9FC4FB146E0F7D45B4C578D792F01035F5720A555F43FA19A919A46AC53C32C159BA60BF9654CC778A77DCEA54',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
            proxy: {
              host: proxy.host,
              port: proxy.port,
            },
          });

          if (response.status === 429) {
            console.log(`Proxy ${proxy.host}:${proxy.port} is rate-limited.`);
          } else {
            console.log(`Proxy ${proxy.host}:${proxy.port} is working.`);
            return true;
          }
        } catch (error) {
          console.error(`Error with proxy ${proxy.host}:${proxy.port} - ${error.message}`);
        }
      }

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
