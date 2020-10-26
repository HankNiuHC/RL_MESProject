<template>
  <div>
    <v-text-field :label=label @click="takeVid(id)" readonly prepend-inner-icon="mdi-video">
    </v-text-field>
    <v-list-item v-if="videoName !== null">
      <v-list-item-content>
        <v-list-item-subtitle>{{ videoName }}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon @click="deletVideo(id)">
        <v-icon>mdi-delete</v-icon>
      </v-list-item-icon>
    </v-list-item>

  </div>
</template>

<script>
  import {uploadImg} from '../../utils/api'

  export default {
    name: "VideoInput",
    data() {
      return {
        listData: null,
        videoName: null
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
      }
    },
    methods: {
      takeVid(id) {
        let that = this;
        var VIDEOZOOM = 200;
        var MediaStore = plus.android.importClass("android.provider.MediaStore");
        var Intent = plus.android.importClass("android.content.Intent");
        var intent = new Intent("android.media.action.VIDEO_CAPTURE");
        intent.putExtra("android.intent.extra.videoQuality", 1);//0 means low quality, 1 means high quality
        intent.putExtra("android.intent.extra.durationLimit", 15);//设置录像时间
        var main = plus.android.runtimeMainActivity();
        main.startActivityForResult(intent, VIDEOZOOM);
        main.onActivityResult = function (requestCode, resultCode, data) {
          var context = main;
          plus.android.importClass(data);
          var uri = data.getData();
          var resolver = context.getContentResolver();
          plus.android.importClass(resolver);
          var cursor = resolver.query(uri, null, null, null, null);
          plus.android.importClass(cursor);
          cursor.moveToFirst();
          var column = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DATA);
          // 获取录制的视频路径
          var filePath = cursor.getString(column);

          // 解析视频文件的属性
          plus.io.resolveLocalFileSystemURL(filePath, function (entry) {
            entry.file(function (file) {
              that.videoName = file.name;
              // var fileReader = new plus.io.FileReader();
              // fileReader.readAsDataURL(file);
              // fileReader.onload = function () {
              //   that.listData = fileReader.result;
              //   let obj = {data: that.listData, id: id};
              //   that.$emit('videoFn', obj)
              // }
              let tokenTimeName = new Date().getTime() + that.$store.state.token + '.' + file.type.split('/')[1];
              that.createUpload(filePath,tokenTimeName);
              let obj = {data:tokenTimeName,id:id};
              that.$emit('videoFn',obj)
            });
          }, function (e) {
            console.log("Resolve file URL failed: " + e.message);
          });
        };
      },
      deletVideo(id) {
        this.listData = null;
        this.videoName = null;
        this.$emit('deletFn', id)
      },
      async createUpload(filePath,name) {
        var task = plus.uploader.createUpload("http://192.168.3.217:88/singleUpload", {}, function (t, status) {
          // 上传完成
          if (status === 200) {
            plus.nativeUI.toast('上传成功：' + t.url);
          } else {
            plus.nativeUI.toast(status);
          }
        });
        task.addFile(filePath, {key: 'file',name:name});
        task.start();
      }
    }
  }
</script>

<style scoped>

</style>
