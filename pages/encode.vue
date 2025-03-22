<template>
  <div>
    <div>
      sha-256
      <textarea v-model="inputShaValue" type="text" placeholder="Input" rows="3" style="width: 500px"></textarea>
      <textarea v-model="resultShaValue" type="text" placeholder="Result" rows="3" style="width: 500px"></textarea>
    </div>
    <div>
      Stringify
      <textarea v-model="inputStringValue" type="text" placeholder="Input" rows="3" style="width: 500px"></textarea>
      <textarea v-model="resultStringValue" type="text" placeholder="Result" rows="3" style="width: 500px"></textarea>
    </div>
    <div>
      Base 64
      <textarea v-model="inputBase64Value" type="text" placeholder="Input" rows="3" style="width: 500px"></textarea>
      <textarea v-model="resultBase64Value" type="text" placeholder="Result" rows="3" style="width: 500px"></textarea>
      <input v-model="levelBase64">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lines: [],
      inputShaValue: '',
      resultShaValue: '',
      inputStringValue: '',
      resultStringValue: '',
      inputBase64Value: '',
      resultBase64Value: '',
      levelBase64: 5,
    };
  },
  watch: {
    inputShaValue(values){
      this.encodeShaFunction(values)
    },
    inputStringValue(values){
      this.stringifyFunction(values)
    },
    inputBase64Value(values){
      this.base64Function(values)
    },
  },
  methods: {
    async encodeShaFunction(values) {
      // const msgBuffer = new TextEncoder().encode(values + new Date().getTime());
      const msgBuffer = new TextEncoder().encode(values);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer); // Băm dữ liệu
      const hashArray = Array.from(new Uint8Array(hashBuffer)); // Chuyển buffer thành array
      this.resultShaValue = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    },
    stringifyFunction(values){
      this.resultStringValue = btoa(unescape(encodeURIComponent(JSON.stringify(values))))
    },
    base64Function(Value){
      let result = Value
      for (let i = 0; i < this.levelBase64; i++) {
        result = btoa(unescape(encodeURIComponent(result)))
      }
      this.resultBase64Value = result
    }
  }
};
</script>
