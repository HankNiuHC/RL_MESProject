<template>
  <div>
    <v-text-field :label=label @click="scanQR(testData,ids)" readonly prepend-inner-icon="mdi-qrcode-scan"
                  v-model=isPass
    ></v-text-field>
    <div v-if="isShow">
      <video
        ref="video"
        id="video"
        width="100%"
        height="200px"
      ></video>
    </div>
    <v-row class="d-flex justify-center" v-if="isBtnShow">
      <v-btn fab small @click="func(ids,testData)">
        <v-icon>mdi-stop</v-icon>
      </v-btn>
    </v-row>
    <v-row class="d-flex justify-center" v-if="status === 3">
      <v-btn fab small @click="func(ids,testData)">
        <v-icon>mdi-stop</v-icon>
      </v-btn>
    </v-row>
  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import adapter from 'webrtc-adapter';
  import {startOprActionParm} from '../../utils/api'
  import {endOprActionParm} from '../../utils/api'
  // WebRTC适配器 只需要引入就ok
  import {BrowserMultiFormatReader} from '@zxing/library';

  export default {
    data: () => ({
      isShow: null,
      isPass: null,
      codeReader: new BrowserMultiFormatReader(),
      textContent: null,
      isBtnShow:false,
    }),
    props: {
      label: {
        type: String,
        required: true
      },
      ids: {
        type: String,
        required: true
      },
      testData: {
        type: String,
        required: true
      },
      status:{
        type:Number,
        required:true
      }
    },
    beforeDestroy() {
      this.codeReader.reset()
    },
    methods: {
      scanQR(testData, ids, status) {
        this.isShow = true;
        this.scan(testData, ids, status);
      },
      async scan(data,ids, status) {
        this.codeReader.getVideoInputDevices()
          .then((videoInputDevices) => {
            let firstDeviceId = videoInputDevices[0].deviceId;
            let videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
            if (videoInputDevices.length > 1) {
              if (videoInputDeviceslablestr.indexOf('back') > -1) {
                firstDeviceId = videoInputDevices[0].deviceId;
              } else {
                firstDeviceId = videoInputDevices[1].deviceId;
              }
            }
            this.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
              if (result) {
                this.textContent = result.text;
                if (this.textContent === data) {
                  this.isShow = null;
                  this.isPass = data;
                  if (status === 2){
                    this.isBtnShow = true;
                  }
                  plus.nativeUI.toast("验证通过 开始计时");
                  plus.device.vibrate(500); //震动
                  startOprActionParm(ids);
                  this.codeReader.canEnumerateDevices = true;
                } else {
                  plus.nativeUI.toast("识别错误，请重新确认条形码/二维码！");
                }
              }
              if (err && !(err)) {
                console.error(err);
              }
            });
            console.log(`Started continous decode from camera with id ${firstDeviceId}`);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      func(ids,testData) {
        if (this.isPass !== null) {
          let that = this;
          endOprActionParm(ids).then(data =>{
            if (data.status === 200){
              let obj = {data:testData,id:ids};
              that.$emit('qrTime',obj);
              that.isBtnShow = false;
              that.status = 1
            }
          })
        } else {
          plus.nativeUI.alert('请先扫码开始计时！')
        }
      }
    },
  }
</script>
