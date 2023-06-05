import Mock, { mock } from 'mockjs'
import Axios from 'axios'

// 模拟延迟
// Mock.setup({
//     timeout:500
// })

Mock.mock("/mock/login",'post',  function(props) {
var admin = {
    username:'admin',
    password:'c4ca4238a0b923820dcc509a6f75849b'}
var admin1 = {
    username:'admin1',
    password:'c4ca4238a0b923820dcc509a6f75849b'}
  var data = JSON.parse(props.body);
  console.log(data);
  if(data.username == admin.username && data.password == admin.password){
        return  require('./json/equipment/login.json');
  }else if(data.username == admin1.username && data.password == admin.password){
        return  require('./json/equipment/login1.json');
  } else{
        return {success:false,msg:'请输入正确的用户名或密码！'}
  }
//   var interval = data.interval;
//   var value = data.chartype;

})


Mock.mock("/mock/menuTess",'post',  function(props) {
    var admin = 'fa18c52981606ff872097d3118dac83c';
    var admin1 = '5b63abb4fc706cc5d7da8b4d3b50d15a';
    var data = JSON.parse(props.body);
        console.log(data);
    if(data.token == admin  ){
        return  require('./json/equipment/menuTree.json');
    }else if(data.token == admin1  ){
        return  require('./json/equipment/menuTree1.json');
    } else{
        return {success:false,msg:'请输入正确的用户名或密码！'}
    }
    
  })