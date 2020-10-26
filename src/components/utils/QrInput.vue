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
      <v-text-field label="手动输入" clearable v-model="textContent"></v-text-field>
      <v-btn fab small @click="submit(testData,ids)">
        <v-icon small>mdi-check</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  // eslint-disable-next-line no-unused-vars
  import adapter from 'webrtc-adapter';
  // WebRTC适配器 只需要引入就ok
  import {BrowserMultiFormatReader} from '@zxing/library';

  export default {
    data: () => ({
      isShow: null,
      isPass: null,
      codeReader: new BrowserMultiFormatReader(),
      textContent: null,
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
      }
    },
    beforeDestroy() {
      this.codeReader.reset()
    },
    methods: {
      scanQR(testData, ids) {
        this.isShow = true;
        this.scan(testData, ids);
      },
      async scan(data, ids) {
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
                console.log(result);
                this.textContent = result.text;
                if (this.textContent === data) {
                  this.isShow = null;
                  this.isPass = data;
                  plus.nativeUI.toast("验证通过");
                  plus.device.vibrate(500); //震动
                  let obj = {data: data, id: ids};
                  this.$emit('qrFn', obj);
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
      submit(testData, ids) {
        if (testData === this.textContent) {
          let obj = {data: testData, id: ids};
          this.$emit('qrFn', obj);
          plus.nativeUI.toast("验证通过");
          this.isShow = null;
          this.isPass = testData;
          plus.device.vibrate(500); //震动
        }
        else {
          plus.nativeUI.toast("识别错误，请重新确认条形码/二维码！");
        }
      }
    }
  }
</script>
