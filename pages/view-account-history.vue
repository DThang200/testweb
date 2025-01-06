<template>
  <div>
    <div>
      <input type="text" v-model="inputData">
      <button @click="renderData">Render</button>
      <button style="margin-left: 1000px" @click="renderData">Clear</button>
    </div>
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
      <template v-for="data in viewData">
        <tr>
          <td>{{data?.date}}</td>
          <td>{{data?.total_account_completed}}</td>
          <td>{{data?.increase}}</td>
          <td>{{data?.decrease}}</td>
          <td>{{data?.kit}}</td>
          <td>{{data?.yeti}}</td>
          <td>{{data?.leo}}</td>
          <td>{{data?.gas}}</td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  data() {
    return {
      inputData: '',
      viewData : [],
      overview : []
    };
  },
  mounted() {
  },
  methods: {
    renderData(){
      const data = JSON.parse(this.inputData)
      this.viewData = []
      Object.entries(data).forEach(item => {
        console.log('item',item)
        if (item){
          this.viewData.push({date : item[0],total_account_completed : item[1].t,increase : item[1].i,decrease : item[1].d,kit : item[1].kd,leo : item[1].ld,gas : item[1].gd,yeti : item[1].yd})
        }
        console.log('this.viewData',this.viewData)
        // {
        //   total_account_completed : total_account_completed,
        //       increase : 0,
        //     decrease : 0,
        // }
      })
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
