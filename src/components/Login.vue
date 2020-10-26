<template>
  <v-layout align-center justify-center class="mt-12 mx-2">
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="blue darken-3" dense>
          <v-toolbar-title>登录</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-icon="mdi-account"
              name="name"
              label="用户名"
              id="name"
              type="text"
              v-model="name"
              :error-messages="nameErrors"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            ></v-text-field>
            <v-text-field
              prepend-icon="mdi-lock"
              name="password"
              label="密码"
              id="password"
              type="password"
              v-model="password"
              :error-messages="passwordErrors"
              required
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark text color="grey darken-3" @click="goBack">取消</v-btn>
          <v-btn dark color="blue darken-3" @click="toLogin">登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import {numeric} from 'vuelidate/lib/validators'
  import {Login} from '../utils/api'

  export default {
    name:'login',
    mixins: [validationMixin],

    validations: {
      name: {required, numeric},//工号验证：纯数值
      password: {required}
    },
    data() {
      return {
        name: '',
        password: ''
      }
    },
    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.name.$dirty) return errors;
        !this.$v.name.required && errors.push('用户名不能为空');
        !this.$v.name.numeric && errors.push('用户名为工号！');
        return errors
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) return errors;
        !this.$v.password.required && errors.push('密码不能为空');
        return errors
      }
    },
    methods: {
      toLogin() {
        this.$v.$touch();
        if (this.$v.name.numeric && this.$v.name.required && this.$v.password.required) {
          let username = this.name;
          let pwd = this.password;
          let that = this;
          let hashPwd = this.getmd5(username, pwd);
          Login(username, hashPwd).then(data => {
            if (data.status === 200) {
              let res = that.transXml(data);
              if (res.Code === 1000) {
                let token = res.Token;
                let role = res.Role;
                let name = res.Name;
                let factory = res.Factory;
                let department = res.Department;
                let workshop = res.Workshop;
                this.$store.commit('login_method', {token, role, name, factory, department, workshop});
                let hostname = this.$route.query.redirect;
                if (hostname) {
                  this.$router.push(hostname)
                } else {
                  this.$router.push('/')
                }
              } else if (res.Code === 1001) {
                this.$message.bottom().timeout(-1).show('非法操作-不能为空')
              } else if (res.Code === 1002) {
                this.$message.bottom().timeout(3000).show('账号或密码错误')
              } else {
                this.$message.bottom().timeout(3000).show('登录失败')
              }
            }
          })
        }
      },
      goBack() {
        this.$router.go(-1)
      },
      //MD5 账号加密码加密
      getmd5(username, pwd) {
        let userpwd = username + pwd;
        let crypto = require('crypto');
        let md5 = crypto.createHash('md5');
        let res = md5.update(userpwd).digest('hex');
        return res
      },
    },
  }
</script>

