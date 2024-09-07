<template>
  <div class="mod-bg-1 mod-nav-link desktop chrome webkit pace-done blur">
    <div class="page-wrapper auth">
      <div class="page-inner bg-brand-gradient">
        <div class="page-content-wrapper bg-transparent m-0">
          <div class="height-10 w-100 shadow-lg px-4 bg-brand-gradient">
            <div class="d-flex align-items-center container p-0">
              <div class="page-logo width-mobile-auto m-0 align-items-center justify-content-center p-0 bg-transparent bg-img-none shadow-0 height-9 border-0">
              </div>
            </div>
          </div>
          <Nuxt/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  auth: 'guest',
  components: {},
  mounted() {
    this.loadSavedTheme()
  },
  methods: {
    loadSavedTheme() {
      'use strict';
    }
  }
}
</script>
