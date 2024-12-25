export const state = () => ({
  globalErrors: [],
  roblox_data: [],
  roblox_data_account: [],
  map_device_id_code: {},
  map_code_device_id: {},
  map_device_code_sum_acc: {},
  map_code_detail: {},
  map_key_token_gom: [],
  map_key_token_farm: [],
  map_device_key_value: {},
  map_device_data: {},
  total: 0,
  device_history: {},
  last_save_history_data: {},
  today_save_history_data: {},
  delete_account: {},
})

export const mutations = {
  SET_GLOBAL_ERRORS(state, errors) {
    state.globalErrors = errors
  },
  SET_DATA_ROBLOX(state, data) {
    state.roblox_data= data
  },
  SET_ACCOUNT_ROBLOX(state, data) {
    console.log('SET_ACCOUNT_ROBLOX',data)
    state.roblox_data_account= data
  },
  SET_MAP_DEVICE_ID_CODE(state, data) {
    state.map_device_id_code= data
  },
  SET_MAP_CODE_DEVICE_ID(state, data) {
    state.map_code_device_id= data
  },
  SET_MAP_DEVICE_CODE_SUM_ACC(state, data) {
    state.map_device_code_sum_acc= data
  },
  SET_MAP_DEVICE_CODE_DETAIL(state, data) {
    state.map_code_detail= data
  },
  SET_MAP_KEY_TOKEN_GOM(state, data) {
    state.map_key_token_gom= data
  },
  SET_MAP_KEY_TOKEN_FARM(state, data) {
    state.map_key_token_farm= data
  },
  SET_MAP_DEVICE_DATA(state, data) {
    state.map_device_data= data
  },
  SET_DATA_HISTORY(state, data) {
    state.device_history= data
  },
  SET_LAST_SAVE_DATA(state, data) {
    state.last_save_history_data= data
  },
  SET_TODAY_SAVE_DATA(state, data) {
    state.today_save_history_data= data
  },
  SET_DELETE_ACC(state, data) {
    state.delete_account= data
  },
}

export const actions = {
  setError({ commit }, errors) {
    commit('SET_GLOBAL_ERRORS', errors)
  },
  async getDataRoblox({commit}, param = {}) {
    try {
      const response = await this.$axios.$get(this.$config.API_ROBLOX, {
        headers: {
          'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        },
      });
      const device_remotes = JSON.parse(localStorage.getItem('device_remotes'));
      let map_device_id_code = {}
      let map_code_device_id = {}
      if (response.devices){
        response.devices.forEach(item => {
          item.device_code = item.device_name.replace(/ /g, '_')
          const active_accounts_ar = item.active_accounts.split('/')
          item.inactive = JSON.parse(active_accounts_ar[1] || 0) - JSON.parse(active_accounts_ar[0] || 0)
          item.active = JSON.parse(active_accounts_ar[1] || 0)
          if (device_remotes && device_remotes[item.device_code]){
            item.device_remote = device_remotes[item.device_code]
          }else {
            item.device_remote = ''
          }
          map_device_id_code[item.device_id] = item.device_code
          map_code_device_id[item.device_code] = item.device_id
        })
      }
      console.log('response',response)
      await commit('SET_DATA_ROBLOX', response)
      await commit('SET_MAP_DEVICE_ID_CODE', map_device_id_code)
      await commit('SET_MAP_CODE_DEVICE_ID', map_code_device_id)
      ///Save history 1h
      console.log('Save history 1h')
      let currentTime = new Date().getTime();
      let next_time_save_history = localStorage.getItem('next_time_save_history') ?  new Date(parseInt(localStorage.getItem('next_time_save_history'))).getTime() : ''
      //timestamp
      if (currentTime > next_time_save_history || !next_time_save_history){
        next_time_save_history = new Date();
        next_time_save_history.setHours(next_time_save_history.getHours() + 1);
        next_time_save_history.setMinutes(0);
        next_time_save_history.setSeconds(0);
        localStorage.setItem('next_time_save_history', next_time_save_history.getTime());
        let device_history_1h = localStorage.getItem('device_history_1h') ?  JSON.parse(localStorage.getItem('device_history_1h')) : []
        let offlineList = [];
        let totalAcc = 0;
        let totalInactiveAcc = 0;
        response.devices.forEach(data => {
          totalAcc += data?.total_accounts
          totalInactiveAcc += data?.inactive_accounts
          if (data?.inactive_accounts > data?.total_accounts - 5){
            offlineList.push(data?.device_name)
          }
        })
        next_time_save_history.setHours(next_time_save_history.getHours() - 1);

        const date = new Date("2024-11-12T00:00:00Z"); // Giả sử thời gian là 2024-11-12, giờ UTC
        const options = {
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        };

        const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);
        device_history_1h.push({time: next_time_save_history.getTime(),date: formattedDate,
          data: {
            total: response?.devices?.length ,
            offlineList: offlineList,
            totalAcc: totalAcc,
            totalActiveAcc: totalAcc - totalInactiveAcc,
            totalInactiveAcc: totalInactiveAcc,
            rate: parseFloat(((totalAcc - totalInactiveAcc) / totalAcc).toFixed(3)) * 100,
          }})
        localStorage.setItem('device_history_1h', JSON.stringify(device_history_1h));
      }
    } catch (e) {
      console.log('Error',e)
    }
  },
  async getDataAccount({commit,state}, param = {}) {
    setTimeout(async () => {
      try {
        // const cacheKey = 'response_API_ROBLOX_ACCOUNT';
        // const cachedData = localStorage.getItem(cacheKey);
        // let response = {}
        // if (cachedData) {
        //   // Dữ liệu đã được lưu trữ, chỉ cần lấy ra sử dụng
        //   response = JSON.parse(cachedData);
        // } else {
        //   // Gọi API và lưu lại kết quả
        //   try {
        //     const responseApi = await this.$axios.$get(this.$config.API_ROBLOX_ACCOUNT, {
        //       headers: {
        //         'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
        //       },
        //     });
        //     responseApi.accounts = responseApi.accounts.slice(0,200)
        //     response = responseApi
        //     // Lưu vào localStorage
        //     localStorage.setItem(cacheKey, JSON.stringify(response));
        //   } catch (error) {
        //     console.error('API call failed:', error);
        //   }
        // }
        const response = await this.$axios.$get(this.$config.API_ROBLOX_ACCOUNT, {
          headers: {
            'x-auth-token': JSON.parse(localStorage.getItem('token_roblox')) || this.$config.TOKEN_ROBLOX,
          },
        });
        const map_device_id_code = {...state.map_device_id_code}
        const map_device_code_sum_acc = {}
        let map_device_code_detail = {}
        const map_code_detail = {}
        if (response.accounts) {
          response.accounts.forEach(item => {
            if (!map_device_code_sum_acc[map_device_id_code[item.device_id]]) {
              map_device_code_sum_acc[map_device_id_code[item.device_id]] = 0
            }
            if (!map_device_code_detail[map_device_id_code[item.device_id]]) {
              map_device_code_detail[map_device_id_code[item.device_id]] = {
                Gems: 0, Crystal: 0
              }
            }
            try {
              if (item.status && JSON.parse(item.status)) {
                // const crystal = this.getCrystal(item.status)
                // const gems = this.getGems(item.status)
                let gems = 0
                let crystal = 0
                try {
                  const statusParse = item.status ? JSON.parse(item.status) : false
                  if (!statusParse || !statusParse || !statusParse?.Items || !statusParse?.Items["Trait Crystal"]){
                    crystal = 0
                  }
                  if (!statusParse || !statusParse || !statusParse?.Currencies || !statusParse?.Currencies["Gems"]){
                    gems = 0
                  }
                  crystal = statusParse?.Items["Trait Crystal"] || 0
                  gems = statusParse?.Currencies["Gems"] || 0
                } catch (e) {
                  crystal = 0
                  gems = 0
                }
                map_device_code_sum_acc[map_device_id_code[item.device_id]] += crystal ? crystal : 0
                map_device_code_detail[map_device_id_code[item.device_id]].Gems += gems ? gems : 0
                map_device_code_detail[map_device_id_code[item.device_id]].Crystal += crystal ? crystal : 0
              }
            } catch (e) {
              console.log('Error', e)
            }
          })
        }
        await commit('SET_MAP_DEVICE_CODE_DETAIL', map_device_code_detail)
        await commit('SET_ACCOUNT_ROBLOX', response)
        await commit('SET_MAP_DEVICE_CODE_SUM_ACC', map_device_code_sum_acc)

        ///Save history by day

        const date = new Date()
        let last_day_save_history = localStorage.getItem('last_day_save_history') ?  new Date(localStorage.getItem('last_day_save_history')) : null
        if (last_day_save_history) {
          last_day_save_history.setHours(24);
        }
        if (date > last_day_save_history || !last_day_save_history) {
          const today = new Date();
          const options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          };
          const formatter = new Intl.DateTimeFormat('en-CA', options);
          localStorage.setItem('last_day_save_history', formatter.format(today).replace(/\//g, '-'));
          const sum_all = {Crystal: 0,Gems : 0}
          Object.entries(map_device_code_detail).forEach(data => {
              sum_all.Gems += data[1].Gems
              sum_all.Crystal += data[1].Crystal
            })
          const last_save_history_data = localStorage.getItem('today_save_history_data') || JSON.stringify({...map_device_code_detail,time: today.getTime()})
          localStorage.setItem('last_save_history_data',last_save_history_data);
          await commit('SET_LAST_SAVE_DATA', JSON.parse(last_save_history_data));
          localStorage.setItem('today_save_history_data', JSON.stringify({...map_device_code_detail,All: sum_all,time: today.getTime()}));
          await commit('SET_TODAY_SAVE_DATA', {...map_device_code_detail,All: sum_all,time: today.getTime()})
        }

        ///Save history

        // const date = new Date()
        // const timeIndex = date.getTime()
        // const hourNow = (date.getUTCHours() + 7) % 24
        // const saveTime = [6,12,18,24]
        // let saveTimeNow = 6
        // let last_time_save_history = JSON.parse(localStorage.getItem('last_time_save_history'))
        // if (last_day_save_history){
        //
        // }
        // if (!last_time_save_history) {
        //   localStorage.setItem('last_time_save_history', '6');
        // }
        // if (hourNow > last_time_save_history || last_time_save_history === hourNow || (last_time_save_history === 24 && hourNow < 6) || true){
        //   saveTime.forEach(time => {
        //     if (time < hourNow || time == hourNow || ((last_time_save_history === 24 && hourNow < 6))) {
        //       saveTimeNow = time
        //     }
        //   })
        //   if (saveTimeNow !== 24) {
        //     localStorage.setItem('last_time_save_history', JSON.stringify(parseInt(saveTimeNow) + 6));
        //   } else {
        //     localStorage.setItem('last_time_save_history', '6');
        //   }
        //   let device_history = JSON.parse(localStorage.getItem('device_history')) || {}
        //   const sum_all = {Crystal: 0,Gems : 0}
        //   Object.entries(map_device_code_detail).forEach(data => {
        //     sum_all.Gems += data[1].Gems
        //     sum_all.Crystal += data[1].Crystal
        //   })
        //   device_history[timeIndex] = {...map_device_code_detail,All: sum_all,time: timeIndex}
        //   localStorage.setItem('device_history', JSON.stringify(device_history));
        //   await commit('SET_DATA_HISTORY', device_history)
        // }
      } catch (e) {
        return false
      }
    },500)
    return true

  },
  initDataHistory({commit,state}, param = {}){
    commit('SET_LAST_SAVE_DATA', JSON.parse(localStorage.getItem('last_save_history_data')) || {})
    commit('SET_TODAY_SAVE_DATA', JSON.parse(localStorage.getItem('today_save_history_data')) || {})
  },
  initStatusDevice({commit,state}, param = {}){
    commit('SET_MAP_DEVICE_DATA', JSON.parse(localStorage.getItem('map_device_data')) || {})

  },
  setStatusDevice({commit,state}, param = {device_id: '',key: '',value: ''}){
    let map_device_data = JSON.parse(localStorage.getItem('map_device_data')) || {}
    // param.device_id
    if (!map_device_data[param.device_id]) {
      map_device_data[param.device_id] = {
        [param.key] : param.value
      }
    }
    map_device_data[param.device_id][param.key] = param.value
    localStorage.setItem('map_device_data', JSON.stringify(map_device_data));
    commit('SET_MAP_DEVICE_DATA', map_device_data)

  },
  setSaveDeleteAccount({commit,state}, param= {key: '',value: ''}){
    console.log('setSaveDeleteAccount',param)
    let delete_account = JSON.parse(localStorage.getItem('delete_account')) || {}
    // param.device_id
    if (!delete_account[param.key]){
      delete_account[param.key] = []
    }
    const listAcc = param.value.split('\n')
    let listAccHandle = []
    listAcc.forEach(acc => {
      if (acc){
        const acc_arr = acc.split(':')
        console.log('acc_arr',acc_arr)
        listAccHandle.push(acc_arr[0] + ':' + acc_arr[1])
      }
    })
    delete_account[param.key].push({time: new Date().getTime(),value : JSON.stringify(listAccHandle) })
    localStorage.setItem('delete_account', JSON.stringify(delete_account));
    commit('SET_DELETE_ACC', delete_account)

  },
  getKeyGom({commit,state}, param = {}){
    let map_key_token_gom = JSON.parse(localStorage.getItem('map_key_token_gom'))
    if (!map_key_token_gom) {
      map_key_token_gom = [
        {
          key: 'huydunghello70',
          token: 'bvdINvPBUAtEvQqYNCDKLdtQDYmApOak'
        },
        {
          key: 'nhipro010',
          token: 'btoGTLjvtGcoParGnXxsMrrhCWKOrFxT'
        },
        {
          key: 'dungckpt',
          token: 'bvdINvPBUAtEvQqYNCDKLdtQDYmApOak'
        },
        {
          key: 'dungckpt123',
          token: 'LKrMEFsNREfYVCqwTqcFfpLEBySOFbhc'
        },
      ]
      localStorage.setItem('map_key_token_gom', JSON.stringify(map_key_token_gom));
    }
    commit('SET_MAP_KEY_TOKEN_GOM', map_key_token_gom)
  },
  getKeyFarm({commit,state}, param = {}){
    let map_key_token_farm = JSON.parse(localStorage.getItem('map_key_token_farm'))
    if (!map_key_token_farm) {
      map_key_token_farm = [
        {"key": "VPS 1", "token": "47ea033749632761e460712f"},
        {"key": "VPS 2", "token": "47ea033749632761e460712f"},
        {"key": "VPS 3", "token": "c5fa8182eb74e34bf48f16eb"},
        {"key": "VPS 4", "token": "c5fa8182eb74e34bf48f16eb"},
        {"key": "VPS 5", "token": "f6f678bf61fdab4b76d7571c"},
        {"key": "VPS 6", "token": "f6f678bf61fdab4b76d7571c"},
        {"key": "VPS 7", "token": "7c3c391da0632a0147c3ef3a"},
        {"key": "VPS 8", "token": "7c3c391da0632a0147c3ef3a"},
        {"key": "VPS 9", "token": "e4f94ea4669f3a1c044668fc"},
        {"key": "VPS 10", "token": "e4f94ea4669f3a1c044668fc"},
        {"key": "VPS 11", "token": "b488e3c14f5e25fcd43daa61"},
        {"key": "VPS 12", "token": "d7f7608fef87e754d1510caf"},
        {"key": "VPS 13", "token": "d3df3e56e3756580111485a3"},
        {"key": "VPS 14", "token": "64a61519f389132932292216"},
        {"key": "VPS 15", "token": "38fb652df0ca8cf8b7a507ba"},
        {"key": "VPS 16", "token": "c11696405e1561cd3a6f450f"},
        {"key": "VPS 17", "token": "b4541c14f46e298c5389fa94"},
        {"key": "VPS 18", "token": "b6412104a07daf6773524757"},
        {"key": "VPS 19", "token": "b1f74cae26e32925d79d3da1"},
        {"key": "VPS 20", "token": "7db4a18eacb69f6cc85e6723"},
        {"key": "VPS 21", "token": "04ade172c19f505e8a5cf8b6"},
        {"key": "VPS 22", "token": "ddc6ce331623f7c48962d911"},
        {"key": "VPS 23", "token": "3505e80c92e311a07a69c4a6"},
        {"key": "VPS 24", "token": "23146ec0279c90dac364086b"},
        {"key": "VPS 25", "token": "07d282c8cad2eff22473778d"},
        {"key": "VPS 26", "token": "b903aff8405970a1fbff7033"},
        {"key": "VPS 27", "token": "13d43782a332052bdc8ae351"},
        {"key": "VPS 28", "token": "61f871946fc8169e7e5544f5"},
        {"key": "VPS 29", "token": "3f616e5fa578f8a1de174596"},
        {"key": "VPS 30", "token": "22390cf0de6f266e8811cb23"},
        {"key": "VPS 31", "token": "791b6379d256c55655413970"},
        {"key": "VPS 32", "token": "deea0957072b86362b911c2c"},
        {"key": "VPS 33", "token": "d2d3accfa9b4da8492b0833b"},
        {"key": "VPS 34", "token": "46d97a18f299e49fecc36a08"},
        {"key": "VPS 35", "token": "65c2518ca9ef6fd65b1fea2c"},
        {"key": "VPS 36", "token": "cb3a12041db7afdbed2be970"},
        {"key": "VPS 37", "token": "a25ac9dedfa20828de8efe9c"},
        {"key": "VPS 38", "token": "ebcd40d123ac3e523a9654d4"},
        {"key": "VPS 39", "token": "eed91fb158d40169df4c30a7"},
        {"key": "VPS 40", "token": "eb275b3f2ef04eee81d5fa8e"},
        {"key": "VPS 41", "token": "72082a2c1410bd5ed2041cb6"},
        {"key": "VPS 42", "token": "181c168b99da1a950b94d79d"},
        {"key": "VPS 43", "token": "d9a02ccd712a869ae93d6e88"},
        {"key": "VPS 44", "token": "2e98e911217156870b7f3ba4"},
        {"key": "VPS 45", "token": "15cadcf6f669b3089e6c93fb"},
        {"key": "VPS 46", "token": "f263af18b17896c5dcdab612"},
        {"key": "VPS 47", "token": "b51466002203b28ea6984508"},
        {"key": "VPS 48", "token": "8205503d50115fdacfcc0614"},
        {"key": "VPS 49", "token": "9ecae65014a0105e067dd7cd"},
        {"key": "VPS 50", "token": "f75bf3a4767a81e8cd2464e4"},
        {"key": "VPS 51", "token": "f16a4d70105bc5e68209ad78"},
        {"key": "VPS 52", "token": "0fd5fc55bd7d678c2081e977"},
        {"key": "VPS 53", "token": "c87343bff297b8c3125c78b6"},
        {"key": "VPS 54", "token": "f547b06a89f99286824e1505"},
        {"key": "VPS 55", "token": "a5db3cf75afe66d09caeb77b"},
        {"key": "VPS 56", "token": "b5d577eb625324bcac2a536b"},
        {"key": "VPS 57", "token": "5d7d030269ea2c99cb8848f4"},
        {"key": "VPS 58", "token": "4deb93ec38d73cee66965173"},
        {"key": "VPS 59", "token": "aeae7a21cc6e10e4289ddaeb"},
        {"key": "VPS 60", "token": "e2a6ae132b874b1ffaaffd9f"},
        {"key": "VPS 61", "token": "e6e3b1eaad810558f27d1cab"},
        {"key": "VPS 62", "token": "16634d96df491224ebe3c4d4"},
        {"key": "VPS 63", "token": "793ee1af4b8ebed15bec0cd2"},
        {"key": "VPS 64", "token": "c65e9c3b26a5fb783e721337"},
        {"key": "VPS 65", "token": "46ce88889539012a349f1d6a"},
        {"key": "VPS 66", "token": "7ac972148876844e409b32e7"},
        {"key": "VPS 67", "token": "faa04136161114ce12c4f249"},
        {"key": "VPS 68", "token": "6f676115cbbfb58ebe752817"},
        {"key": "VPS 69", "token": "486df8b7fe091a55f2b15038"},
        {"key": "VPS 70", "token": "db78a8b61d96eaff783f65d6"},
        {"key": "VPS 71", "token": "ee84aab37c7ef07260e8f8df"},
        {"key": "VPS 72", "token": "deee859c5990eb89e6af43d2"},
        {"key": "VPS 73", "token": "74eb82334dd918a142e12b65"},
        {"key": "VPS 74", "token": "a8939bee1299fe291c2c88fd"},
        {"key": "VPS 75", "token": "f6ff6e4214104ea5de3daca8"},
        {"key": "VPS 76", "token": "a00b736991f342e194687957"},
        {"key": "VPS 77", "token": "16f63d3c4b777a5f98a528ba"},
        {"key": "VPS 78", "token": "50ad409c8ec2f47334cf9c80"},
        {"key": "VPS 79", "token": "755236956c5f9f986c274e2d"},
        {"key": "VPS 80", "token": "d7c38a8596a0c1acca03c34e"},
        {"key": "VPS 81", "token": "20f8c90c3b3ca0b68679a743"},
        {"key": "VPS 82", "token": "8f9574d872b4ba3d02eb13a5"},
        {"key": "VPS 83", "token": "5780f485ab4825c2b1de18fe"},
        {"key": "VPS 84", "token": "281044bfb8b5583389f46320"},
        {"key": "VPS 85", "token": "916dffff44870c66084000ab"},
        {"key": "VPS 86", "token": "f1890bce82bc25891dd8591b"},
        {"key": "VPS 87", "token": "bf2a27c3bb221cd82381b69b"},
        {"key": "VPS 88", "token": "e37224510c5a3ee7bee4e5ad"},
        {"key": "VPS 89", "token": "6f643f1cddcf8c13b02a5d4f"},
        {"key": "VPS 90", "token": "c34a1db9b5c6d0a07e288a16"},
        {"key": "VPS 91", "token": "8b8ee463437582b230d38cce"},
        {"key": "VPS 92", "token": "3c240759b62637a013e3c994"},
        {"key": "VPS 93", "token": "90e3bb4f224e8b5a01112196"},
        {"key": "VPS 94", "token": "a018595e9573d4d25ec4901d"},
        {"key": "VPS 95", "token": "5c7aa4c5574c4b7e0fa871a5"},
        {"key": "VPS 96", "token": "8b8ee463437582b230d38cce"},
        {"key": "VPS 97", "token": "3c240759b62637a013e3c994"},
        {"key": "VPS 98", "token": "90e3bb4f224e8b5a01112196"},
        {"key": "VPS 99", "token": "a018595e9573d4d25ec4901d"},
        {"key": "VPS 100", "token": "5c7aa4c5574c4b7e0fa871a5"},
        {"key": "VPS 101", "token": "b488e3c14f5e25fcd43daa61"},
        {"key": "VPS 102", "token": "d7f7608fef87e754d1510caf"},
        {"key": "VPS 103", "token": "d3df3e56e3756580111485a3"},
        {"key": "VPS 104", "token": "64a61519f389132932292216"},
        {"key": "VPS 105", "token": "38fb652df0ca8cf8b7a507ba"},
        {"key": "VPS 106", "token": "c11696405e1561cd3a6f450f"},
        {"key": "VPS 107", "token": "b4541c14f46e298c5389fa94"},
        {"key": "VPS 108", "token": "b6412104a07daf6773524757"},
        {"key": "VPS 109", "token": "b1f74cae26e32925d79d3da1"},
        {"key": "VPS 110", "token": "7db4a18eacb69f6cc85e6723"},
        {"key": "VPS 111", "token": "04ade172c19f505e8a5cf8b6"},
        {"key": "VPS 112", "token": "ddc6ce331623f7c48962d911"},
        {"key": "VPS 113", "token": "3505e80c92e311a07a69c4a6"},
        {"key": "VPS 114", "token": "23146ec0279c90dac364086b"},
        {"key": "VPS 115", "token": "07d282c8cad2eff22473778d"},
        {"key": "VPS 116", "token": "b903aff8405970a1fbff7033"},
        {"key": "VPS 117", "token": "13d43782a332052bdc8ae351"},
        {"key": "VPS 118", "token": "61f871946fc8169e7e5544f5"},
        {"key": "VPS 119", "token": "3f616e5fa578f8a1de174596"},
        {"key": "VPS 120", "token": "22390cf0de6f266e8811cb23"},
        {"key": "VPS 121", "token": "791b6379d256c55655413970"},
        {"key": "VPS 122", "token": "deea0957072b86362b911c2c"},
        {"key": "VPS 123", "token": "d2d3accfa9b4da8492b0833b"},
        {"key": "VPS 124", "token": "46d97a18f299e49fecc36a08"},
        {"key": "VPS 125", "token": "65c2518ca9ef6fd65b1fea2c"},
        {"key": "VPS 126", "token": "cb3a12041db7afdbed2be970"},
        {"key": "VPS 127", "token": "a25ac9dedfa20828de8efe9c"},
        {"key": "VPS 128", "token": "ebcd40d123ac3e523a9654d4"},
        {"key": "VPS 129", "token": "eed91fb158d40169df4c30a7"},
        {"key": "VPS 130", "token": "eb275b3f2ef04eee81d5fa8e"},
        {"key": "VPS 131", "token": "72082a2c1410bd5ed2041cb6"},
        {"key": "VPS 132", "token": "181c168b99da1a950b94d79d"},
        {"key": "VPS 133", "token": "d9a02ccd712a869ae93d6e88"},
        {"key": "VPS 134", "token": "2e98e911217156870b7f3ba4"},
        {"key": "VPS 135", "token": "15cadcf6f669b3089e6c93fb"},
        {"key": "VPS 136", "token": "f263af18b17896c5dcdab612"},
        {"key": "VPS 137", "token": "b51466002203b28ea6984508"},
        {"key": "VPS 138", "token": "8205503d50115fdacfcc0614"},
        {"key": "VPS 139", "token": "9ecae65014a0105e067dd7cd"},
        {"key": "VPS 140", "token": "f75bf3a4767a81e8cd2464e4"},
        {"key": "VPS 141", "token": "f16a4d70105bc5e68209ad78"},
        {"key": "VPS 142", "token": "0fd5fc55bd7d678c2081e977"},
        {"key": "VPS 143", "token": "c87343bff297b8c3125c78b6"},
        {"key": "VPS 144", "token": "f547b06a89f99286824e1505"},
        {"key": "VPS 145", "token": "a5db3cf75afe66d09caeb77b"},
        {"key": "VPS 146", "token": "b5d577eb625324bcac2a536b"},
        {"key": "VPS 147", "token": "5d7d030269ea2c99cb8848f4"},
        {"key": "VPS 148", "token": "4deb93ec38d73cee66965173"},
        {"key": "VPS 149", "token": "aeae7a21cc6e10e4289ddaeb"},
        {"key": "VPS 150", "token": "e2a6ae132b874b1ffaaffd9f"},
        {"key": "VPS 151", "token": "e6e3b1eaad810558f27d1cab"},
        {"key": "VPS 152", "token": "16634d96df491224ebe3c4d4"},
        {"key": "VPS 153", "token": "793ee1af4b8ebed15bec0cd2"},
        {"key": "VPS 154", "token": "c65e9c3b26a5fb783e721337"},
        {"key": "VPS 155", "token": "46ce88889539012a349f1d6a"},
        {"key": "VPS 156", "token": "7ac972148876844e409b32e7"},
        {"key": "VPS 157", "token": "faa04136161114ce12c4f249"},
        {"key": "VPS 158", "token": "6f676115cbbfb58ebe752817"},
        {"key": "VPS 159", "token": "486df8b7fe091a55f2b15038"},
        {"key": "VPS 160", "token": "db78a8b61d96eaff783f65d6"},
        {"key": "VPS 161", "token": "ee84aab37c7ef07260e8f8df"},
        {"key": "VPS 162", "token": "deee859c5990eb89e6af43d2"},
        {"key": "VPS 163", "token": "74eb82334dd918a142e12b65"},
        {"key": "VPS 164", "token": "a8939bee1299fe291c2c88fd"},
        {"key": "VPS 165", "token": "f6ff6e4214104ea5de3daca8"},
        {"key": "VPS 166", "token": "a00b736991f342e194687957"},
        {"key": "VPS 167", "token": "16f63d3c4b777a5f98a528ba"},
        {"key": "VPS 168", "token": "50ad409c8ec2f47334cf9c80"},
        {"key": "VPS 169", "token": "755236956c5f9f986c274e2d"},
        {"key": "VPS 170", "token": "d7c38929c1f8a13e9a112cc5"},
        {"key": "VPS 171", "token": "20f8c90c3b3ca0b68679a743"},
        {"key": "VPS 172", "token": "9a11d005937f3e6deb3c61f4"},
        {"key": "VPS 173", "token": "5780f485ab4825c2b1de18fe"},
        {"key": "VPS 174", "token": "281044bfb8b5583389f46320"},
        {"key": "VPS 175", "token": "916dffff44870c66084000ab"},
        {"key": "VPS 176", "token": "f1890bce82bc25891dd8591b"},
        {"key": "VPS 177", "token": "bf2a27c3bb221cd82381b69b"},
        {"key": "VPS 178", "token": "e37224510c5a3ee7bee4e5ad"},
        {"key": "VPS 179", "token": "6f643f1cddcf8c13b02a5d4f"},
        {"key": "VPS 180", "token": "c34a1db9b5c6d0a07e288a16"},
        {"key": "VPS 181", "token": "d74965f59cd99f1010157390"},
        {"key": "VPS 182", "token": "d74965f59cd99f1010157390"},
        {"key": "VPS 183", "token": "052541e613f154c86315de17"},
        {"key": "VPS 184", "token": "052541e613f154c86315de17"},
        {"key": "VPS 185", "token": "1c2cff301b7f792396999074"},
        {"key": "VPS 186", "token": "1c2cff301b7f792396999074"},
        {"key": "VPS 187", "token": "30d363c9f9540b020fd731c2"},
        {"key": "VPS 188", "token": "30d363c9f9540b020fd731c2"},
        {"key": "VPS 189", "token": "ff51f9a5b5a2a4a856921d85"},
        {"key": "VPS 190", "token": "ff51f9a5b5a2a4a856921d85"},
        {"key": "VPS 191", "token": "644c75a336c48e06ddcdf7ff"},
        {"key": "VPS 192", "token": "644c75a336c48e06ddcdf7ff"},
        {"key": "VPS 193", "token": "6d6cdf4babd7a44d40c97055"},
        {"key": "VPS 194", "token": "6d6cdf4babd7a44d40c97055"},
        {"key": "VPS 195", "token": "5d2c41659b0dc9a7022061f7"},
        {"key": "VPS 196", "token": "5d2c41659b0dc9a7022061f7"},
        {"key": "VPS 197", "token": "b3416a81c2e00c73d2d6f289"},
        {"key": "VPS 198", "token": "b3416a81c2e00c73d2d6f289"},
        {"key": "VPS 199", "token": "25fbecb6f995aa7cfd6a885d"},
        {"key": "VPS 200", "token": "25fbecb6f995aa7cfd6a885d"},
        {"key": "VPS 201", "token": "0f6f26f9ec3f6fb0c8318fce"},
        {"key": "VPS 202", "token": "0f6f26f9ec3f6fb0c8318fce"},
        {"key": "VPS 203", "token": "8f9574d872b4ba3d02eb13a5"},
        {"key": "VPS 204", "token": "8f9574d872b4ba3d02eb13a5"},
        {"key": "VPS 205", "token": "9a11d005937f3e6deb3c61f4"},
        {"key": "VPS 206", "token": "9a11d005937f3e6deb3c61f4"},
        {"key": "VPS 207", "token": "fa10764e251db60589413c1e"},
        {"key": "VPS 208", "token": "fa10764e251db60589413c1e"},
        {"key": "VPS 209", "token": "ed50c0cf53b84f5b14c3e788"},
        {"key": "VPS 210", "token": "ed50c0cf53b84f5b14c3e788"},
        {"key": "VPS 211", "token": "6087472ecbfce9c3dcea1347"},
        {"key": "VPS 212", "token": "6087472ecbfce9c3dcea1347"},
        {"key": "VPS 213", "token": "b3cdec3b2299d56c98d3aaae"},
        {"key": "VPS 214", "token": "b3cdec3b2299d56c98d3aaae"},
        {"key": "VPS 215", "token": "62dad5e8f728abdbfb4a3808"},
        {"key": "VPS 216", "token": "62dad5e8f728abdbfb4a3808"},
        {"key": "VPS 217", "token": "5a67fd1de691e9b13a316f54"},
        {"key": "VPS 218", "token": "5a67fd1de691e9b13a316f54"},
        {"key": "VPS 219", "token": "5ef9994abc6e4028e8556ed9"},
        {"key": "VPS 220", "token": "5ef9994abc6e4028e8556ed9"},
        {"key": "VPS 221", "token": "ebaf47a1db90ff8dd6c25944"},
        {"key": "VPS 222", "token": "ebaf47a1db90ff8dd6c25944"},
        {"key": "add4", "token": "00d3d1c20fe9385afb7ccb30"},
        {"key": "add5", "token": "00d3d1c20fe9385afb7ccb30"},
        {"key": "add6", "token": "d74965f59cd99f1010157390"},
        {"key": "add7", "token": "052541e613f154c86315de17"},
        {"key": "add8", "token": "1c2cff301b7f792396999074"},
        {"key": "add9", "token": "30d363c9f9540b020fd731c2"},
        {"key": "add10", "token": "ff51f9a5b5a2a4a856921d85"},
        {"key": "add11", "token": "644c75a336c48e06ddcdf7ff"},
        {"key": "add12", "token": "6d6cdf4babd7a44d40c97055"},
        {"key": "add13", "token": "5d2c41659b0dc9a7022061f7"},
        {"key": "add14", "token": "b3416a81c2e00c73d2d6f289"},
        {"key": "add15", "token": "25fbecb6f995aa7cfd6a885d"}
      ]
      localStorage.setItem('map_key_token_farm', JSON.stringify(map_key_token_farm));
    }
    commit('SET_MAP_KEY_TOKEN_FARM', map_key_token_farm)
  },

  getCrystal(status){
    try {
      const statusParse = status ? JSON.parse(status) : false
      if (!statusParse || !statusParse || !statusParse?.Items || !statusParse?.Items["Trait Crystal"]){
        return 0
      }
      return statusParse?.Items["Trait Crystal"] || 0
    } catch (e) {
      return 0
    }
  },
  getGems(status){
    try {
      const statusParse = status ? JSON.parse(status) : false
      if (!statusParse || !statusParse || !statusParse?.Currencies || !statusParse?.Currencies["Gems"]){
        return 0
      }
      console.log('statusParse?.Currencies',statusParse?.Currencies)
      return statusParse?.Currencies["Gems"] || 0
    } catch (e) {
      return 0
    }
  },
}
