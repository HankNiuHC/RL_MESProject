<template>
  <v-container>
    <v-card
      class="mx-auto"
      max-width="344"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">手电筒</v-list-item-title>
          <v-list-item-subtitle>应急使用，请勿长时间打开手电筒</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
          tile
          size="80"
        >
          <v-icon large>mdi-flashlight</v-icon>
        </v-list-item-avatar>
      </v-list-item>
      <v-card-actions>
        <v-switch v-model="switch1"></v-switch>
      </v-card-actions>
    </v-card>
    <v-card
      class="mx-auto mt-2"
      max-width="344"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">查询设备清洗记录</v-list-item-title>
          <v-list-item-subtitle>请扫描设备条形码/二维码</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
          tile
          size="80"
        >
          <v-icon large>mdi-hand-wash-outline</v-icon>
        </v-list-item-avatar>
      </v-list-item>
      <v-card-actions>
        <v-btn text @click="func">
          <v-icon>mdi-qrcode-scan</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

</template>


<script>
  import torch from '../utils/torch'

  export default {
    name: "Tools",
    data: () => ({
      switch1: false
    }),
    watch: {
      switch1(newName) {
        if (newName === true) {
          torch.on();
        } else if (newName === false) {
          torch.off();
        }
      }
    },
    beforeDestroy() {
      torch.off();
      plus.device.setWakelock(false)
    },
    destroyed(){
      torch.off()
    },
    created() {
      plus.device.setWakelock(true)
    },
    methods:{
      func(){
        plus.nativeUI.alert("建设中...")
      }
    }
  }
</script>

