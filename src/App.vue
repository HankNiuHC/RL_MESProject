<template>
  <v-app>
    <!--头部-->
    <v-app-bar
      app
      src="./static/bg-2.jpg"
      dark
      @click="logIn ? drawer = !drawer : clickFn()"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Logo"
          class="shrink mr-2"
          contain
          src="./static/WLogo.png"
          transition="scale-transition"
          width="40"
        />
      </div>

      <v-toolbar-title>现场作业管理系统</v-toolbar-title>

      <v-spacer></v-spacer>
      <span class="caption">UAT-</span>
      <span class="mr-2" v-if="logIn">{{ name }}</span>
      <v-btn
        icon
        large
        v-if="logIn"
      >
        <v-avatar
          size="42px"
          item
          color="grey lighten-3"
          @click.stop="drawer = !drawer"
        >
          <v-img
            src="./static/worker.png"
            alt="Vuetify"
            v-if="role === 1"
          />
          <v-img
            src="./static/leader.png"
            alt="Vuetify"
            v-else-if="role === 2"
          />
        </v-avatar>
      </v-btn>
      <v-btn
        icon
        large
        v-else
      >
        <v-avatar
          size="42px"
          item
          @click.stop="clickFn()"
        >
          <v-icon large>mdi-account-circle</v-icon>
        </v-avatar>
      </v-btn>
    </v-app-bar>
    <!--中间区域-->
    <v-main>
      <v-container fluid class="px-0">
        <router-view></router-view>
      </v-container>
    </v-main>
    <!--底部-->
    <v-bottom-navigation
      fixed
      grow
    >

      <v-btn @click="goBack" style="height: 56px">
        <v-icon medium>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn :to="appsLink" style="height: 56px">
        <v-icon medium>mdi-briefcase-outline</v-icon>
      </v-btn>
      <v-btn :to="homeLink" style="height: 56px">
        <v-icon medium>mdi-home</v-icon>
      </v-btn>

    </v-bottom-navigation>
    <!--左侧抽屉-->
    <v-navigation-drawer
      dark
      v-model="drawer"
      fixed
      app
      touchless
      disable-resize-watcher
      width="180"
      src="./static/bg-2.jpg"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="./static/worker.png" v-if="role === 1"></v-img>
            <v-img src="./static/leader.png" v-else-if="role === 2"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title" v-if="role === 1">操作员: {{ name }}</v-list-item-title>
            <v-list-item-title class="title" v-else-if="role === 2">领班: {{ name }}</v-list-item-title>
            <v-list-item-subtitle>{{ factory }} {{ department }} {{ workshop }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list
        nav
        dense
      >
        <v-list-item-group>
          <v-list-item
            v-for="(item, i) in items1"
            :key="i"
            :to="item.link"
            v-if="role === 1"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, i) in items2"
            :key="i"
            :to="item.link"
            v-if="role === 2"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-6">
          <v-btn color="grey darken-1" block @click="logOut">退出登录</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
  import localforage from 'localforage'

  export default {
    name: 'App',

    data: () => ({
      homeLink: '/',
      appsLink: '/task',
      drawer: false,
      items1: [
        {title: '仪表板', icon: 'mdi-view-dashboard', link: '/allot'},
        {title: '待办任务', icon: 'mdi-account-hard-hat', link: '/task'},
        {title: '任务移交', icon: 'mdi-transit-transfer', link: '/trans'},
        {title: '工具箱', icon: 'mdi-tools', link: '/tools'}
      ],//操作员视图 role=1
      items2: [
        {title: '仪表板', icon: 'mdi-view-dashboard', link: '/'},
        {title: '待办任务', icon: 'mdi-account-hard-hat', link: '/task'},
        {title: '任务分发', icon: 'mdi-clipboard-list-outline', link: '/allot'},
        {title: '任务移交', icon: 'mdi-transit-transfer', link: '/trans'},
        {title: '工具箱', icon: 'mdi-tools', link: '/tools'}
      ],//领班视图 role=2
    }),
    mounted() {

    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      //点击去登录
      clickFn: function f() {
        this.$router.push({name: 'Login'})
      },
      logOut: function () {
        this.$store.commit('logout_method');
        this.drawer = false;
        // this.$router.go(0);
        // this.$router.push({name: 'HelloWorld'});
      }
    },
    computed: {
      logIn: function () {
        return this.$store.state.logIn
      },
      name: function () {
        return this.$store.state.name
      },
      role: function () {
        return this.$store.state.role
      },
      factory: function () {
        return this.$store.state.factory
      },
      department: function () {
        return this.$store.state.department
      },
      workshop: function () {
        return this.$store.state.workshop
      },
    },
    created() {
      localforage.getItem('token').then(value => {
        if (value) {
          this.$store.state.logIn = true;
          this.$store.state.token = value
        }
      }).catch(error => {
        console.log(error)
      });
      localforage.getItem('role').then(value => {
        if (value) {
          this.$store.state.role = value
        }
      }).catch(error => {
        console.log(error)
      });
      localforage.getItem('name').then(value => {
        if (value) {
          this.$store.state.name = value
        }
      }).catch(error => {
        console.log(error)
      });
      localforage.getItem('factory').then(value => {
        if (value) {
          this.$store.state.factory = value
        }
      }).catch(error => {
        console.log(error)
      });
      localforage.getItem('department').then(value => {
        if (value) {
          this.$store.state.department = value
        }
      }).catch(error => {
        console.log(error)
      });
      localforage.getItem('workshop').then(value => {
        if (value) {
          this.$store.state.workshop = value
        }
      }).catch(error => {
        console.log(error)
      });
    }
  }
</script>
