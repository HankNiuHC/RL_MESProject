<template>
  <v-container class="py-0">
    <!--    最上层-->
    <v-tabs
      v-model="currentItem"
      slider-color="grey darken-2"
      left
    >
      <v-tab
        v-for="item in items"
        :key="item.Id"
        :href="'#' + item.Id"
        class="font-weight-black"
        :style="{backgroundColor: (item['Abnormal'] === 1?'#FFEBEE':'')}"
      >
        <v-icon small class="mr-1" v-if="item['Abnormal'] === 1">mdi-lock-alert</v-icon>
        #{{ item.CaldronNum }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentItem">
      <!--      详情-->
      <v-tab-item
        v-for="item in items"
        :key="item.Id"
        :value="item.Id"
      >
        <v-card flat height="90" color="grey lighten-5">
          <v-row>
            <v-col cols="10" class="py-2">
              <v-card-text class="py-1">
                {{item.BatchId}}-#{{ item.CaldronNum }}-{{unit}}-{{currentProcess}}<br>
                <span v-if="Unqualified">
<!--                  <v-menu-->
                  <!--                    v-model="menu"-->
                  <!--                    :close-on-content-click="false"-->
                  <!--                    :nudge-width="200"-->
                  <!--                    offset-x-->
                  <!--                  >-->
                  <!--                    <template v-slot:activator="{ on, attrs }">-->
                  <!--                    <v-btn-->
                  <!--                      v-bind="attrs"-->
                  <!--                      v-on="on"-->
                  <!--                      icon-->
                  <!--                    >-->
                  <!--                      <v-icon class="mr-1" color="#E53935">mdi-shield-off</v-icon>-->
                  <!--                    </v-btn>-->
                  <!--                  </template>-->
                  <!--                    <v-card>-->
                  <!--                      <v-list>-->
                  <!--                        <v-list-item>-->
                  <!--                          <v-list-item-content>-->
                  <!--                            <v-list-item-title>John Leider</v-list-item-title>-->
                  <!--                            <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>-->
                  <!--                          </v-list-item-content>-->
                  <!--                        </v-list-item>-->
                  <!--                        <v-list-item>-->
                  <!--                          <v-list-item-content>-->
                  <!--                            <v-list-item-title>John Leider</v-list-item-title>-->
                  <!--                            <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>-->
                  <!--                          </v-list-item-content>-->
                  <!--                        </v-list-item>-->
                  <!--                        <v-list-item>-->
                  <!--                          <v-list-item-content>-->
                  <!--                            <v-list-item-title>John Leider</v-list-item-title>-->
                  <!--                            <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>-->
                  <!--                          </v-list-item-content>-->
                  <!--                        </v-list-item>-->
                  <!--                      </v-list>-->
                  <!--                      <v-card-actions>-->
                  <!--                        <v-spacer></v-spacer>-->
                  <!--                        <v-btn text @click="menu = false">关闭</v-btn>-->
                  <!--                      </v-card-actions>-->
                  <!--                    </v-card>-->
                  <!--                  </v-menu>-->
                    <v-icon class="mr-1" color="#1E88E5">mdi-shield-remove</v-icon>使用不合格物料
                </span>
                <span v-if="change"><v-icon class="mr-1" color="#F9A825">mdi-alert-box</v-icon>变更釜次</span>
                <!--筛选器-->
              </v-card-text>
            </v-col>
            <v-col cols="2">
              <v-menu offset-y>
                <template
                  v-slot:activator="{ on, attrs }"
                >
                  <v-btn icon small
                         v-bind="attrs"
                         v-on="on">
                    <v-icon>mdi-filter</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="item in filters"
                    :key="item.key"
                    @click="changeFilter(item.key)"
                    :disabled="item.key===currentFilter"
                  >
                    <v-list-item-title>
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-row>
        <!--        左侧-->
        <v-col cols="3" class="px-0">
          <v-virtual-scroll
            :items="details"
            :item-height="55"
            :height="height"
          >
            <template
              v-slot="{item}"
            >
              <v-card
                dense
                color="grey lighten-3"
                elevation=3
              >
                <v-card-text
                  @click="getProcess(currentItem,item.Id,item.Process,currentItemNum)"
                  :style="{backgroundColor:(item.Id===currentMenu?'#FFFFFF':'')}"
                  class="align-center pr-2"
                >
                  <v-row>
                    <v-col cols="3" class="py-0 pl-1">
                      <!--                      已完成-->
                      <v-icon small v-if="item.Status === 0" :color="item.Unusual === 1?'#E53935':''">
                        mdi-checkbox-marked
                      </v-icon>
                      <!--                      正在-->
                      <v-icon small v-else-if="item.Status === 2" :color="item.Unusual === 1?'#E53935':''">
                        mdi-checkbox-blank-outline
                      </v-icon>
                      <!--                      未开始-->
                      <v-icon small v-else-if="item.Status === 1" :color="item.Unusual === 1?'#E53935':''">
                        mdi-checkbox-blank-circle
                      </v-icon>
                      <!--                      别人-->
                      <v-icon small v-else-if="item.Status === 3" :color="item.Unusual === 1?'#E53935':''">
                        mdi-account-multiple
                      </v-icon>
                    </v-col>
                    <v-col cols="9" class="py-0 px-1">
                      <p :class="item.Id===currentMenu?'font-weight-black':''" class="caption align-center">
                        {{ item.Process | ellipsis}}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
          </v-virtual-scroll>
        </v-col>
        <!--        右侧-->
        <v-col cols="9" class="pl-0">
          <v-virtual-scroll
            :items="['1']"
            :item-height="2000"
            :height="height"
          >
            <template v-shot="{item}">
              <!--              手风琴组件-->
              <v-expansion-panels popout v-model="panel" multiple>
                <v-expansion-panel
                  v-for="(text,index) in texts"
                  :key="text.Id"
                  :readonly="text.Status===1"
                  :style="{backgroundColor:(text.Status ===0?'#F5F5F5':'')}"
                  @click="startData(text.Id,text.Status,index)"
                >
                  <v-expansion-panel-header>
                    <template v-slot:default="{ open }">
                      <v-row no-gutters>
                        <v-col><h3>{{text.Index}}.{{text.Text}}</h3></v-col>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content eager>
                    <!--                                                                                           注意-->
                    <v-form ref="form" v-model="valid" v-if="text.Status === 2 || text.Status === 3">
                      <v-list v-for="i in list" :key="i.Model">
                        <v-text-field :label="i.Label" v-model="obj[i.Model]" v-if="i.Type === 2" :rules="numberRules"
                                      required></v-text-field>
                        <v-text-field :label="i.Label" v-model="obj[i.Model]" v-if="i.Type === 1" :rules="nameRules"
                                      required></v-text-field>
                        <v-text-field :label="i.Label" v-model="obj[i.Model]" v-if="i.Type === 9"></v-text-field>
                        <img-input :label="i.Label" v-model="obj[i.Model]" v-bind:id="i.Model" @childFn="parentFn"
                                   @deletFn="imgDelet" v-else-if="i.Type === 4"></img-input>
                        <video-input :label="i.Label" v-model="obj[i.Model]" v-bind:id="i.Model" @videoFn="videoFn"
                                     @deletFn="imgDelet" v-else-if="i.Type === 5"></video-input>
                        <qr-input :label="i.Label" v-model="obj[i.Model]" v-bind:testData="i.Data" :ids="i.Model"
                                  @qrFn="codeFn" v-else-if="i.Type === 3"></qr-input>
                        <qr-time :label="i.Label" v-model="obj[i.Model]" v-bind:testData="i.Data" :ids="i.Model"
                                 @qrTime="timeFn" v-else-if="i.Type === 8"></qr-time>
                        <timing-input :label="i.Label" v-bind:id="i.Model" :timingData="i.Data"
                                      :currentProcess="currentProcess" :currentItemNum="currentItemNum"
                                      @childFn="timingFn"
                                      v-else-if="i.Type === 7"></timing-input>
                      </v-list>
                      <v-btn class="float-right" :disabled="!valid" @click="submit(text.Id,index)">提交</v-btn>
                      <v-btn text class="float-right mx-4" @click="cancel">取消</v-btn>
                    </v-form>
                    <v-form v-else-if="text.Status === 0">
                      <v-list v-for="i in submitLst" :key="i.id" style="background-color: #F5F5F5 ">
                        <v-text-field :label="i.label" :value="i.value" readonly></v-text-field>
                      </v-list>
                      <v-btn text class="float-right">关闭</v-btn>
                    </v-form>

                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-virtual-scroll>
        </v-col>
      </v-row>
    </v-tabs-items>
    <!--    异常锁定弹框-->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">异常锁定</v-card-title>
          <v-card-text>
            请联系领班进行异常解锁！<br>该釜次所有任务暂停操作
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--    巡检提示框-->
    <v-row justify="center">
      <v-dialog v-model="inspection" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">巡检提示</v-card-title>
          <v-card-text>
            请在：{{ inspectionTime }}分钟后巡检并提交数据 <br>
            剩余巡检次数：3次
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="func1">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
  import ImgInput from './utils/ImgInput'
  import VideoInput from './utils/VideoInput'
  import QrInput from './utils/QrInput'
  import QrTime from './utils/QrTime'
  import TimingInput from './utils/TimingInput'
  import {
    getAllPendingTask,
    getAllPendingTaskKettle,
    statusNoToken,
    getAllPendingProcessTask,
    getDataVerification,
    setOprParm,
    getInstance
  } from '../utils/api'

  export default {
    components: {ImgInput, VideoInput, QrInput, QrTime, TimingInput},
    data: () => ({
      currentItem: null,//当前釜次
      currentMenu: null,//当前工序ID
      items: [],//釜次列表
      unit: '',//当前所属单元操作
      currentProcess: '',//当前工序Name
      currentAction: null,
      details: [],//当前釜次下的工序
      height: null,//动态获取设备高度
      texts: {},//当前釜次-工序的操作动作
      filters: [{title: '我的待办任务', key: 1}, {title: '我的全部任务', key: 2}, {title: '釜次全部任务', key: 3}],//筛选器列表
      currentFilter: 1,//当前筛选状态
      list: [],//数据验证项
      obj: {},//收集数据
      valid: false,
      panel: [], //展开面板
      startTimeLst: [], //开始时间列表
      isCalculate: false, //计算公式标识
      dialog: false, //异常弹框
      inspection: false, //巡检弹框
      inspectionTime: 30,
      currentItemNum: null, //当前釜次号
      Unqualified: null,
      change: null,
      menu: false,
      submitLst: [
        {label: '温度', value: '25', id: '1234564'},
        {label: '扫码', value: '已通过', id: '1234444'}
      ], //测试 已提交数据展示用
      nameRules: [
        v => !!v || '必填',
      ],
      numberRules: [
        v => !!v || '必填',
        v => (/^(-?\d+)(\.\d+)?$/.test(v)) || '请输入数字！',
      ]
    }),

    methods: {
      func1() {
        this.inspection = false;
        this.inspectionTime = null;
      },

      // 获取釜次待办任务
      getMenu: function (Id, currentItemNum) {
        let that = this;
        this.currentAction = null;
        this.currentItemNum = currentItemNum;
        this.startTimeLst = [];
        getAllPendingTaskKettle(Id).then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.items = res.Items;
              that.details = res.Details;
              that.unit = res.Unit;
              that.currentMenu = that.details[0].Id;
              that.texts = res.Data;
              that.currentProcess = that.details[0].Process;
              that.panel = [];
              that.obj = {};
            } else if (res.Code === 1031) {
              that.$message.top().timeout(3000).error('数据不合法');
            } else {
              statusNoToken()
            }
          }
        })
      },

      //获取釜次工序待办任务
      getProcess: function (id, process, name, currentItemNum) {
        this.currentItemNum = currentItemNum;
        this.currentAction = null;
        this.startTimeLst = [];
        let that = this;
        getAllPendingProcessTask(id, process).then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.items = res.Items;
              that.details = res.Details;
              that.unit = res.Unit;
              that.currentMenu = process;
              that.texts = res.Data;
              that.currentProcess = name;
              that.obj = {};
            } else if (res.Code === 1031) {
              that.$message.top().timeout(3000).error('数据不合法');
            } else {
              statusNoToken()
            }
          }
        })
      },

      //获取待办工作
      getFirst: function () {
        this.items = [{"Id": "XARL-000000022", "CaldronNum": "1", "BatchId": "CA0021X1-88", "Abnormal": 1},
          {"Id": "XARL-000000023", "CaldronNum": "2", "BatchId": "CA0021X1-88", "Abnormal": 0}];
        this.details = [{"Id": 5637154609, "Process": "核料", "Status": 0, "Unusual": 1}, {
          "Id": 5637154610,
          "Process": "化料",
          "Status": 1,
          "Unusual": 1
        }, {"Id": 5637154611, "Process": "保温", "Status": 2, "Unusual": 0}, {
          "Id": 5637154612,
          "Process": "出料",
          "Status": 3,
          "Unusual": 0
        }, {"Id": 5637154613, "Process": "扫尾", "Status": 3, "Unusual": 0}, {
          "Id": 5637154614,
          "Process": "核料",
          "Status": 3,
          "Unusual": 0
        }, {"Id": 5637154615, "Process": "设备检查", "Status": 3, "Unusual": 0}];
        this.unit = "原料准备";
        this.Unqualified = 1;
        this.change = 1;
        this.currentMenu = 5637154609;
        this.currentItemNum = "1";
        this.texts = [{
          "Id": 5637147879,
          "Index": 1,
          "Text": "检查物料名称是否为CA0003E2、批次号清晰可见",
          "Status": 0
        }, {
          "Id": 5637153576, "Index": 1, "Text": "检查物料名称是否为CA0003E2、批次号清晰可见", "Status": 3
        }, {
          "Id": 5637153577,
          "Index": 2,
          "Text": "对应COA报告单显示合格",
          "Status": 1
        }, {
          "Id": 5637147880, "Index": 2, "Text": "对应COA报告单显示合格", "Status": 1
        }];
        this.list = [{
          "Type": 2,
          "Model": "5637148484",
          "Label": "扫描设备开始条码",
          "Info": "容积",
          "Data": "200",
          "State": "3",
          "Placeholder": "%1",
          "IsNeedInspection": "0",
          "InspectionTimes": " ",
          "InspectionInterval": " "
        }];
        this.obj = {};
        this.currentAction = null;
        this.startTimeLst = [];
        //循环出状态为 进行中 3 的动作的 index 并打开
        // let statusIng = [];
        // for (let a of this.texts){
        //   if (a.Status === 3){
        //     statusIng.push(this.texts.indexOf(a));
        //     break
        //   }
        // }
        // if (statusIng.length >0){
        //   this.panel = statusIng
        // }
        this.findIngStatus()
      },
      findIngStatus: function () {
        let statusIng = [];
        let statusIndex = null;
        let actionId = null;
        for (let a of this.texts) {
          if (a.Status === 3) {
            statusIndex = this.texts.indexOf(a);
            statusIng.push(statusIndex);
            actionId = a.Id;
            break
          }
        }
        if (statusIng.length > 0) {
          // this.startData(actionId,3,statusIndex);
          this.panel = statusIng
        }
      },
      // 筛选器：默认选中我的进行中，并保持目前筛选的状态在选择列表Disabled
      changeFilter: function (key) {
        this.currentFilter = key
      },

      //提交数据-1、计算公式（计算并回传计算结果）2、数据验证项（数据校验 偏差、锁定） 3、巡检数据（插入日历提醒）
      submit(id, index) {
        let res = Object.keys(this.obj);
        let lst = [];
        for (let a of this.list) {
          if (res.indexOf(a.Model) < 0 && a.Type !== 6) {
            lst.push(a.Info)
          }
        }
        if (lst.length > 0) {
          plus.nativeUI.alert(lst + "未提交")  //判断是否
        } else {
          alert('OK')
          // this.panel = [];
          // let that = this;
          // if (this.isCalculate) {                          //计算公式一次提交数据
          //
          //   // 计算公式-开始
          //   let evalLst = [];
          //   let evalObj = [];
          //   for (let b of res) {
          //     for (let c of this.list) {
          //       if (c.Model === b && c.Type === 6) {
          //         evalLst.push(c.Data);
          //         evalObj.push(c.Model)
          //       }
          //     }
          //   }
          //   let endCalculate = [];
          //   for (let d of evalLst) {
          //     // evalLst=['(%1/%2)','%3+%4']
          //     // evalObj = ['567564','4564546']
          //     let f = {};
          //     // f = {"%1":5637152828};
          //     for (let e of this.list) {
          //       if (d.indexOf(e.Placeholder) > -1) {
          //         f[e.Placeholder] = e.Model
          //       }
          //     }
          //     let g = Object.keys(f);
          //     // g = ['%1','%2']
          //     for (let h of g) {
          //       let j = f[h];
          //       let i = d.replace(h, this.obj[j]);
          //       d = i;
          //     }
          //     endCalculate.push(eval(d))
          //   }
          //   for (let k of evalObj) {
          //     let m = evalObj.indexOf(k);
          //     this.obj[k] = endCalculate[m]
          //   }
          //   // 计算公式-结束
          //
          //   setOprParm(this.obj).then(data => {                   //计算公式提交公式并获取验证项
          //     let res = that.transXml(data);
          //     if (res.Code === 1000) {
          //       // 计算公式提交完成后 发送二次获取数据验证项接口
          //       that.$message.top().timeout(2000).success('提交成功');
          //       let it = that;
          //       that.obj = {}; //清空已提交的计算公式数据
          //       getDataVerification(that.currentAction).then(data => {
          //         if (data.status === 200) {
          //           let res = it.transXml(data);
          //           if (res.Code === 1000) {
          //             let stateLst = []; //筛选已提交数据项用
          //             for (let b of res.Data) {
          //               if (b.State === '0') {
          //                 stateLst.push(b)
          //               } else if (b.State === '1' && b.Type === 7) {
          //                 stateLst.push(b)
          //               }
          //             }
          //             it.list = stateLst; //筛选出已提交过的计算公式的验证项
          //             it.panel = [index];  //展开
          //             it.isCalculate = null; //取消计算公式标记
          //           }
          //           //判断巡检数据（预留）
          //           else {
          //             it.isCalculate = null; //取消标记
          //             statusNoToken()
          //           }
          //         }
          //       });
          //     }
          //   })
          // } else {                          //验证项提交数据
          //   setOprParm(this.obj).then(data => {
          //     if (data.status === 200) {
          //       let res = that.transXml(data);
          //       if (res.Code === 1000) {       //数据提交成功
          //         that.$message.top().timeout(2000).success('数据验证通过');
          //         let it = that;
          //         that.obj = {};
          //         that.list = [];
          //         getDataVerification(it.currentAction).then(data => {      //获取巡检项目
          //           let res = it.transXml(data);
          //           if (res.Code === 1000) {
          //             let stateLst = [];                //筛选已提交数据项用
          //             for (let b of res.Data) {
          //               if (b.State === '0') {
          //                 stateLst.push(b)
          //               }
          //             }
          //             it.list = stateLst;
          //             it.panel = [index];  //展开
          //             it.inspection = true;  //巡检弹窗
          //           }
          //         })
          //       } else if (res.Code === 1041) {
          //         that.$message.top().timeout(5000).warning('数据偏差！已生产偏差管理单');
          //       } else if (res.Code === 1042) { //异常锁定
          //         that.dialog = true
          //       } else {
          //         statusNoToken()
          //       }
          //     }
          //   });
          //   this.obj = {};
          //   this.valid = false;
          //   this.list = [];
          //   this.isCalculate = null; //取消计算公式标识
          // }
        }
      },

      cancel() {
        this.obj = {};
        this.panel = []
      },

      parentFn(payload) {
        let imgBase64 = payload.data;
        let picId = payload.id;
        this.obj[picId] = imgBase64
      },

      videoFn(data) {
        let vidBase64 = data.data;
        let vieId = data.id;
        this.obj[vieId] = vidBase64;
      },

      imgDelet(model) {
        delete this.obj[model]
      },

      codeFn(payload) {
        let status = payload.data;
        let qrId = payload.id;
        this.obj[qrId] = status
      },

      timeFn(payload) {
        let time = payload.data;
        let qrtimeId = payload.id;
        this.obj[qrtimeId] = time
      },

      timingFn(id) {
        this.obj[id] = 'OK';
      },

      //获取数据验证项目并回传开始时间 判断是否为计算公式 若是则将公式写入obj
      startData(id, status, index) {
        if (this.currentAction === null || this.currentAction === id) {
          if ((status === 2 || status === 3) && this.startTimeLst.indexOf(id) === -1) {
            this.startTimeLst.push(id);
            this.obj = {};
            this.list = [];
            let that = this;
            getDataVerification(id).then(data => {
              if (data.status === 200) {
                let res = that.transXml(data);
                that.currentAction = id;
                if (res.Code === 1000) {
                  let stateLst = [];
                  for (let b of res.Data) {
                    if (b.State === '0') {
                      stateLst.push(b)
                    } else if (b.State === '1' && b.Type === 7) {
                      stateLst.push(b)
                    }
                  }
                  that.list = stateLst; //筛选出已提交过的计算公式的验证项
                  that.isCalculate = null; //取消计算公式标记
                } else if (res.Code === 10001) {  //计算公式
                  that.list = res.Data;
                  for (let b of res.Data) {
                    if (b.Type === 6) {
                      this.obj[b.Model] = b.Data;
                    }
                  }
                  that.isCalculate = true;
                } else if (res.Code === 1042) {  //异常锁定
                  that.dialog = true
                } else if (res.Code === 1041) {
                  that.$message.top().timeout(5000).warning('数据偏差！已生产偏差管理单');
                }
              } else {
                that.isCalculate = null; //取消标记
                statusNoToken()
              }
            })
          }
        } else {
          this.panel = [index];  //锁住其他操作动作不能展开获取验证项目 一次只能展开一项
        }
      }
    },
    created() {
      // alert(plus.runtime.versionCode);   //获取系统版本
      // plus.geolocation.getCurrentPosition(function (p) {
      //   alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
      // }, function (e) {
      //   alert('Geolocation error: ' + e.message);
      // });
      this.getFirst();
      // 获取屏幕高度动态计算左侧滑块高度
      this.height = window.innerHeight - 250;
    },
    // 监听Tab页左右滑动 !=null 解决初次加载就监听问题; 监听筛选器切换，切换后重新获取釜次对应工序
    watch: {
      currentItem(newName, oldName) {
        if (oldName !== null) {
          this.getMenu(this.currentItem, this.currentItemNum);
        }
      },

      currentFilter() {
        this.getMenu(this.currentItem, this.currentItemNum)
      }
    },
    // 截取前4位文字
    filters: {
      ellipsis(value) {
        if (!value) return '';
        if (value.length > 4) {
          return value.substring(0, 4) + '..'
        }
        return value
      }
    }
  }
</script>

<style>
  .v-tab {
    min-width: 60px !important;
  }
</style>
