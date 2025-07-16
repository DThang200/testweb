<template>
  <div>
    <div style="display: flex;gap: 10px;flex-shrink: 1">
      <textarea v-model="inputServer" style="width: 500px;height: 300px">
      </textarea>
      <button :disabled="onRunning" style="flex-shrink: 0" @click="openTab">Open tab</button>
      current tab open {{this.tabRunIndex + 1}}
    </div>
  </div>
</template>

<script>


export default {
  computed: {
  },
  watch:{
  },
  data() {
    return {
      inputServer: "",
      tabRunIndex: 0,
      output: "",
      onRunning: false,
    };
  },
  beforeDestroy() {
  },
  mounted() {},
  methods: {
    openTab() {
      this.onRunning = true
      this.tabRunIndex = 0
      const listLink = this.inputServer.split('\n')
      const intervalOpenTab = setInterval(() => {
        const crrLink = listLink[this.tabRunIndex]
        window.open(`${crrLink}`, '_blank')
        this.tabRunIndex +=1
        if (this.tabRunIndex > listLink.length){
          clearInterval(intervalOpenTab)
          this.onRunning = false
        }
      },15000)
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
