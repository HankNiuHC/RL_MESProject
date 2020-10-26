<template>
  <div>
    <v-text-field :label=label @click="takePic(id)" readonly prepend-inner-icon="mdi-camera">
    </v-text-field>
    <v-row>
      <v-col cols="6">
        <v-img
          :src="listData"
          :height="listData?100:0"
          class="text-right pa-1"
          @click="imgView"
        >
          <v-btn
            icon
            dark
            @click.stop="deletePic(id)"
            v-if="listData !== null"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: "ImgInput",
    data() {
      return {
        listData: null,
        lst: []
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
      takePic(id) {
        let that = this;
        let plusCamera = plus.camera.getCamera();
        plusCamera.captureImage(function (e) {
          plus.io.resolveLocalFileSystemURL(e, function (entry) {
            let plusImg = entry.toLocalURL();
            that.lst = [];
            that.lst.push(plusImg);
            plus.nativeUI.toast(plusImg);
            plus.zip.compressImage({
                src: plusImg,
                dst:plusImg,
                overwrite:true,
                quality: 20,
                format:"jpg",
                width:'50%',
                height:'50%'
              },function () {
              plus.nativeUI.toast('压缩成功');
              that.uploadPic(plusImg, id)
            });
          }, function (err) {
            console.log(err + 'ERROR')
          })
        }, function (err) {
          console.log(err)
        }, {})
      },
      //上传图片Base64
      uploadPic(plusImg, id) {
        let that = this;
        let image = new Image();
        image.src = plusImg;
        image.onload = function () {
          let imgData = that.getBase64Image(image);
          // console.log(imgData);
          that.listData = imgData;
          let obj = {data: imgData, id: id};
          that.$emit('childFn', obj)
        }
      },
      //将图片转Base64格式
      getBase64Image(img) {
        let width = img.width;
        let height = img.height;
        //判断图片宽度，再按比例设置宽度和高度的值
        if (width > 1024) {
          width = 1024;
          height = Math.ceil(1024 * (img.height / img.width));
        }

        //将图片重新画入canvas中
        let canvas = document.getElementById("compressCanvas");
        if (!canvas) { //创建一个canvas画布
          canvas = document.createElement("canvas"); //创建canvas标签
          canvas.id = "compressCanvas"; //给外层容器添加一个id
          canvas.style.position = "fixed";
          canvas.style.zIndex = "-1";
          canvas.style.opacity = "0";
          canvas.style.top = "-100%";
          canvas.style.left = "-100%";
        }
        let context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.fill();
        context.closePath();
        context.drawImage(img, 0, 0, width, height);
        let dataURL = canvas.toDataURL("image/jpg", 0.1);
        return dataURL
      },
      //删除图片预览Base64
      deletePic(id) {
        this.listData = null;
        this.$emit('deletFn', id)
      },
      imgView() {
        plus.nativeUI.previewImage(this.lst)
      }
    },
  }
</script>

<style scoped>

</style>
