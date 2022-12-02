<template>
  <div>
    <header class="mb-3 border-bottom bg-white bg-opacity-25">
      <div class="container">
        <div class="d-flex flex-row align-items-center nav">
          <div class="me-auto">
            <a href="/" class="nav-link link-dark d-flex align-items-center">
              <i class="fs-1 bi bi-bell"></i>
              <span class="fs-4 ms-2 d-none d-md-block">{{ $t('headlines.churchtoolsNotifications') }}</span>
            </a>
          </div>
          <div>
            <router-link to="/rules" class="nav-link link-dark d-flex align-items-center">
              <i class="fs-4 bi bi-card-checklist"></i>
              <span class="ms-1 d-none d-md-block">{{ $t('headlines.rules') }}</span>
            </router-link>
          </div>
          <div>
            <router-link to="/reports" class="nav-link link-dark d-flex align-items-center">
              <i class="fs-4 bi bi-file-earmark-spreadsheet"></i>
              <span class="ms-1 d-none d-md-block">{{ $t('headlines.reports') }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div v-if="loadState !== 'LOADED'" class="position-absolute top-50 start-50 translate-middle">
      <div class="spinner-grow me-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow me-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <router-view :class="loadState === 'LOADED' ? 'd-block' : 'd-none'" />

    <footer class="py-3 border-top">
      <div class="container">
        <div class="d-flex align-items-center">
          <a href="/" class="text-decoration-none link-dark lh-1">
            <i class="fs-3 bi bi-bell"></i>
          </a>
          <span class="ps-2 text-muted">© {{ new Date().getFullYear() }} {{ $t('headlines.churchtoolsNotifications') }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      user: {},
      auth: false,
      rules: [],
      fields: [],
      reload: null,
      loadState: 'UNLOADED',
      loadingPromise: null,
    }
  },
  methods: {
    async load() {
      if(this.loadState === 'UNLOADED'){
        this.loadState = 'LOADING'
        this.loadingPromise = new Promise(async (resolve) => { // eslint-disable-line no-async-promise-executor
          const whoami = await this.getter('whoami', {only_allow_authenticated: true})
          console.log(whoami)
          this.user.id = whoami.id
          this.user.email = whoami.email
          this.rules = await this.getter('rules', {id: this.user.id}, false, async (res) => {
            if(res.status == 204){
              this.user.loginToken = await this.getter('persons/'+ this.user.id +'/logintoken')
              this.user = await this.poster('user', this.user, false)
              return await this.getter('rules', {id: this.user.id}, false)
            }
          })
          this.fields = await this.getter('fields')
          this.loadState = 'LOADED'
          resolve()
        })
        await this.loadingPromise
      }else if(this.loadState === 'LOADING'){
        await this.loadingPromise
      }
    },
    async getter(endpoint, params = {}, ctApi = true, callback) {
      const apiURL = process.env.VUE_APP_BACKEND_URL + (ctApi ? '/ct/' : '/api/')
      try {
        const res = await axios.get(apiURL + endpoint, {
          params: params,
          withCredentials: true
        })
        if (res.status === 200) {
          return res.data.data
        }
        if(callback){
          return callback(res)
        }
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push('login')
        } else {
          console.log(error.response.data)
        }
      }
    },
    async poster(endpoint, body, ctApi = true, callback) {
      const apiURL = process.env.VUE_APP_BACKEND_URL + (ctApi ? '/ct/' : '/api/')
      try {
        const res = await axios.post(apiURL + endpoint, body, { withCredentials: true })
        if (res.status === 200) {
          return res.data.result
        }
        if(callback){
          return callback(res)
        }
      } catch (error) {
        if (error.response.status === 401) {
          this.$router.push('login')
        } else {
          console.log(error.response.data)
        }
      }
    },
  },
  beforeMount() {
    document.title = this.$t('headlines.churchtoolsNotifications') + ' ' + this.$t('headlines.emoji')
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 75px !important; /* Margin bottom by footer height */
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  z-index: -999;
}
</style>
