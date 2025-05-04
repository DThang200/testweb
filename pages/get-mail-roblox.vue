<template>
  <div>
    <div style="display: flex;flex-direction: row; gap: 16px">
      <div>
        <div>
          countMail : {{countMail}}
        </div>
      <textarea v-model="mail" style="width: 300px;height: 300px" @change="countMail = countRow(mail)">
      </textarea>
      </div>
      <button @click="GetLink">Get link</button>
      <div v-if="!pending">
        <div>
          countLink : {{countLink}}  <button @click="GetLink">Copy link</button>
        </div>
        <textarea v-model="listLink" style="width: 300px;height: 300px" disabled>
      </textarea>
      </div>
      <template v-if="listLink">
        <button @click="RunLink">Run link</button>
        timePerLink
        <input v-model="timePerLink" style="height: 23px"/>
        <div style="width: 300px;height: 300px;overflow: auto" ref="runningStatus">
          {{isRuningStatus}}
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      listLink : '',
      mailCode: '',
      mail: '',
      countMail: 0,
      countLink: 0,
      pending: true,
      isRuningStatus : '',
      timePerLink : 3000,
      openLinkInterval : null,
    };
  },
  beforeDestroy() {
    clearInterval(this.openLinkInterval)
  },
  mounted() {
  },
  methods: {
    countRow(value){
      return  value.split('\n').length
    },
    GetLink(){
      this.pending = true
      this.listLink = ''
      const listMail = this.mail.split('\n')
      listMail.forEach(mailLine => {
        if (mailLine){
          const data = mailLine.split('|')
          this.GetMail(data[0],data[2],data[3])
        }
      })
      this.pending = false
      this.countLink = this.countRow(this.listLink)
    },
    async GetMail(email,refresh_token,client_id) {
      this.pending = true
      const responseCompleted = await this.$axios.$post(`https://tool.unlimitmail.com/api/get_messages_oauth2`, {
        "email": email,
        "refresh_token": refresh_token,
        "client_id": client_id
      });
      console.log('responseCompleted',responseCompleted)
      if (responseCompleted.messages && responseCompleted.messages.length > 1){
        responseCompleted.messages.forEach(mess => {
          if (mess.from[0].name && mess.from[0].name === "Roblox"){
            const regex = /Verify Email \((.*?)\)\r\n\r\n<p>Thank You,<br \/>/;
            const match = mess.text_body.match(regex);
            if (match && match[1]) {
              const extractedText = match[1];
              this.listLink += extractedText + "\n"
              this.countLink = this.countRow(this.listLink)
            } else {
              console.log("Không tìm thấy đoạn text phù hợp.");
            }
          }
        })
      }
      this.pending = false
    },
    RunLink(){
      const listLink = this.listLink.split('\n')
      let runLinkIndex = 0
      this.isRuningStatus = ''
      this.openLinkInterval = setInterval(() => {
        if (!listLink[runLinkIndex]){
          runLinkIndex +=1
        }
        this.isRuningStatus += `Running link ${runLinkIndex + 1} : ${listLink[runLinkIndex]} \n`
        const newWindow = window.open(listLink[runLinkIndex], '_blank');
        if (newWindow) {
          window.focus();
        }
        runLinkIndex +=1
        if (runLinkIndex > listLink.length){
          clearInterval(this.openLinkInterval)
        }
        this.$refs.runningStatus.scrollIntoView({
          behavior: 'smooth'
        });
      },this.timePerLink)
    }
  }
};
</script>
<style scoped>
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 10px 20px;
}
</style>
