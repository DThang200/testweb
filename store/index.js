export const state = () => ({
  globalErrors: [],
  roblox_data: [],
  roblox_data_account: [],
  map_device_id_code: {},
  map_code_device_id: {},
  map_device_code_sum_acc: {},
  map_code_detail: {},
  total: 0,
})

export const mutations = {
  SET_GLOBAL_ERRORS(state, errors) {
    state.globalErrors = errors
  },
  SET_DATA_ROBLOX(state, data) {
    state.roblox_data= data
  },
  SET_ACCOUNT_ROBLOX(state, data) {
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
          if (device_remotes && device_remotes[item.device_code]){
            item.device_remote = device_remotes[item.device_code]
          }else {
            item.device_remote = ''
          }
          map_device_id_code[item.device_id] = item.device_code
          map_code_device_id[item.device_code] = item.device_id
        })
      }
      await commit('SET_DATA_ROBLOX', response)
      await commit('SET_MAP_DEVICE_ID_CODE', map_device_id_code)
      await commit('SET_MAP_CODE_DEVICE_ID', map_code_device_id)
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
        //         'x-auth-token': this.$config.TOKEN_ROBLOX,
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
        // const response = {
        //   accounts: [
        //     {
        //       "id": 1870229,
        //       "username": "liviaegcbnsfd113",
        //       "password": "egcbnsfd@",
        //       "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_69C8194E77676F7D5DCF14858753D7FBD894A0CE1EA3BEAF80DEE08D9CBFF9FFCBE874D26D696A49BF9FD7FA917EA29050E85A200043293AA256DB08A05D6E060D02200C45DA916393EB610A4E1DAAC1AEC6B13F46A35AA0C4F7D3AB462BA7FBDCF923B5C08AE948E054C4A1CE1C08B7F93E79AF82302E8A04B7699B2CA17D460A25F4BF0978E87A88D58A859A77CDE7514BDA3770AB3D8D229ECEF5AF293AD6EB85B7B97531D32CB4B1CFE50EE5A680D6F5E06647516A7C71A0C5C19D0C9CBD675DB1CA36B35C0748CF0BF95792E7318B99FECA4E81DAEEDD8FB729AF4BF99E42D0995EDAA3D7095186C7DF50BD7C7E2F89C4F1E1E08D341F1D8EE81D99144F3FDF0C555D07B10D11CCED43E685578E5B6A462A14B93EB2794C222E3611B9F6E89259A710824F8703FC31F610C7B0B0AD77A36B109D0743EB856D9F9AEB46F9D52D44DD33BB53A4FE24FA12E54D4675C3E7E453C6BC8D7C20D3F8C48B42F1E246765E0D046FF1BA91A3E33CEB970636211056113817B38573A78214000D943104DC3A39D848F248E2929360959B11CC25C66EEA308609936906F14885FBC85C5F3CAFA7A3E2C6E490DC1D6FE0195B07F89A0A4370F12AB62A3CBA9E68BA80D83BB2E8C674731FE1140F9D5C79D87715AF44A712C8506022BFC98DB900BD33A012B69C961276348635D3B43E02BB9568F0BAEA2C4F334064F8B87C00921C7EB69F3F74973BB71D4E686F354DC1B4235310D8EE8308BB68460F4559BA5473EECE8833949C5116B6D26876EF397B3F9AE8D9B0F4E043EF70C72D35F18A5BCD394C3AFD79853104D22C061EC20333BD6D825799F8D59B6AA4230B62F8920BD56EB189073C81D032499A0F5295ADC340EFCF5ED4DFB41E293213858BD55C898E681DB58639F7F692FD6EC7C8D0BF79CD895FBA64C03AD5152032990EA7B4CE73F1519697B77AF7D808369903484BE23F1885D50BB0E5",
        //       "is_logged_in": true,
        //       "private_server_link": "",
        //       "game_instance_id": "e2021979-5b24-4d61-9028-27f0af04d8c4",
        //       "device_id": "25e1d8077daf5ddd167f206a582a10ed21cfb84c4e791419006fb2be24700f99",
        //       "status": "{\"QuestPools\":{\"Daily\":{\"EndTick\":1725296908},\"Infinite\":{\"EndTick\":1725296908},\"Battlepass1\":{\"EndTick\":1725296908},\"Weekly\":{\"EndTick\":1725296612},\"AthenyxBattlepass\":{\"EndTick\":1725296908}},\"UnlockedRarityCounts\":[null,43,6,1],\"ClanRank\":5,\"ChallengeTimeSeed\":479237,\"ItemConversionLimits\":{\"Solar Token\":20000,\"Lucky Ticket\":500,\"Flame Token\":20000,\"Aqua Token\":20000},\"MaxEquippedEmotes\":6,\"MaxEmotes\":500,\"Currencies\":{\"Gems\":115128,\"Gold\":500},\"Titles\":{\"None\":[]},\"Potion\":{\"AllPotions\":[],\"ActivePotions\":[]},\"CompletedChallenges\":[],\"Quests\":{\"AthenyxSolo_1\":{\"Current\":0,\"Claimed\":false,\"Required\":15},\"BattlePassRaid_1\":{\"Current\":0,\"Claimed\":false,\"Required\":2},\"AthenyxPlaytime_1\":{\"Current\":0,\"Claimed\":false,\"Required\":1800},\"WeeklyStory_1\":{\"Current\":10,\"Claimed\":true,\"Required\":10},\"HallofMirror_1\":{\"Current\":0,\"Claimed\":false,\"Required\":1800},\"SwordsmanDojoInfinite_1\":{\"Current\":0,\"Claimed\":false,\"Required\":15},\"AthenyxStory_1\":{\"Current\":0,\"Claimed\":false,\"Required\":2},\"WeeklyPlaytime_1\":{\"Current\":10800,\"Claimed\":true,\"Required\":10800},\"BattlePassChallenge_1\":{\"Current\":0,\"Claimed\":false,\"Required\":2},\"BattlePassHom_1\":{\"Current\":0,\"Claimed\":false,\"Required\":1200},\"Multiplayer_1\":{\"Current\":0,\"Claimed\":false,\"Required\":15},\"DailyComplete_1\":{\"Current\":2,\"Claimed\":false,\"Required\":5},\"AthenyxKills_1\":{\"Current\":0,\"Claimed\":false,\"Required\":400},\"Story_2\":{\"Current\":0,\"Claimed\":false,\"Required\":3},\"WeeklyComplete_1\":{\"Current\":4,\"Claimed\":false,\"Required\":5},\"Playtime_2\":{\"Current\":3600,\"Claimed\":true,\"Required\":3600},\"WeeklyKills_1\":{\"Current\":5000,\"Claimed\":true,\"Required\":5000},\"Summoning_2\":{\"Current\":0,\"Claimed\":false,\"Required\":5},\"AthenyxChallenge_1\":{\"Current\":0,\"Claimed\":false,\"Required\":2},\"WeeklyHallofMirror_1\":{\"Current\":0,\"Claimed\":false,\"Required\":5},\"BattlePassMultiplayer_1\":{\"Current\":0,\"Claimed\":false,\"Required\":25},\"BluePlanetInfinite_1\":{\"Current\":0,\"Claimed\":false,\"Required\":15},\"FooshaVillageInfinite_2\":{\"Current\":30,\"Claimed\":true,\"Required\":30},\"BattlePassPlaytime_1\":{\"Current\":2700,\"Claimed\":true,\"Required\":2700},\"WeeklyMultiplayer_1\":{\"Current\":30,\"Claimed\":false,\"Required\":350},\"Kills_1\":{\"Current\":300,\"Claimed\":true,\"Required\":300},\"BattlePassKills_1\":{\"Current\":1000,\"Claimed\":true,\"Required\":1000},\"Login_1\":{\"Current\":4,\"Claimed\":true,\"Required\":4}},\"EquippedUnits\":[\"7ef47f29-9749-4254-96b4-9be634beab34\",\"6f756c64-667e-4f06-9c12-094a24948aa5\",\"cf868248-9d51-4e1b-a304-02a7930759db\",\"b18a4a26-1315-4eb8-96e0-947c3c0e6689\",\"dd8220bc-5d29-492d-976a-dc3798f285f8\",\"ee80ed72-b114-4017-9ff0-d4cc85ee9adc\"],\"Emotes\":[],\"_clanPendingUpdates\":{\"XP\":0,\"Stats\":[]},\"SpecialEvents\":[],\"TowerOfEternityFloor\":1,\"EquippedBooth\":\"Default\",\"CaptchaSolveTicks\":[],\"TotalRobuxSpent\":0,\"UnitTeams\":[[],[],[],[]],\"Items\":{\"Demon Portal (Rare)\":50,\"Meat\":0,\"Trait Crystal\":686,\"Risky Dice\":1,\"Spirit Orb\":3,\"Energy Crystal\":6,\"Cursed Object\":4,\"Demon Portal (Epic)\":50},\"Pity\":{\"Standard\":{\"5\":60,\"4\":9,\"6\":60}},\"Gamepasses\":[],\"MaxEquippedUnits\":6,\"QuestStats\":{\"Multiplayer_1\":1,\"BattlePassMultiplayer_1\":1,\"BattlePassPlaytime_1\":7,\"Playtime_2\":3,\"Summoning_1\":1,\"Kills_2\":2,\"WeeklyStory_1\":1,\"Playtime_1\":2,\"WeeklyPlaytime_1\":1,\"WeeklyKills_1\":1,\"FooshaVillageInfinite_2\":1,\"BattlePassStory_1\":1,\"FooshaVillageInfinite_1\":1,\"Kills_1\":4,\"BattlePassKills_1\":7,\"Login_1\":1},\"Settings\":{\"Camera Shake\":true,\"Unit Visibility\":1,\"Dash Keybind\":\"Q\",\"Unit Cancel\":\"C\",\"Vibrations\":true,\"Damage Indicators\":true,\"Unit Rotate\":\"R\",\"Skills Enabled\":true,\"Confirm Spirit Rerolls\":true,\"Emote Keybind\":\"B\",\"Mute Music\":false,\"Receive Trade Requests\":1,\"Low Quality\":false,\"Confirm Trait Rerolls\":true,\"Auto Sell Deletes Shinies\":false,\"Unit Info Position\":1,\"Auto Skip Wave\":false,\"Unit Place\":\"E\"},\"RaidSeed\":239619,\"Battlepass\":{\"AthenyxBattlepass\":{\"CurrentXP\":0,\"ClaimedTiers\":{\"Premium\":0,\"Standard\":0}},\"Battlepass1\":{\"CurrentXP\":23050,\"ClaimedTiers\":{\"Premium\":0,\"Standard\":0}}},\"Units\":[\"Pirate Hunter\",\"Clay\",\"Clay\",\"Pirate Hunter\",\"Straw Hat\",\"Inferno Commander\",\"Straw Hat\",\"Clay\",\"Clay\",\"Clay\",\"Pirate Hunter\",\"Clay\",\"Pirate Hunter\",\"Clay\",\"Pirate Hunter\",\"Straw Hat\",\"Clay\",\"Straw Hat\",\"Clay\",\"Clay\",\"Pink Shinobi\",\"Pirate Hunter\",\"Clay\",\"Straw Hat\",\"Pirate Hunter\",\"Pirate Hunter\",\"Clay\",\"Straw Hat\",\"Salamander\",\"Clay\",\"Clay\",\"Straw Hat\",\"Straw Hat\",\"Pirate Hunter\",\"Clay\",\"Straw Hat\",\"Straw Hat\",\"Inferno Commander\",\"Admiral Of Lava\",\"Straw Hat\",\"Clay\",\"Straw Hat\",\"Pirate Hunter\",\"Straw Hat\",\"Salamander\",\"Inferno Commander\",\"Straw Hat\",\"Pink Shinobi\",\"Straw Hat\",\"Pirate Hunter\",\"Inferno Commander\",\"Clay\",\"Clay\",\"Inferno Commander\",\"Pirate Hunter\",\"Clay\",\"Pink Shinobi\",\"Inferno Commander\",\"Pirate Hunter\",\"Ascended Qi Master\"],\"CurrentLeaderboardSeason\":\"3\",\"StoredSummons\":[],\"Statistics\":{\"SummonedRarity2\":52,\"StoryCompleted\":52,\"WeeklyQuestsCompleted\":4,\"WavesClearedMultiplayer\":30,\"UnitUpgraded\":15482,\"WavesCleared\":15630,\"Kills\":253546,\"UnitsPlaced\":2366,\"Battlepass1QuestsCompleted\":16,\"WavesClearedSolo\":15600,\"InfinityWavesCleared\":14850,\"UnitSummons\":60,\"DamageDealt\":600631516,\"TotalQuestsCompleted\":35,\"NumLogins\":8,\"ItemsUsed\":1130,\"FooshaVillage_InfiniteWavesCleared\":14850,\"InfiniteQuestsCompleted\":2,\"Playtime\":409043,\"DailyQuestsCompleted\":13,\"SummonedRarity4\":1,\"SummonedRarity3\":7},\"TrackerReconciledADefenders_v4_prod_Units\":true,\"LastGameVersion\":36,\"MaxItemsOnSale\":10,\"EquippedTitle\":\"\",\"MaxItems\":20000,\"OrphanedTradeableItems\":{\"Emotes\":[],\"Units\":[]},\"Maps\":{\"FooshaVillage\":true,\"MobCity\":true},\"AllTimeCurrencies\":{\"Gold\":500,\"Gems\":118128},\"HallOfMirrors\":{\"Hard\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Nightmare\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Normal\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Easy\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":true}},\"XP\":45320,\"InfiniteWaveStats\":{\"FooshaVillage\":30},\"Level\":108,\"LastRealmTravelUnits\":[],\"CurrencyEarnSources\":{\"Gold\":{\"reward\":500},\"Gems\":{\"infinite_wave\":112908,\"quest\":2830,\"first_time_chapter\":480,\"reward\":1660}},\"GiftedGamepasses\":[],\"GameVersion\":2963,\"DiscoveredItems\":{\"Items\":{\"Demon Portal (Rare)\":true,\"Meat\":true,\"Trait Crystal\":true,\"Risky Dice\":true,\"Spirit Orb\":true,\"Energy Crystal\":true,\"Cursed Object\":true,\"Demon Portal (Epic)\":true},\"Emotes\":[],\"Units\":{\"Clay_Shiny\":true,\"Straw Hat\":true,\"Pink Shinobi\":true,\"Admiral Of Lava\":true,\"Inferno Commander\":true,\"Clay\":true,\"Salamander\":true,\"Pirate Hunter\":true,\"Ascended Qi Master\":true}},\"RewardedTitles\":[],\"_orphanedItems\":[],\"ItemConversionRefreshTick\":1725298899,\"Booths\":[\"Default\"],\"RaidShopPurchaseQuantities\":[],\"ClaimedLeaderboardRewards\":[],\"_lastLoginDay\":246,\"MaxUnits\":100,\"LeaderboardVariantData\":{\"TowerOfEternity_3\":1,\"UnderwaterTempleInfinite_3\":0,\"Robux\":0,\"PlayerLevel\":1,\"Gems\":250,\"AbyssalGateInfinite_3\":0,\"PantheonPassageInfinite_3\":0,\"SwordsmanDojoInfinite_3\":0,\"Kills\":0,\"SnowyWoodsInfinite_3\":0,\"CrystalCaveInfinite_3\":0,\"CyberGateInfinite_3\":0,\"BluePlanetInfinite_3\":0,\"TotalPower\":0,\"SoulweaverGateInfinite_3\":0},\"_questsVersion\":\"v1.0_Prod\",\"LastLeaveTime\":1725255690,\"EquippedCosmetic\":false,\"_realmEquipped\":{\"Default\":[\"7ef47f29-9749-4254-96b4-9be634beab34\",\"6f756c64-667e-4f06-9c12-094a24948aa5\",\"cf868248-9d51-4e1b-a304-02a7930759db\",\"b18a4a26-1315-4eb8-96e0-947c3c0e6689\",\"dd8220bc-5d29-492d-976a-dc3798f285f8\",\"ee80ed72-b114-4017-9ff0-d4cc85ee9adc\"]}}",
        //       "user_id": 1263,
        //       "config_id": "",
        //       "last_updated": 1725256212,
        //       "error_code": "0",
        //       "enabled": true,
        //       "is_running": true,
        //       "is_rejoining": false,
        //       "done": false,
        //       "pet_done": false
        //     },
        //     {
        //       "id": 1870230,
        //       "username": "thanweexrblq112",
        //       "password": "weexrblq@",
        //       "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_6EA74E5EDBDFB23CA57467D255D8A1844A5419A22129DCF4F110286CA32FBE3379030FFCCF09D34E06176A6F70ABE7697F7F6D570ADABDF801C057C55F7E133BF668F376DF760DBA016C0F23FD92D810B17E075D531CDCD53765DD4282FE1E5CE8C8AAE8BAE1775BBFA7D36319EA45D7261BF107F4C141D1140C1589D1C0EDB5C0312ED2E2C0E86175D1347CF4C6599A347791CA4EA55BDB061812B7E4DD758DDB71EFFEC9B785A8193525BEA3317B516E1CC54D6BE82F3819FEDB82F8BDFAC4E736E4EE1088AF6429DFA2FDC66256137826FB35BA8DAA4421BA26785AAD39B21D64E9FDD4CB2A86D70DFD793DA7EC92A045633C0DA8BA7E7E1F92D8293A0A0DEA907ECF69BEB1E51714F4FBFE385DF5BBEFD397AF700513F72D36AB23758358C1B9DE00907417BCAB328A5F18FDB13714BB14A2661DD9D9281D22A55E7AFD9E88483A3E11CE3B7A52E966DF81A7A1249C9A58A1DD5249DD0B4A24D69EACEA75B59B1B2BF416ED191B26A636916C00A921ED1F3E5CC3082A95F3281404FA2FE65F83482A318995F48390EE428007A8F09499ECCDC35CA0CAE05D312262980EDB0BF25704D910652D093798211E5B159882A4120040B9D871B5AA909A7C9879CAAFB3A9D8C4CA20443BAF9E5D8848358B4E6DEC77B6EB2751DFD43C0574A890BD66B40D6E831D181CEDF9B23FB991FFC7B167A7E18A4965BEFDD0C8912193BB18B100EB77C99FBFFDC341D33BAD1FDAB9961CD3BA740B01987366157BC205D85FC5A2C64C5DD5A1B9EF1A95AD4ADF83807855F7C29C27069DE30FE8E2FCD64CB26958F6F09DB4198BD25DF2AABD5D49D6D395DE79552714102D1A87FD05C48288D194BB95A814CC09D6DBAF7A0ABF6D17AE4BAF3334D6BA6944BB5F2A484F675353BA5F78B6FA074084D4597EB26124D5528109EBE874CD51732621AFCD96460D11ED4ED1",
        //       "is_logged_in": true,
        //       "private_server_link": "",
        //       "game_instance_id": "42571d18-d613-45e5-a9e4-4fa7fa8caaeb",
        //       "device_id": "25e1d8077daf5ddd167f206a582a10ed21cfb84c4e791419006fb2be24700f99",
        //       "status": "{\"QuestPools\":{\"Daily\":{\"EndTick\":1725296625},\"Infinite\":{\"EndTick\":1725296625},\"Battlepass1\":{\"EndTick\":1725296625},\"Weekly\":{\"EndTick\":1725296625},\"AthenyxBattlepass\":{\"EndTick\":1725296625}},\"UnlockedRarityCounts\":[null,23,6,1],\"ClanRank\":5,\"ChallengeTimeSeed\":479237,\"ItemConversionLimits\":{\"Solar Token\":20000,\"Lucky Ticket\":500,\"Flame Token\":20000,\"Aqua Token\":20000},\"MaxEquippedEmotes\":6,\"MaxEmotes\":500,\"Currencies\":{\"Gold\":1000,\"Gems\":117751},\"Titles\":{\"None\":[]},\"Potion\":{\"ActivePotions\":[],\"AllPotions\":[]},\"CompletedChallenges\":[],\"InfiniteWaveStats\":{\"FooshaVillage\":30},\"EquippedUnits\":[\"20b343f4-d0d7-4801-b121-5672dfd3f9f6\",\"2e877f81-1e62-4f5b-b4f4-44c1905818a4\",\"a65678f5-1bc3-47bc-8c02-56d2a0f5846e\",\"62d11c72-5703-4b79-8009-61e7803581b8\",\"407052fd-0652-42f8-8fe5-4e2d8ab9c1f4\",\"78386149-da9d-48a4-9f9f-60b44df809ad\"],\"Emotes\":[],\"_clanPendingUpdates\":{\"XP\":0,\"Stats\":[]},\"SpecialEvents\":[],\"XP\":45680,\"EquippedBooth\":\"Default\",\"CaptchaSolveTicks\":[],\"TotalRobuxSpent\":0,\"UnitTeams\":[[],[],[],[]],\"Items\":{\"Demon Portal (Rare)\":50,\"Meat\":0,\"Trait Crystal\":694,\"Risky Dice\":2,\"Spirit Orb\":4,\"Energy Crystal\":8,\"Cursed Object\":2,\"Demon Portal (Epic)\":50},\"Pity\":{\"Standard\":{\"5\":40,\"4\":8,\"6\":40}},\"Gamepasses\":[],\"MaxEquippedUnits\":6,\"QuestStats\":{\"Story_2\":1,\"FooshaVillageInfinite_1\":2,\"Summoning_1\":1,\"WeeklyKills_1\":1,\"BattlePassStory_1\":1,\"BattlePassPlaytime_1\":4,\"Playtime_2\":3,\"Multiplayer_1\":1,\"Kills_2\":3,\"Playtime_1\":4,\"Kills_3\":1,\"WeeklyStory_1\":1,\"FooshaVillageInfinite_2\":1,\"BattlePassMultiplayer_1\":1,\"WeeklyPlaytime_1\":1,\"Kills_1\":2,\"BattlePassKills_1\":7,\"Login_1\":1},\"Settings\":{\"Camera Shake\":true,\"Unit Visibility\":1,\"Dash Keybind\":\"Q\",\"Auto Skip Wave\":false,\"Skills Enabled\":true,\"Confirm Trait Rerolls\":true,\"Low Quality\":false,\"Unit Cancel\":\"C\",\"Confirm Spirit Rerolls\":true,\"Emote Keybind\":\"B\",\"Mute Music\":false,\"Receive Trade Requests\":1,\"Damage Indicators\":true,\"Vibrations\":true,\"Auto Sell Deletes Shinies\":false,\"Unit Info Position\":1,\"Unit Rotate\":\"R\",\"Unit Place\":\"E\"},\"RaidSeed\":239619,\"Battlepass\":{\"Battlepass1\":{\"CurrentXP\":18550,\"ClaimedTiers\":{\"Standard\":0,\"Premium\":0}},\"AthenyxBattlepass\":{\"CurrentXP\":0,\"ClaimedTiers\":{\"Standard\":0,\"Premium\":0}}},\"_orphanedItems\":[],\"CurrentLeaderboardSeason\":\"3\",\"StoredSummons\":[],\"Statistics\":{\"SummonedRarity2\":32,\"StoryCompleted\":52,\"WeeklyQuestsCompleted\":4,\"WavesClearedMultiplayer\":30,\"UnitUpgraded\":15612,\"WavesCleared\":15801,\"Kills\":258808,\"UnitsPlaced\":2399,\"Battlepass1QuestsCompleted\":13,\"WavesClearedSolo\":15771,\"InfinityWavesCleared\":15006,\"UnitSummons\":40,\"DamageDealt\":606610360,\"TotalQuestsCompleted\":36,\"NumLogins\":8,\"ItemsUsed\":1134,\"FooshaVillage_InfiniteWavesCleared\":15006,\"InfiniteQuestsCompleted\":3,\"Playtime\":412335,\"DailyQuestsCompleted\":16,\"SummonedRarity4\":1,\"SummonedRarity3\":7},\"TrackerReconciledADefenders_v4_prod_Units\":true,\"LastGameVersion\":36,\"MaxItemsOnSale\":10,\"EquippedTitle\":\"\",\"OrphanedTradeableItems\":{\"Units\":[],\"Emotes\":[]},\"RewardedTitles\":[],\"MaxItems\":20000,\"ItemConversionRefreshTick\":1725297949,\"_realmEquipped\":{\"Default\":[\"20b343f4-d0d7-4801-b121-5672dfd3f9f6\",\"2e877f81-1e62-4f5b-b4f4-44c1905818a4\",\"a65678f5-1bc3-47bc-8c02-56d2a0f5846e\",\"62d11c72-5703-4b79-8009-61e7803581b8\",\"407052fd-0652-42f8-8fe5-4e2d8ab9c1f4\",\"78386149-da9d-48a4-9f9f-60b44df809ad\"]},\"DiscoveredItems\":{\"Items\":{\"Demon Portal (Rare)\":true,\"Meat\":true,\"Trait Crystal\":true,\"Risky Dice\":true,\"Spirit Orb\":true,\"Energy Crystal\":true,\"Cursed Object\":true,\"Demon Portal (Epic)\":true},\"Units\":{\"Ascended Qi Master\":true,\"Clay\":true,\"Pink Shinobi\":true,\"Straw Hat\":true,\"Salamander\":true,\"Pirate Hunter\":true,\"Admiral Of Lava\":true,\"Inferno Commander\":true},\"Emotes\":[]},\"AllTimeCurrencies\":{\"Gold\":1000,\"Gems\":119751},\"EquippedCosmetic\":false,\"CurrencyEarnSources\":{\"Gold\":{\"reward\":1000},\"Gems\":{\"infinite_wave\":113821,\"quest\":3440,\"first_time_chapter\":480,\"reward\":1760}},\"LastRealmTravelUnits\":[],\"GiftedGamepasses\":[],\"GameVersion\":2963,\"Level\":109,\"Units\":[\"Pirate Hunter\",\"Clay\",\"Straw Hat\",\"Clay\",\"Pirate Hunter\",\"Straw Hat\",\"Clay\",\"Straw Hat\",\"Clay\",\"Inferno Commander\",\"Clay\",\"Inferno Commander\",\"Straw Hat\",\"Pirate Hunter\",\"Clay\",\"Clay\",\"Pirate Hunter\",\"Inferno Commander\",\"Pirate Hunter\",\"Pirate Hunter\",\"Clay\",\"Clay\",\"Clay\",\"Pink Shinobi\",\"Pirate Hunter\",\"Clay\",\"Straw Hat\",\"Pirate Hunter\",\"Inferno Commander\",\"Inferno Commander\",\"Straw Hat\",\"Pirate Hunter\",\"Salamander\",\"Ascended Qi Master\",\"Straw Hat\",\"Admiral Of Lava\",\"Clay\",\"Pirate Hunter\",\"Straw Hat\",\"Inferno Commander\"],\"HallOfMirrors\":{\"Normal\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Nightmare\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Hard\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Easy\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":true}},\"Maps\":{\"FooshaVillage\":true,\"MobCity\":true},\"Booths\":[\"Default\"],\"RaidShopPurchaseQuantities\":[],\"Quests\":{\"AthenyxSolo_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"DailyComplete_1\":{\"Current\":2,\"Required\":5,\"Claimed\":false},\"AthenyxPlaytime_1\":{\"Current\":0,\"Required\":1800,\"Claimed\":false},\"WeeklyStory_1\":{\"Current\":10,\"Required\":10,\"Claimed\":true},\"HallofMirror_1\":{\"Current\":0,\"Required\":1800,\"Claimed\":false},\"UnderwaterTempleInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"WeeklyPlaytime_1\":{\"Current\":10800,\"Required\":10800,\"Claimed\":true},\"BattlePassStory_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"BattlePassHom_1\":{\"Current\":0,\"Required\":1200,\"Claimed\":false},\"AthenyxChallenge_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"CrystalCaveInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"BattlePassChallenge_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"BattlePassRaid_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"BattlePassMultiplayer_1\":{\"Current\":0,\"Required\":25,\"Claimed\":false},\"WeeklyComplete_1\":{\"Current\":4,\"Required\":5,\"Claimed\":false},\"Playtime_2\":{\"Current\":3600,\"Required\":3600,\"Claimed\":true},\"WeeklyKills_1\":{\"Current\":5000,\"Required\":5000,\"Claimed\":true},\"Multiplayer_2\":{\"Current\":0,\"Required\":30,\"Claimed\":false},\"AthenyxMultiplayer_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"WeeklyHallofMirror_1\":{\"Current\":0,\"Required\":5,\"Claimed\":false},\"Kills_3\":{\"Current\":1000,\"Required\":1000,\"Claimed\":true},\"AthenyxInfinite_1\":{\"Current\":0,\"Required\":30,\"Claimed\":false},\"Challenge_1\":{\"Current\":0,\"Required\":1,\"Claimed\":false},\"MobCityInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"WeeklyMultiplayer_1\":{\"Current\":30,\"Required\":350,\"Claimed\":false},\"Summoning_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"BattlePassKills_1\":{\"Current\":1000,\"Required\":1000,\"Claimed\":true},\"Login_1\":{\"Current\":4,\"Required\":4,\"Claimed\":true}},\"_lastLoginDay\":246,\"MaxUnits\":100,\"LeaderboardVariantData\":{\"TowerOfEternity_3\":1,\"SoulweaverGateInfinite_3\":0,\"Robux\":0,\"PlayerLevel\":1,\"Gems\":250,\"TotalPower\":0,\"CrystalCaveInfinite_3\":0,\"SwordsmanDojoInfinite_3\":0,\"Kills\":0,\"SnowyWoodsInfinite_3\":0,\"PantheonPassageInfinite_3\":0,\"CyberGateInfinite_3\":0,\"BluePlanetInfinite_3\":0,\"AbyssalGateInfinite_3\":0,\"UnderwaterTempleInfinite_3\":0},\"_questsVersion\":\"v1.0_Prod\",\"LastLeaveTime\":1725255753,\"ClaimedLeaderboardRewards\":[],\"TowerOfEternityFloor\":1}",
        //       "user_id": 1263,
        //       "config_id": "",
        //       "last_updated": 1725256210,
        //       "error_code": "0",
        //       "enabled": true,
        //       "is_running": true,
        //       "is_rejoining": false,
        //       "done": false,
        //       "pet_done": false
        //     },
        //     {
        //       "id": 1873038,
        //       "username": "ddisoncflvcdle1355",
        //       "password": "cflvcdle@",
        //       "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_58FD3F3CAF01F589B3D4715B46AD525097BDF23BFD986E1B652273B4FAE87317726484CC01336683E8B396541A9C95B62FEFC1920760DF5111072B97FDC4B602AB6764ACACB23665C188285140460D7D6FB115E8EBBBB8920E222690159C89EBB4EDE6CA98BF712D323485D7ACE7623308AB77AA9AE06D0BFFF11E51FD252175B5ED692694A23D966BCBD9AB03067256FEAD163986F7A86C2F26519F6551C3B69948C3AB8A6FE074ADA847294CE000DADD652B0C850A310AF3580FE8F581F414A987273157C9DCBD124C018CF9F7F0C9FCF52643457B4748B578DB55F4498E070EE00883C62A6F6F4408EC156CDD07EEC5898C77FCE061B2A2AB78AFB5164C3B2DFA16981A0AE01A64F25AA190AED7811A803FCAE387D9969E1EF909D8700DB79609A3614B58199953616AE73905C5E285C9293C23D78DB30573FFB265FEFBEA244BEF598AA5B28D2477BBD0F749DC10B2B00E5FFAE3509090A601D3E61CBC4FD1D0280EF9742686A30D839C86DA7E08481394A2EA14A555D86071B363E17E671D81FC6F57EC987145CFF1071CCE6B0C01A0873CF73976F551CBA27440A0A143DDAD68FD8CCDB9E30F7FAF31FE1E181E6CE60C3D5D8B8FB5579C2C708549A4962ECE365CBB4059A7B0166A3E454B303078E3DDB6A85BFCE5925B66257B3AF8C78C0073B523FC3AD11B4B93842E839382B21B60C289E150F6F57ED0A54202B4E1009850774DD218B9A1858900E3F93D64A4AC5C95CFA493EE41DED7BCA6DED2A0CCA2A92109622C736F8E39116BC57751ADC90F7CB6D5AA01659BD57406EF52A57E1BDE5D3D72BC2C585A86B95162C6E00B0F72E23784F86DDB4E9F7F99C254ED79293330313A32D13B74CF25DFC7CE4CAE6852C4A360F906FAB4CCB177E2D796F779092ACC218F1A6DB8D4F60A3E5A5AFB5980B97C718299D97114EC94F55E0BBC766A1209E7B2814C44D955BF63AC00760BC2A5B536AD66F88A2FA2C33896F2BD6BDB64",
        //       "is_logged_in": true,
        //       "private_server_link": "",
        //       "game_instance_id": "5e0b0803-193e-4a1a-835b-0d8f54a88e33",
        //       "device_id": "2e21e3017ea327ee8b7f14d76a7f4842279ff07a83a83b749801eec8bc02f68c",
        //       "status": "{\"QuestPools\":{\"Daily\":{\"EndTick\":1725334827},\"Infinite\":{\"EndTick\":1725334827},\"Battlepass1\":{\"EndTick\":1725334827},\"Weekly\":{\"EndTick\":1725334827},\"AthenyxBattlepass\":{\"EndTick\":1725334827}},\"UnlockedRarityCounts\":{\"5\":1,\"4\":1,\"3\":1,\"2\":4},\"ClanRank\":5,\"ChallengeTimeSeed\":479237,\"ItemConversionLimits\":{\"Solar Token\":20000,\"Lucky Ticket\":500,\"Flame Token\":20000,\"Aqua Token\":20000},\"MaxEquippedEmotes\":6,\"MaxEmotes\":500,\"Currencies\":{\"Gold\":1000,\"Gems\":129611},\"Titles\":{\"None\":[]},\"Potion\":{\"ActivePotions\":[],\"AllPotions\":[]},\"CompletedChallenges\":[],\"_realmEquipped\":{\"Default\":[\"90607fd1-36f2-4461-976b-00c453964c5c\",\"8f5143c4-a2cf-4f76-8e72-851ad0e1fbc4\",\"fb03bd7b-e56c-491d-bf30-a061603b2696\",\"2381b9e3-2910-4b9f-a098-c04f501b4f6f\",\"6575c26a-d62c-4f56-a744-d889a0ffe617\",\"ac71e02f-5ee0-482f-943b-3079163c111a\"]},\"EquippedUnits\":[\"90607fd1-36f2-4461-976b-00c453964c5c\",\"8f5143c4-a2cf-4f76-8e72-851ad0e1fbc4\",\"fb03bd7b-e56c-491d-bf30-a061603b2696\",\"2381b9e3-2910-4b9f-a098-c04f501b4f6f\",\"6575c26a-d62c-4f56-a744-d889a0ffe617\",\"ac71e02f-5ee0-482f-943b-3079163c111a\"],\"Emotes\":[],\"_clanPendingUpdates\":{\"XP\":0,\"Stats\":[]},\"ClaimedLeaderboardRewards\":[],\"TowerOfEternityFloor\":1,\"EquippedBooth\":\"Default\",\"CaptchaSolveTicks\":[],\"TotalRobuxSpent\":0,\"UnitTeams\":[[],[],[],[]],\"Items\":{\"Demon Portal (Epic)\":50,\"Cursed Object\":4,\"Trait Crystal\":756,\"Risky Dice\":2,\"Spirit Orb\":4,\"Energy Crystal\":6,\"Meat\":2,\"Demon Portal (Rare)\":50},\"Pity\":{\"Standard\":{\"5\":4,\"4\":1,\"6\":31}},\"Gamepasses\":[],\"MaxEquippedUnits\":6,\"QuestStats\":{\"BattlePassMultiplayer_1\":1,\"FooshaVillageInfinite_1\":2,\"WeeklyStory_1\":1,\"WeeklyKills_1\":1,\"BattlePassStory_1\":1,\"Story_1\":1,\"Playtime_2\":2,\"Multiplayer_1\":2,\"Kills_2\":3,\"Playtime_1\":2,\"Login_1\":1,\"BattlePassPlaytime_1\":5,\"FooshaVillageInfinite_2\":2,\"Summoning_1\":1,\"WeeklyPlaytime_1\":1,\"Kills_1\":4,\"BattlePassKills_1\":7,\"FooshaVillageInfinite_3\":1},\"Settings\":{\"Camera Shake\":true,\"Unit Visibility\":1,\"Dash Keybind\":\"Q\",\"Auto Skip Wave\":false,\"Skills Enabled\":true,\"Confirm Trait Rerolls\":true,\"Low Quality\":false,\"Unit Cancel\":\"C\",\"Confirm Spirit Rerolls\":true,\"Emote Keybind\":\"B\",\"Mute Music\":false,\"Receive Trade Requests\":1,\"Damage Indicators\":true,\"Vibrations\":true,\"Auto Sell Deletes Shinies\":false,\"Unit Info Position\":1,\"Unit Rotate\":\"R\",\"Unit Place\":\"E\"},\"RaidSeed\":239619,\"Battlepass\":{\"Battlepass1\":{\"CurrentXP\":20050,\"ClaimedTiers\":{\"Standard\":0,\"Premium\":0}},\"AthenyxBattlepass\":{\"CurrentXP\":0,\"ClaimedTiers\":{\"Standard\":0,\"Premium\":0}}},\"_orphanedItems\":[],\"CurrentLeaderboardSeason\":\"3\",\"StoredSummons\":[],\"Statistics\":{\"SummonedRarity2\":25,\"StoryCompleted\":38,\"WeeklyQuestsCompleted\":4,\"WavesClearedMultiplayer\":46,\"UnitUpgraded\":16655,\"WavesCleared\":16932,\"NumLogins\":7,\"Playtime\":442638,\"Battlepass1QuestsCompleted\":14,\"WavesClearedSolo\":16886,\"InfinityWavesCleared\":16336,\"UnitSummons\":31,\"DamageDealt\":666049391,\"SummonedRarity5\":1,\"TotalQuestsCompleted\":38,\"FooshaVillage_InfiniteWavesCleared\":16336,\"ItemsUsed\":1200,\"UnitsPlaced\":2491,\"InfiniteQuestsCompleted\":5,\"Kills\":275815,\"DailyQuestsCompleted\":15,\"SummonedRarity4\":1,\"SummonedRarity3\":4},\"TrackerReconciledADefenders_v4_prod_Units\":true,\"LastGameVersion\":36,\"MaxItemsOnSale\":10,\"EquippedTitle\":\"\",\"MaxItems\":20000,\"OrphanedTradeableItems\":{\"Units\":[],\"Emotes\":[]},\"Maps\":{\"FooshaVillage\":true,\"MobCity\":true},\"XP\":49330,\"SpecialEvents\":[],\"DiscoveredItems\":{\"Items\":{\"Demon Portal (Epic)\":true,\"Cursed Object\":true,\"Trait Crystal\":true,\"Risky Dice\":true,\"Spirit Orb\":true,\"Energy Crystal\":true,\"Meat\":true,\"Demon Portal (Rare)\":true},\"Units\":{\"Straw Hat\":true,\"Pink Shinobi\":true,\"Admiral Of Lava\":true,\"Inferno Commander\":true,\"Ant King\":true,\"Clay\":true,\"Salamander\":true,\"Pirate Hunter\":true,\"Ascended Qi Master\":true},\"Emotes\":[]},\"AllTimeCurrencies\":{\"Gems\":131161,\"Gold\":1000},\"EquippedCosmetic\":false,\"InfiniteWaveStats\":{\"FooshaVillage\":30},\"LastRealmTravelUnits\":[],\"LastLeaveTime\":1725255667,\"GameVersion\":2963,\"Level\":114,\"Booths\":[\"Default\"],\"Quests\":{\"BattlePassRaid_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"WeeklyStory_1\":{\"Current\":10,\"Required\":10,\"Claimed\":true},\"HallofMirror_1\":{\"Current\":0,\"Required\":1800,\"Claimed\":false},\"SwordsmanDojoInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"Multiplayer_1\":{\"Current\":15,\"Required\":15,\"Claimed\":true},\"AthenyxStory_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"WeeklyPlaytime_1\":{\"Current\":10800,\"Required\":10800,\"Claimed\":true},\"BattlePassStory_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"WeeklyKills_1\":{\"Current\":5000,\"Required\":5000,\"Claimed\":true},\"BattlePassChallenge_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"CrystalCaveInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"WeeklyComplete_1\":{\"Current\":4,\"Required\":5,\"Claimed\":false},\"DailyComplete_1\":{\"Current\":3,\"Required\":5,\"Claimed\":false},\"Summoning_2\":{\"Current\":0,\"Required\":5,\"Claimed\":false},\"BattlePassPlaytime_1\":{\"Current\":2700,\"Required\":2700,\"Claimed\":true},\"AthenyxInfinite_1\":{\"Current\":0,\"Required\":30,\"Claimed\":false},\"AthenyxKills_1\":{\"Current\":0,\"Required\":400,\"Claimed\":false},\"WeeklyHallofMirror_1\":{\"Current\":0,\"Required\":5,\"Claimed\":false},\"AthenyxMultiplayer_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"Playtime_1\":{\"Current\":1800,\"Required\":1800,\"Claimed\":true},\"Story_2\":{\"Current\":0,\"Required\":3,\"Claimed\":false},\"CursedAcademyInfinite_1\":{\"Current\":0,\"Required\":15,\"Claimed\":false},\"AthenyxChallenge_1\":{\"Current\":0,\"Required\":2,\"Claimed\":false},\"BattlePassMultiplayer_1\":{\"Current\":25,\"Required\":25,\"Claimed\":true},\"WeeklyMultiplayer_1\":{\"Current\":46,\"Required\":350,\"Claimed\":false},\"Kills_1\":{\"Current\":300,\"Required\":300,\"Claimed\":true},\"BattlePassKills_1\":{\"Current\":1000,\"Required\":1000,\"Claimed\":true},\"Login_1\":{\"Current\":4,\"Required\":4,\"Claimed\":true}},\"CurrencyEarnSources\":{\"Gems\":{\"infinite_wave\":125091,\"first_time_chapter\":480,\"quest\":4100,\"reward\":1240},\"Gold\":{\"reward\":1000}},\"Units\":[\"Straw Hat\",\"Salamander\",\"Pirate Hunter\",\"Straw Hat\",\"Pirate Hunter\",\"Pirate Hunter\",\"Clay\",\"Pink Shinobi\",\"Straw Hat\",\"Straw Hat\",\"Salamander\",\"Straw Hat\",\"Pink Shinobi\",\"Inferno Commander\",\"Pink Shinobi\",\"Straw Hat\",\"Pink Shinobi\",\"Ascended Qi Master\",\"Inferno Commander\",\"Clay\",\"Pirate Hunter\",\"Straw Hat\",\"Pirate Hunter\",\"Admiral Of Lava\",\"Inferno Commander\",\"Salamander\",\"Clay\",\"Pink Shinobi\",\"Ant King\",\"Pink Shinobi\",\"Clay\"],\"RaidShopPurchaseQuantities\":[],\"HallOfMirrors\":{\"Normal\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Nightmare\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Hard\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":false},\"Easy\":{\"Plays\":0,\"Wins\":0,\"Unlocked\":true}},\"_lastLoginDay\":246,\"MaxUnits\":100,\"LeaderboardVariantData\":{\"TowerOfEternity_3\":1,\"SoulweaverGateInfinite_3\":0,\"Robux\":0,\"PlayerLevel\":1,\"Gems\":250,\"TotalPower\":0,\"CrystalCaveInfinite_3\":0,\"SwordsmanDojoInfinite_3\":0,\"Kills\":0,\"SnowyWoodsInfinite_3\":0,\"PantheonPassageInfinite_3\":0,\"CyberGateInfinite_3\":0,\"BluePlanetInfinite_3\":0,\"AbyssalGateInfinite_3\":0,\"UnderwaterTempleInfinite_3\":0},\"_questsVersion\":\"v1.0_Prod\",\"RewardedTitles\":[],\"GiftedGamepasses\":[],\"ItemConversionRefreshTick\":1725336826}",
        //       "user_id": 1263,
        //       "config_id": "",
        //       "last_updated": 1725256191,
        //       "error_code": "0",
        //       "enabled": true,
        //       "is_running": true,
        //       "is_rejoining": false,
        //       "done": false,
        //       "pet_done": false
        //     }
        //   ]
        // }
        const map_device_id_code = {...state.map_device_id_code}
        const map_device_code_sum_acc = {}
        const map_device_code_detail = {}
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
                const crystal = JSON.parse(item.status).Items["Trait Crystal"]
                const gems = JSON.parse(item.status).Currencies["Gems"]
                map_device_code_sum_acc[map_device_id_code[item.device_id]] += crystal ? crystal : 0
                map_device_code_detail[map_device_id_code[item.device_id]].Gems += gems ? gems : 0
                map_device_code_detail[map_device_id_code[item.device_id]].Crystal += crystal ? crystal : 0
              }
            } catch (e) {
              console.log('Error', e)
            }
          })
        }
        console.log('map_device_code_detail',map_device_code_detail)
        await commit('SET_MAP_DEVICE_CODE_DETAIL', map_device_code_detail)
        await commit('SET_ACCOUNT_ROBLOX', response)
        await commit('SET_MAP_DEVICE_CODE_SUM_ACC', map_device_code_sum_acc)
      } catch (e) {
        return false
      }
    },500)

  },
}
