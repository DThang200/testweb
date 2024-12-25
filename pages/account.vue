<template>
  <div>
    <div>
      <div style="font-size: 24px;font-weight: bold">
        <button @click="copyContent(listNoMythicFruit)">Copy</button>
        List no fruit
      </div>
      <textarea  style="width: 500px;height: 300px" disabled v-model="listNoMythicFruit">

      </textarea>
    </div>
    <div>
      <div style="font-size: 24px;font-weight: bold">
        <button @click="copyContent(list3TrashMythic)">Copy</button>
        List 3 trash mythic
      </div>
      <textarea  style="width: 500px;height: 300px" disabled v-model="list3TrashMythic">

      </textarea>
    </div>
    <div>
      <div style="font-size: 24px;font-weight: bold">
        <button @click="copyContent(ListBothMythic)">Copy</button>
        List both mythic
      </div>
      <textarea  style="width: 500px;height: 300px" disabled v-model="ListBothMythic">

      </textarea>
      {{countListBoth}}
    </div>
  </div>
</template>

<script>
export default {
  beforeDestroy() {
  },
  data () {
    return {
      listCompletedAcc : [],
      listNoMythicFruit : '',
      list3TrashMythic : '',
      listVipMythic : ["Leopard-Leopard","Dragon-Dragon","Kitsune-Kitsune","Dough-Dough","Gas-Gas"],
      ListBothMythic : [],
      countListBoth: {}
    }
  },
  async mounted() {
    this.listVipMythic.forEach(fruit => {
      this.countListBoth[fruit] = 0
    })






    await this.getCompletedAccount();
  },
  methods: {
    async getCompletedAccount() {
      const listCompleted = await this.$axios.$get(`https://frontend.robloxmanager.com/v1/accounts`, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
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
              if (countVipMythic > 2){
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
            }
          }
        })
      }
    },
    copyContent(content) {
      navigator.clipboard.writeText(content);
    }
  }
};
</script>

<style>
</style>
