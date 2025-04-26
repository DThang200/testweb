<template>
</template>

<script>
export default {
  data() {
    return {
      bgsiStat: [],
    }
  },
  mounted() {
    this.getStat();
  },
  methods: {
    async getStat() {
      const responseCompleted = await this.$axios.$get('https://yummytrackstat.com/api/settings/items/bubble-gum-simulator-infinity', {
        headers: {
          'authorization': 'Bearer GvKP0qMP3eXg5wy7lkPC6cBiPUf0PE',
          'cookie': 'sidebar_state=true',
          'content-type': 'application/json',
          'accept': '*/*',
          'accept-encoding': 'gzip, deflate, br, zstd',
          'accept-language': 'en-US,en;q=0.9,vi;q=0.8,vi-VN;q=0.7',
          'referer': 'https://yummytrackstat.com/bubble-gum-simulator-infinity',
          'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        }
      });
      console.log('responseCompleted', responseCompleted)
    }
  }
}
</script>
