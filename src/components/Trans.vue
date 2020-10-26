<template>
  <v-container class="py-0 mb-10">
    <v-list
      subheader
      three-line
      flat
    >
      <v-row>
        <v-checkbox label="全选" class="ml-6" v-model="selected"></v-checkbox>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="settings.length > 0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="float-right mr-4"
              color="success" fab dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-transit-transfer</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in lst"
              :key="item.UserId"
              dense
              @click="chooseUser(item.UserId,item.UserName)"
            >
              <v-list-item-title>
                {{ item.UserName }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <v-list-item-group
        v-model="settings"
        multiple

      >
        <v-list-item v-for="(data,index) in datas" :key="index">
          <template v-slot:default="{ active }">
            <v-list-item-action>
              <v-checkbox
                :input-value="active"
                :key="index"
                color="primary"
              ></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>序号:{{data.OprNum}} #{{data.CaldronNum}} {{ data.BatchID }}</v-list-item-title>
              <v-list-item-subtitle>{{data.OprUnitId}} {{data.ProdRouteOprId}}</v-list-item-subtitle>
              <v-list-item-subtitle>{{data.OprActionDesc | ellipsis}}</v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>

</template>

<script>
  import {getStaff, statusNoToken, getMyTansferTask, taskAssign} from '../utils/api'

  export default {
    data() {
      return {
        settings: [],
        lst: null,
        datas: [],
        selected: false,
      }
    },
    watch: {
      selected(newName) {
        if (newName === true) {
          let selectedLst = [];
          for (let c of this.datas){
            selectedLst.push(this.datas.indexOf(c))
          }
          this.settings = selectedLst
        }
        if (newName === false) {
          this.settings = []
        }
      }
    },
    methods: {
      getStaff() {
        let that = this;
        getStaff().then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.lst = res.User;
              that.getTrans()
            } else if (res.Code === 1031) {
              this.$router.go(-1);
              plus.nativeUI.alert('未查询到班组信息')
            } else {
              statusNoToken()
            }
          }
        })
      },
      chooseUser(id,name) {
        // let that = this;
        // plus.nativeUI.confirm(`请确认将"` + text + `"移交给: ` + username, function (e) {
        //   if (e.index === 0) {
        //     let textLst = [];
        //     textLst.push(name);
        //     taskAssign(id, textLst).then(data => {
        //       if (data.status === 200) {
        //         let res = that.transXml(data);
        //         if (res.Code === 1000) {
        //           that.datas = [];
        //           that.getTrans()
        //         }
        //       }
        //     })
        //   }
        // })
        let idLst = [];
        for (let a of this.settings){
          for (let b of this.datas){
            if (a === this.datas.indexOf(b)){
              idLst.push(b.Id)
            }
          }
        }
        let idLength = idLst.length;
        // let d = confirm('请确认将这 ' + idLength + ' 项' + '移交给 ' + name);
        // if (d === true){
        //   let that = this;
        //   taskAssign(id,idLst).then(data =>{
        //     if (data.status === 200){
        //       let res = that.transXml(data);
        //       if (res.Code === 1000){
        //         that.datas = [];
        //         that.settings = [];
        //         that.getTrans()
        //       }
        //     }
        //   })
        // }
        let that = this;
         plus.nativeUI.confirm('请确认将这 ' + idLength + ' 项' + '移交给 ' + name,function (e) {
           if (e.index === 0){
             taskAssign(id,idLst).then(data =>{
               if (data.status === 200){
                 let res = that.transXml(data);
                 if (res.Code === 1000){
                   that.datas = [];
                   that.settings = [];
                   that.getTrans()
                 }
               }
             })
           }
         })
      },
      getTrans() {
        let that = this;
        getMyTansferTask().then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.datas = res.List
            } else if (res.Code === 1031) {
              this.$router.go(-1);
              plus.nativeUI.alert('无可移交任务');
            } else {
              statusNoToken()
            }
          }
        })
      }
    },
    filters: {
      ellipsis(value) {
        if (!value) return '';
        if (value.length > 40) {
          return value.substring(0, 40) + '..'
        }
        return value
      }
    },
    created() {
      this.getStaff()
    }
  }
</script>
