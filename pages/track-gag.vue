<template>
  <div>
    <input v-model="minValue">
    <textarea v-model="inputData">

    </textarea>
    <table>
      <tr>
        <th>date</th>
        <th>total</th>
        <th>increase</th>
        <th>decrease</th>
        <th>kit</th>
        <th>yeti</th>
        <th>leo</th>
        <th>gas</th>
      </tr>
<!--      <template v-for="data in viewData">-->
<!--        <tr>-->
<!--          <td>{{data?.date}}</td>-->
<!--          <td>{{data?.total_account_completed}}</td>-->
<!--          <td>{{data?.increase}}</td>-->
<!--          <td>{{data?.decrease}}</td>-->
<!--          <td>{{data?.kit}}</td>-->
<!--          <td>{{data?.yeti}}</td>-->
<!--          <td>{{data?.leo}}</td>-->
<!--          <td>{{data?.gas}}</td>-->
<!--        </tr>-->
<!--      </template>-->
    </table>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {
      data: [],
      track: "kg",
      minValue: 15,
      inputData: "",
      displayData : []
      // "kg","raccoon" "divine"
    };
  },
  watch: {
    inputData(value){
      const data = JSON.parse(value)
      console.log('data',data)
      if (data?.rows){
        this.data = data.rows
        this.renderDisplayData()
      }
    }
  },
  mounted() {
    // this.renderData()
  },
  methods: {
    renderDisplayData() {
      this.displayData = []
      if (this.track === "kg"){
        for (let j = 0; j < this.data.length; j++) {
          const acc = this.data[j]
          const listTier = ["mythical","pets","divine"]
          for (let i = 0; i < listTier.length; i++) {
            const tier = listTier[i]
            if (acc[tier] && acc[tier].length > 0){
              acc[tier].forEach(pet => {
                if (parseFloat(pet.size_pet) > this.minValue){
                  console.log('pet',{username: acc.username,[tier]: [{pet_name: pet.pet_name,size_pet: pet.size_pet,}]})
                  this.displayData.push({username: acc.username,[tier]: [{pet_name: pet.pet_name,size_pet: pet.size_pet,}]})
                }
              })
            }
          }

        }
      }
      console.log("displayData",this.displayData)
    },
    async renderData() {
      const responseCompleted = await this.$axios.$get(`https://yummytrackstat.com/api/grow-a-garden/trackings?filter=status%3Dall&page=0&limit=10000`, {
        headers: {
          'authorization': "Bearer veYm1XY7pDaELlb0ZX43o4c0hatrWi",
        },
      });
      if (responseCompleted?.rows && responseCompleted?.rows.length > 0){
        this.data = responseCompleted?.rows
        this.renderDisplayData()
      }
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
