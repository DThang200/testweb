<template>
  <div>
    <div>
      <textarea v-model="input" style="width: 500px;height: 500px" @change="removeConfigScriptId">

      </textarea>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      input: "",
      output: ""
    };
  },
  beforeDestroy() {
  },
  mounted() {
  },
  methods: {
    async removeConfigScriptId() {
      const data = JSON.parse(this.input)
      const listOutput = {}
      for (const key in data) {
        const {script, script_label} = data[key];
        listOutput[key] = {script, script_label};
      }
      console.log('listOutput',listOutput)
      const daaaaa = JSON.stringify(listOutput)
      console.log('this.output', daaaaa)
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
