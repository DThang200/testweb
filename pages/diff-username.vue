<template>
  <div>
    <textarea v-model="input" rows="5" style="width: 300px" @change="getUserDiff" placeholder="main">

    </textarea>
    <textarea v-model="input2" rows="5" style="width: 300px" @change="getUserDiff">

    </textarea>
    result (has line of input2 ) =>
    <textarea v-model="output"  rows="5" style="width: 300px">

    </textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      input2: "",
      output: ""
    };
  },
  methods: {
    getUserDiff(){
      if (!this.input || !this.input2){
        return false
      }
      const listInput1 = this.input.split('\n') || []
      const listInput2 = this.input2.split('\n') || []
      const listUsername = {}
      listInput2.forEach(line => {
        const username = line.split(':')[0]
        listUsername[username] = true
      })
      listInput1.forEach(line => {
        const username = line.split(':')[0]
        if (!listUsername[username]){
          this.output += line + '\n'
        }
      })
    }
  }
};
</script>
