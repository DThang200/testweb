<template>
  <div>
    <div style="display: flex;flex-direction: row; gap: 12px">
      <div style="flex: 1;border: black solid 1px;padding: 12px">
        <div class="button-save" style="width: 100%;display: flex;justify-content: end">
          <button @click="onSave('map_key_token_gom')">Save setup key trading</button>
        </div>
        <div class="list-item">
          <template v-if="listData.map_key_token_gom?.length > 0">
            <template v-for="(data,index) in listData.map_key_token_gom">
              <div class="row-item">
                <div v-if="map_key_token_gom_state[index]?.key" style="width: 250px">
                  {{data?.key}}
                </div>
                <input v-else v-model="data.key" style="width: 250px" placeholder="Name">
                <input v-model="data.token" style="width: 50%"  placeholder="Key">
              </div>
            </template>
          </template>
          <button class="button-save" @click="addKey('map_key_token_gom')">+Add key trading</button>
        </div>
      </div>
      <div style="flex: 1;border: black solid 1px;padding: 12px">
        <select v-model="showGame">
          <option value="">All</option>
          <option value="ttd">TTD</option>
          <option value="gag">GAG</option>
          <option value="bgsi">BGSI</option>
        </select>
        <div class="button-save" style="width: 100%;display: flex;justify-content: end">
          <button class="" @click="onSave('map_key_token_farm')">Save setup key farm</button>
        </div>
        <div class="list-item">
          <template v-if="listData.map_key_token_farm?.length > 0">
            <template v-for="(data,index) in listData.map_key_token_farm">
              <template v-if="data?.isNew ||( hideDevice.includes(data?.key) && (!showGame || (showGame && map_device_data[map_code_device_id[data?.key.replace(/ /g, `_`)]]?.script.includes(showGame))))">
                <div class="row-item">
                  <div v-if="map_key_token_farm_state[index]?.key" style="width: 250px">
                    {{data?.key}}
                  </div>
                  <input v-else v-model="data.key" style="width: 250px" placeholder="Name">
                  <input v-model="data.token" style="width: 25%" placeholder="Banana">
                  <input v-model="data.nousigi" style="width: 25%" placeholder="Nousigi">
                </div>
              </template>
            </template>
          </template>
          * key vps phải có dấu cách giữa VPS và số
          <button class="button-save" @click="addKey('map_key_token_farm')">+Add key Farm</button>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {
      showGame: "",
      hideDevice: [],
      listData : {
        map_key_token_gom: [],
        map_key_token_farm: [],
      }
    };
  },
  computed: {
    ...mapState({
      roblox_data_state: state => state.roblox_data,
      map_key_token_gom_state: state => state.map_key_token_gom,
      map_key_token_farm_state: state => state.map_key_token_farm,
      map_device_data: state => state.map_device_data,
      map_code_device_id: state => state.map_code_device_id,
    }),
  },
  watch:{
  },
  mounted() {
    this.getDataRoblox();
    this.getKeyGom();
    this.getKeyFarm();
    this.initData();
    this.hideDevice =  JSON.parse(localStorage.getItem('hideDevice')) || [];
  },
  methods: {
    ...mapActions([
      'getDataRoblox',
      'getKeyGom',
      'getKeyFarm',
    ]),
    initData() {
      this.listData.map_key_token_gom = JSON.parse(JSON.stringify(this.map_key_token_gom_state))
      this.listData.map_key_token_farm = JSON.parse(JSON.stringify(this.map_key_token_farm_state))
    },
    addKey(key = ''){
      this.listData[key].push({isNew : true})
    },
    onSave(key = '',localKey=''){
      localStorage.setItem(key, JSON.stringify(this.listData[localKey || key]));
      if (localKey === 'map_key_token_gom'){
        this.getKeyGom();
      }
      if (localKey === 'map_key_token_farm'){
        this.getKeyFarm();
      }
    }
  }
};
</script>
<style>
.list-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row-item {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.button-save {
  position: sticky;
  top: 10px;
  right: 10px;
}
</style>
