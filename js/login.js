//登录页面


//登录页面
  //部分验证功能与注册页面相同，直接调用注册页面方法

$(function(){

  //网页加载，判断是否在cookie存有账号密码信息，若有，直接填写
  if($.cookie('user')){
    var userIDCookie = $.cookie('user').substring(0,$.cookie('user').indexOf(','));
    var passwordCookie = $.cookie('user').substring($.cookie('user').indexOf(',')+1)
    $('input[name=userID]').val(userIDCookie);
    $('input[name=password]').val(passwordCookie);
  }

  //点击登录按钮
  $('.login_btn').click(function(){
    //判断账号密码输入是否符合规则
    if(isTelSure && isPwdSure){
      //console.log(isTelSure,'..',isPwdSure);  cs wc

      //获取 账号密码
      var userID = $('input[name=userID]').val();
      var password = $('input[name=password]').val();
      //获取是否记住密码的checked属性的值
      var checkBoxVal = $('input[type=checkbox]').is(':checked');
      //console.log(checkBoxVal);  cs wc

      //账号登录
      $.ajax({
        url:"http://datainfo.duapp.com/shopdata/userinfo.php",
        type:"POST",
        data:{
          status:"login",
          userID:userID,
          password:password
        },
        success:function(res){
          //console.log(res);
          //判断账户的状态，或者服务器是否繁忙
          switch (res){
            case '0':
              $('#gdialog').find('.tips').text('账户不存在请重新输入');
              $('#gdialog').show(200);
              break;
            case '2':
              $('#gdialog').find('.tips').text('用户名或密码错误');
              $('#gdialog').show(200);
              break;
            default:
              if(checkBoxVal){
                //选中记住密码   cookie保存
                addCookieUser(userID,password);
              }else{
                addCookieUser(userID,'');
              }
              //跳转至首页额
              window.location.href = 'index.html';
          }//判断账户的状态，或者服务器是否繁忙结束

          //关闭弹窗
          $('.dialog').on('click','.close',function(){
            $('#gdialog').hide(200);
          });

        },//success结束

        error:function(xhr){
          console.log(xhr);
        }
      });//链接接口的ajax结束
    }//判断账号密码输入是否符合规则结束
  });//点击登录按钮结束


  //获取复选框是否选中  测试  cs wc
/*  $('input[type=checkbox]').click(function(){
    alert($(this).is(':checked'));
  })*/

});

//存储账号密码的cookie
function addCookieUser(user,password){
  //n表示传入的是0或1
  var cookieUserStr = '';
  var cookieUserObj;
  var isPush = true;
  //获取账号密码的cookie
  var cookieUser = eval($.cookie('cookieUser'));
  //判断是否存在cookieUser
  if(!cookieUser){
    //若没有，新填写cookie
    cookieUserStr = '[{"user":"'+user+'","password":"'+password+'","status":'+1+'}]';
  }else{
    //cookieUser已存在
    for(var i in cookieUser){
      //如果有相同的账户，则重新保存密码和状态
      if(cookieUser[i]['user']==user){
        cookieUser[i]['password'] = password;
        cookieUser[i]['status'] = 1;
        //改变开关状态
        isPush = false;
      }else{
        cookieUser[i]['status'] = 0;
      }
    }
    //如果没有相同的账户，往cookieUser后弹入一个新的账号密码
    if(isPush){
      cookieUserObj = {
        "user":user,
        "password":password,
        "status":1
      };
      cookieUser.push(cookieUserObj);
    }
    //判断cookieUser的长度，最多存3条消息
    if(cookieUser.length>3){
      //当超出3条的时候，删除第一条
      cookieUser.splice(0,1);
    }
    cookieUserStr = JSON.stringify(cookieUser);
  }//if-else结束
  //存入cookie
  $.cookie('cookieUser',cookieUserStr,{expires:2,path:"/"});

}//存储账号密码的cookie结束
