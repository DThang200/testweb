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
      channelId: '1420090949584949330',
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
      const messages = await this.$axios.$get('/api/messages')
      console.log('messages')
      return { messages }
    }
  }
}
</script>
