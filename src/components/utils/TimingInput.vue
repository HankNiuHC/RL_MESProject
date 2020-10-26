<template>
  <div>
    <v-text-field :label=label solo readonly prepend-inner-icon="mdi-alarm"></v-text-field>
    <mv-count-down
      @endCallback="countDownE"
      :startTime="startTime"
      :endTime="endTime"
      :endText="endText"
      :hourTxt="'小时'"
      :minutesTxt="'分钟'"
      :secondsTxt="'秒'"
      :isStart="isStart"></mv-count-down>
    <v-row>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn @click="func1(id,timingData,currentProcess,currentItemNum)" fab small :disabled="openShow">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn @click="func2(id)" fab small :disabled="stopShow">
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>

</template>

<script>
  import {startOprActionParm} from '../../utils/api'
  import {endOprActionParm} from '../../utils/api'
  import MvCountDown from 'mv-count-down'
  import localforage from 'localforage'

  export default {
    name: "TimingInput",
    components: {
      MvCountDown
    },
    data() {
      return {
        openShow: true,
        stopShow: true,
        startTime: new Date().getTime(),
        endTime: 0,
        endText: '',
        isStart: false,
      }
    },
    props: {
      label: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      timingData: {
        type: String,
        required: true
      },
      currentProcess: {
        type: String,
        required: true
      },
      currentItemNum: {
        type: String,
        required: true
      }
    },
    methods: {
      func1(id, timingData, currentProcess, currentItemNum) {
        let that = this;
        startOprActionParm(id).then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.setAlarm(parseInt(timingData), 1, 5, 5000, currentProcess, currentItemNum);
              that.setEndTime(parseInt(timingData));
              that.openShow = true;
              that.stopShow = false;
            }
            else if (res.Code === 1032) {
              that.openShow = true;
              that.stopShow = false;
              localforage.getItem(id).then(res =>{
                if (res !== null){
                  that.endTime = res;
                  that.isStart = true;
                }
              });
            }
          }
        })
      },
      func2(id) {
        let that = this;
        endOprActionParm(id).then(data => {
          if (data.status === 200) {
            let res = that.transXml(data);
            if (res.Code === 1000) {
              that.stopShow = true;
              that.$emit('childFn', id)
            }
          }
        })
      },
      setEndTime(value,id) {
        this.endTime = this.startTime + value * 1000;
        localforage.setItem(id, this.endTime);
        this.isStart = true
      },
      countDownE(id) {
        // 结束倒计时回调
        localforage.removeItem(id);
      }
    },
    created(id) {
      localforage.getItem(id).then(res => {
        if (res !== null) {
          this.endTime = res;
          this.isStart = true;
          this.stopShow = false
        }
        else {
          this.openShow = false;

        }
      })
    }
  }
</script>
