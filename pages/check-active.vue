<template>
  <div>
    <textarea v-model="list_active" @change="getInactive">

    </textarea>
    <div style="display: flex;flex-direction: column">
      <div>count : {{list_inactive.length || 0}}</div>
      <div v-for="inactive in list_inactive">
        {{inactive}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bgsiStat: [],
      list_active:"",
      list_inactive:[],
      hideDevice:[],
    }
  },
  mounted() {
    this.hideDevice =  JSON.parse(localStorage.getItem('hideDevice')) || [];
  },
  methods: {
    getInactive(){
      const showDevice = this.hideDevice
      const curr_active_line = this.list_active.split('\n')
      const curr_active = curr_active_line.map(line => {return (line.match(/(VSP\S*)/)[0]).replace(/\bVSP_0/g, "VPS ").replace(/\bVSP_/g, "VPS ")})
      this.list_inactive = []
      console.log('curr_active',curr_active)
      showDevice.forEach(device => {
        if (!curr_active.includes(device)){
          this.list_inactive.push(device)
        }
      })
      console.log("this.list_inactive",this.list_inactive)
    }
  }
}
</script>
