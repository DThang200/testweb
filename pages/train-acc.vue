<template>
  <div>
    <input type="file" @change="handleFileUpload" placeholder="Nhập file user-data"/>
    <input type="file" @change="handleFileUpload" placeholder="Nhập file user-cookie"/>
    <button type="button" @click="handleFileUploadRender">Render</button>
    <div v-if="lines.length">Đã có dữ liệu</div>
<!--    <ul v-if="lines.length">-->
<!--      <li v-for="(line, index) in lines" :key="index">{{ line }}</li>-->
<!--    </ul>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      lines: []  // Dùng để lưu mảng các dòng
    };
  },
  methods: {
    handleFileUpload(event) {      const file = event.target.files[0];
      if (file && file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target.result;
          // Tách nội dung thành mảng các dòng
          this.lines = fileContent.split('\n').map(line => line.trim());
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a valid text file');
      }},
    handleFileUploadRender() {
      if (this.lines.length) {
        const formattedContentData = this.lines.map(line => {
          const regex = /"Trait Crystal":(\d+)/;
          const match = line.match(regex);
          let traitCrystalValue = 0
          if (match && match[1]) {
            traitCrystalValue = parseInt(match[1], 10);
          }
          const atIndex = line.indexOf(':');
          if (atIndex !== -1) {
            return line.substring(0, atIndex) + "-Trait Crystal: " + traitCrystalValue;
          }else {
            return ''
          }
        })
        console.log('formattedContentData',formattedContentData)
        // Format dữ liệu thành chuỗi với mỗi dòng trên một dòng mới
        // const formattedContent = this.lines.join('\n');
        // const blob = new Blob([formattedContent], { type: 'text/plain' });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'formatted-data.txt';
        // a.click();
        // URL.revokeObjectURL(url);
      } else {
        alert('No data to download');
      }
    }
  }
};
</script>
