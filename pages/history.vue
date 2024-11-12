<template>
  <div style="width: 800px;border: black solid 1px;">
    <div v-for="(device, index) in device_history_1h" style="display: flex;flex-direction: row;gap: 8px;justify-content: space-between;border-bottom: slategray solid 1px;padding: 0 12px" :key="`time-${device?.time}`">
      <div>
        Time: {{device?.date}}
      </div>
      <div>
        Performance: {{device?.rate || 0}}% ({{(device?.total * device?.rate / 100).toFixed(0)}} device)
      </div>
      <div style="width: 200px;border: red solid 1px">
        <template v-if="device?.showInactive">
          <template v-for="(item,index) in device?.offlineList">
            <template v-if="index !== 0">,</template>
            <span style="white-space: nowrap">{{item}}</span>
          </template>
        </template>
        <button type="button" @click="showInactive(index)">
          {{device?.showInactive ? 'hide' : 'show'}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
      device_history_1h: []
    }
  },
  mounted() {
    let dataHistory = {}
    const data = localStorage.getItem('device_history_1h') ?  JSON.parse(localStorage.getItem('device_history_1h')) : []
    data.forEach(item => {
      const indexItem = item?.date
      if (!dataHistory[indexItem]){
        dataHistory[indexItem] = {
          date: item.date,
          rate: item?.data.rate,
          showInactive: false,
          offlineList: [],
          total: item?.data?.total
        }
      }
      dataHistory[indexItem].rate = parseFloat(((dataHistory[indexItem].rate + item.data.rate) / 2).toFixed(2))
      dataHistory[indexItem].total = parseFloat(((dataHistory[indexItem].total + item.data.total) / 2).toFixed(2))
      dataHistory[indexItem].offlineList = [...new Set([...dataHistory[indexItem].offlineList,...item.data.offlineList])]
    })
    this.device_history_1h = JSON.parse(JSON.stringify(Object.entries(dataHistory).map(item => {return item[1]})))
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    },
    showInactive(index){
      this.device_history_1h[index].showInactive = !this.device_history_1h[index]?.showInactive
    }
  }
};
</script>

<style>
.page-content-example {
  gap: 16px;
}
</style>
