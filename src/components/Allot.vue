<template>
  <v-container class="py-0 mb-10">
    <v-tabs v-model="currentItem" slider-color="grey darken-2" right>
      <v-tab
        v-model="currentItem"
        v-for="item in lst"
        :key="item.UserId"
        :href="'#' + item.UserId"
        @click="changeStaff"
      >{{item.UserName}}
      </v-tab>
    </v-tabs>
    <v-sheet class="pa-2">
      <v-text-field
        v-model="search"
        label="搜索"
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
    </v-sheet>
    <v-card-text>
      <v-treeview
        :items="items"
        :search="search"
        selectable
        selected-color="teal"
        v-model="selection"
        open-all
      >
        <template v-slot:prepend="{ item }">
          <v-icon
            v-if="item.children"
            v-text="`mdi-${item.index === 1 ? 'menu' : 'folder-network'}`"
          ></v-icon>
        </template>
      </v-treeview>
    </v-card-text>
    <v-row class="pt-4">
      <v-card-text style="height: 100px; position: relative">
        <v-btn
          absolute
          dark
          fab
          top
          right
          color="green"
          @click="submit"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-card-text>
    </v-row>
  </v-container>
</template>

<script>
  import {getStaff, statusNoToken, getPending, taskAssign} from '../utils/api'

  export default {
    data: () => ({
      currentItem: null,//当期员工ID
      lst: [],
      search: null,
      selection: [],
      items: [],
    }),
    methods: {
      getStaff() {
        let that = this;
        getStaff().then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.lst = res.User;
              that.currentItem = res.User[0].UserId;
              that.getPanding()
            } else if (res.Code === 1031) {
              this.$router.go(-1);
              plus.nativeUI.alert('未查询到班组信息') //1031 无班组
            } else {
              statusNoToken()
            }
          }
        })
      },
      changeStaff() {
        console.log(this.currentItem);
        this.selection = [];
        this.items = [];
        this.getPanding();
      },
      getPanding() {
        let that = this;
        getPending().then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.items = res.Items
            } else if (res.Code === 1031) {
              this.$router.go(-1);
              plus.nativeUI.alert('暂无待分配任务'); //1031 无任务
            } else {
              statusNoToken()
            }
          }
        })
      },
      submit() {
        // let a = confirm('请确认将' + this.selection.length + '项操作动作分发？');
        // if (a === true) {
        //   let that = this;
        //   taskAssign(this.currentItem, this.selection).then(data => {
        //     if (data.status === 200) {
        //       let res = that.transXml(data);
        //       if (res.Code === 1000) {
        //         that.selection = [];
        //         that.items = [];
        //         this.getPanding()
        //       }
        //     }
        //   })
        // }
        let that = this;
        plus.nativeUI.confirm('请确认将' + that.selection.length + '项操作动作分发？', function (e) {
          if (e.index === 0) {
            taskAssign(that.currentItem, that.selection).then(data => {
              if (data.status === 200) {
                let res = that.transXml(data);
                if (res.Code === 1000) {
                  that.selection = [];
                  that.items = [];
                  that.getPanding()
                }
              }
            })
          }
        })
      }
    },
    created() {
      this.getStaff();
    },
  }
</script>

