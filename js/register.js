//注册页面


//设置开关，全为true时开关打开
var isTelSure = false, isPwdSure = false, isPwdsSure = false, isCodeSure = false, isPCodeSure = false;
//声明定时器，倒计时结束时显示点击发送验证码  ->  倒计时60秒
var timer, count = 60;

/*模拟手机验证码*/
  //点击发送验证码时生成随机数  ->  当输入对应的数字时，手机验证码才能输入正确
var ranDom;
//手机验证码数组
var arrCode = ['3559', '1207', '0608', '0405', '1101', '2314', '1638', '7147', '8492', '1103'];

$(function(){

  //加载头尾
  $('#headerBox').load('data/commont.html #header');
  $('#footerBox').load('data/commont.html #footer');
  $('#broadside_buttonBox').load('data/commont.html #broadside_button', function(){
    //删除头部导航和搜索
    $('.navbar').remove();
    $('.navbar_right').remove();

  });


  //给li清楚浮动
  $('li').addClass('clearfix');

  //页面打开时默认输入手机号输入框获得焦点
  $('input[name=userID]').focus();

  //判断输入框
  $('ul').on('blur','input:not(.btn)',function(){
    var attrVal = $(this).attr('name');
    //alert(attrVal);  cs wc

    switch (attrVal){
      case 'userID':
        //当输入手机号框触发事件时
        isTelSure = telReg($(this).val());
        judge($(this),isTelSure);
        break;
      case 'password':
        //当密码框触发事件时
        isPwdSure = pwdReg($(this).val());
        judge($(this),isPwdSure);
        break;
      case 'passwordSure':
        //当确认密码输入框触发事件时
        var str1 = $(this).parent().prev().children('input').val();
        isPwdsSure = pwdSureReg($(this).val(),str1)
        //console.log(str1);
        judge($(this),isPwdsSure);
        break;
      case 'code':
        //当验证码输入框触发事件时
        isCodeSure = codeReg($(this).val());
        judge($(this),isCodeSure);
        break;
      case 'phoneCode':
        //手机验证码输入框触发事件时
        isPCodeSure = phoneCodeReg($(this).val());
        judge($(this),isPCodeSure);
    };

    //手机验证码框是否能输入
    isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure);
  });  //输入框判断结束

  //发送验证码是否能点击
    //发送点过之后隐藏，显示倒计时
  $('ul').find('div').on('click','.aSend',function(){
    //console.log(isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure));  cs wc
    //当手机验证码框可以输入时才能点击   isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure) == true
    if(isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure)){
      //alert(4);  cs wc

      //影藏点击按钮
      $(this).toggleClass('hide');
      //显示倒计时按钮
      $(this).next().toggleClass('hide');
      //开启定时器
      timer = setInterval(countDown,1000);
      //生成随机数
      ranDom = Math.round(Math.random()*10);
      console.log(arrCode[ranDom]);
    }

  });//发送验证码，倒计时，结束

  //点击注册按钮
    //只有当所有输入框输入正确时才能提交    ->   isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure) &&  isPCodeSure
  $('.btn').click(function(){
    checkUser();
  });

});

//验证电话号码
function telReg(str){
  var reg = /^1[3578][0-9]{9}$/g;
  return reg.test(str);
}

//验证密码   ->   6-20位号码字符    ->   必须出现数字和字母
function pwdReg(str){
  return /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z\.\_\%]{6,20}$/g.test(str);
}

//验证两次输入密码是否相同
function pwdSureReg(str,str1){
  return str == str1;
}

//验证验证码是否正确
function codeReg(str){
  return str =='1aaa';
}

//当输入框输入符合规则或不符合规则时产生的效果
function judge(obj,boole){
  //alert(3);  cs wc
  //console.log(boole);
  //判断传值为  true  或者  false
  if(boole == true){
    //当为true时红色隐藏，绿色显示
    obj.parent().children('span').eq(1).css('display','none');
    obj.parent().children('span').eq(0).css('display','block');
  }else{
    //当为false时红色显示，绿色隐藏
    obj.parent().children('span').eq(0).css('display','none');
    obj.parent().children('span').eq(1).css('display','block');
    isClick = false;
    //console.log(isClick,'..');
  }
};

//手机验证码属否能输入
function isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure){
  //console.log(isTelSure);  cs wc
  //当每个输入宽判定
  if(isTelSure && isPwdSure && isPwdsSure && isCodeSure){
    $('input[name=phoneCode]').removeAttr('disabled');
    return true;
  }else{
    $('input[name=phoneCode]').attr('disabled','');
    return false;
  }
}

//手机验证码
function phoneCodeReg(str){
  return str == arrCode[ranDom];
}

//倒计时，从60开始
function countDown(){
  count--;
  $('#timeout').text(count);
  if(count < 0){
    //当倒计时为0时，关闭定时器，并将计时器隐藏，发送验证码显示，  ->  count返回初始值
    clearInterval(timer);
    $('ul').find('div').children().eq(0).toggleClass('hide');
    $('ul').find('div').children().eq(1).toggleClass('hide');
    count = 60;
    $('#timeout').text(count);
  }
}

//提交表单函数
function checkUser(){
  if(isIntroduce(isTelSure,isPwdSure,isPwdsSure,isCodeSure) && isPCodeSure){
    //验证正确之后提交表单   ->   利用form表单的submit()事件触发提交，转至登录页面
    //$('form').submit();   抛弃

    var userID = $('input[name=userID]').val();
    var password = $('input[name=password]').val();

    $.ajax({
      url:"http://datainfo.duapp.com/shopdata/userinfo.php",
      type:"POST",
      data:{
        status:"register",
        userID:userID,
        password:password
      },
      success:function(res){
        switch(res){
          case "0":alert('用户名已存在，请重新输入');break;
          case "1":alert('注册成功，跳转至登录界面');window.location.href = 'login.html';break;
          case "2":alert('抱歉后端大哥炸了');break;

        }
      }
    });

    return true;
  }else{
    return false;
  }
}


//931673916@qq.com杨怀智qq
