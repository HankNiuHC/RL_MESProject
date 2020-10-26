<template>
  <v-container fluid>
    <v-carousel hide-delimiters height="200" cycle>
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
    <v-banner single-line class="mt-5">
      <v-icon
        slot="icon"
        color="warning"
        size="36"
      >
        mdi-wifi-strength-alert-outline
      </v-icon>
      开始待办任务

      <template v-slot:actions>
        <v-btn
          color="primary"
          text
          @click="goTask"
        >
          开始
        </v-btn>
      </template>
    </v-banner>
    <v-row class="pt-16">
      <v-card-text style="height: 100px; position: relative">
        <v-btn
          absolute
          dark
          fab
          top
          right
          color="green"
          @click="reLoad"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-text>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        items: [
          {
            src: 'http://www.xarlm.com/repository/image/E03V6USKRqaFbB-uUIFNEQ.jpg_560xaf.jpg',
          },
          {
            src: 'http://www.xarlm.com/repository/image/qwu2754NS46QBxWJkdKOPw.jpg_560xaf.jpg',
          },
          {
            src: 'http://www.xarlm.com/repository/image/ZFP86BWnSOeUDoYjgBQRUA.png_560xaf.png',
          },
          {
            src: 'http://www.xarlm.com/img/051.jpg',
          },
          {
            src: 'http://www.xarlm.com/img/052.jpg',
          },
          {
            src: 'http://www.xarlm.com/img/054.jpg',
          },
          {
            src: 'http://www.xarlm.com/img/111.png',
          },
        ],
        cards: [
          {title: '任务分发', flex: 6},
          {title: '开始工作', flex: 6},
          {title: '个人中心', flex: 6},
          {title: '退出登录', flex: 6},

        ],
      }
    },
    methods: {
      goTask() {
        this.$router.push({name: 'test'})
      },
      reLoad() {
        this.$router.go(0)
      }
    }
  }
</script>

<style>
</style>
