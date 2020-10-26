import axios from './axios'
import store from '@/store/index'
import router from '@/router/index'

//需要Token
export function httpWithToken(obj) {
  let parms = new URLSearchParams();
  let token = store.state.token || "";
  let val = {"Token": token};
  let i;
  for (i in obj) {
    val[i] = obj[i]
  }
  parms.append('json', JSON.stringify(val));
  return axios.request({
    url: 'http://192.168.3.217/WebService.asmx/execute',
    method: 'post',
    data: parms
  })
}

//不需要token
export function httpNoToken(obj) {
  let parms = new URLSearchParams();
  let val = new Object();
  let i;
  for (i in obj) {
    val[i] = obj[i]
  }
  parms.append('json', JSON.stringify(val));
  return axios.request({
    url: 'http://192.168.3.217/WebService.asmx/execute',
    method: 'post',
    data: parms
  })
}

//验证 token验证失败跳转登陆后跳转回来
export function statusNoToken() {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}


//登录接口
export function Login(userid, password) {
  let obj = {"UserId": userid, "Password": password, "Type": "UserLogin"};
  return httpNoToken(obj);
}

//获取第一次待办任务接口
export function getAllPendingTask() {
  let obj = {"Type": "getAllPendingTask"};
  return httpWithToken(obj)
}

//获取釜次待办任务-ALL
export function getAllPendingTaskKettle(Id) {
  let obj = {"Type": "getAllPendingTask", "CaldronNum": Id};
  return httpWithToken(obj)
}

//获取釜次工序待办任务-ALL
export function getAllPendingProcessTask(id, process) {
  let obj = {"Type": "getAllPendingTask", "CaldronNum": id, "RouteOprId": process};
  return httpWithToken(obj)
}

//获取釜次待办任务-MY
export function getAllMyPendingTaskKettle(Id) {
  let obj = {"Type": "getAllMyPendingTask", "CaldronNum": Id};
  return httpWithToken(obj)
}

//获取釜次工序待办任务-My
export function getAllMyPendingProcessTask(id, process) {
  let obj = {"Type": "getAllMyPendingTask", "CaldronNum": id, "RouteOprId": process};
  return httpWithToken(obj)
}

//获取数据验证项
export function getDataVerification(id) {
  let obj = {"Type": "getOprParm", "RouteOprAction": id};
  return httpWithToken(obj)
}

//回传数据验证项
export function setOprParm(data,id) {
  let obj = {"Type": "setOprParm", "RouteOprActionParm": data,"RouteOprAction":id};
  return httpWithToken(obj)
}

//获取班次员工
export function getStaff() {
  let obj = {"Type": "getDistributableWorkers"};
  return httpWithToken(obj)
}

//获取二级分发任务
export function getPending() {
  let obj = {"Type": "getMyPendingTask"};
  return httpWithToken(obj)
}

//提交二级分发数据
export function taskAssign(UserID, TaskList) {
  let obj = {"Type": "taskAssign", "UserID": UserID, "TaskList": TaskList};
  return httpWithToken(obj)
}

//获取移交任务数据
export function getMyTansferTask() {
  let obj = {"Type": "getMyTansferTask"};
  return httpWithToken(obj)
}

export async function uploadImg(data, name) {
  return new Promise((resolve, reject) => {
    let params = new FormData();
    params.append("file", data, name);
    axios.post('http://192.168.3.217:88/singleUpload', params).then(res =>{
      resolve(res.data)
    }).catch(err =>{
      reject(err.data)
    })
  })
}

//回传计时器开始时间
export function startOprActionParm(id) {
  let obj = {"Type":"startOprActionParm","RouteOprActionParm": id};
  return httpWithToken(obj)
}

//回传计时器结束时间
export function endOprActionParm(id) {
  let obj = {"Type":"endOprActionParm","RouteOprActionParm": id};
  return httpWithToken(obj)
}

//获取环境配置
export function getInstance() {
  let obj = {"Type":"getInstance"};
  return httpNoToken(obj)
}

//获取APP版本
export function getVersion() {
  let obj = {"Type":"getVersion"};
  return httpNoToken(obj)
}

