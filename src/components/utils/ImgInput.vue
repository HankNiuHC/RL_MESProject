<template>
  <div>
    <v-text-field :label=label @click="takePic(id)" readonly prepend-inner-icon="mdi-camera">
    </v-text-field>
    <v-row>
      <v-col
        v-for="(n,index) in listData"
        :key="index"
        class="d-flex child-flex"
        cols="4"
      >
        <v-card flat tile class="d-flex">
          <v-img
            :src="n"
            aspect-ratio="1"
            class="grey lighten-2 text-right"
            eager
            @click="imgView(index)"
          >
            <v-btn
              small
              icon
              dark
              @click.stop="deletePic(index,id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import {uploadImg} from '../../utils/api'
  export default {
    name: "ImgInput",
    data() {
      return {
        listData: [],
        lst: [],
        imgNameLst:[]
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
            that.lst.push(plusImg);
            plus.nativeUI.toast(plusImg);
            plus.zip.compressImage({
              src: plusImg,
              dst: plusImg,
              overwrite: true,
              quality: 80,
              format: "jpg",
              width: '100%',
              height: '100%'
            }, function () {
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
          let imgBlob = that.convertBase64UrlToBlob(imgData);
          let tokenTimeName = new Date().getTime() + that.$store.state.token + '.' + imgBlob.type.split('/')[1];
          uploadImg(imgBlob,tokenTimeName).then(data =>{
            plus.nativeUI.toast('上传成功:' + data);
          }).catch(err =>{
            plus.nativeUI.toast(err);
          });
          that.listData.push(imgData);
          that.imgNameLst.push(tokenTimeName);
          let obj = {data: that.imgNameLst, id: id};
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
        let dataURL = canvas.toDataURL("image/jpg", 0.8);
        return dataURL
      },
      //删除图片预览Base64
      deletePic(index, id) {
        this.listData.splice(index, 1);
        this.lst.splice(index, 1);
        this.imgNameLst.splice(index,1);
        if (this.listData.length === 0) {
          this.$emit('deletFn', id)
        }
      },
      imgView(index) {
        plus.nativeUI.previewImage(this.lst, {current: index})
      },
      convertBase64UrlToBlob(urlData) {
        let arr = urlData.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type: mime})
      }
    },
  }
</script>

<style scoped>

</style>
