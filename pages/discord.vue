<template>

  <div>
    <div>
      channelId
      <input type="text" v-model="channelId">
      querry
      <input type="text" v-model="q">
      <button @click="getStat()">
        Get Data
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channelId: '1420798644298186835',
      q: 'content=Iscanur%20(Pride)&sort_by=timestamp&sort_order=desc&offset=0',
      data: null,
      error: '',
      loading: false
    }
  },
  mounted() {
    this.getStat();
  },
  methods: {
    async getStat() {
      const res = await this.$axios.$get('/api/discord', {
        params: { channelId: this.channelId}
      })
      console.log(res)
    }
  }
}
</script>
