//主页

$(function(){


  //加载轮播图图片
  $.ajax({
    url:'data/homepage/banner.json',
    type:'GET',
    complete:function(res){
      //alert(2);
      //console.log(res);
    },

    success:function(res){
      //alert(1);  cs  wc
      //console.log(res);
      //调用执行函数，执行轮播图生成
      addBannerImg(res);
      bannerMove();
    },//success函数结束

    //检查错误信息
    error:function(response,status,xhr){
      //alert(3);
      //console.log(response,status,xhr);
    }

  });//ajax结束

  //加载四则展示广告的ajax
  $.ajax({
    url:'data/homepage/showd.json',
    type:'GET',
    complete:function(){
      //加载未完成时，用灰色天天果园图片代替
      $('.show_ad').find('li').find('img').attr({'src':'images/guanEmptyHome402x.png'});
    },

    //检查错误信息
    error:function(response,status,xhr){
      //alert(3);
      //console.log(response,status,xhr);
    },

    success:function(res){
      //console,显示;window.onerror=function(){return!0};  ->  代码中出现ad字样
      //alert(res);
      //console.log(res);   cs wc
      //调用加载函数
      showd(res);
    }//success结束

  });//加载四则展示广告的ajax结束

  //加载商品展示列表
  $.ajax({
    url:'data/homepage/fruit_kinds.json',
    type:'GET',

    //检查错误信息
    error:function(response,status,xhr){
      //alert(3);
      console.log(response,status,xhr);
    },

    complete:function(){
      //商品展示列表，加载未完成，或加载错误时，显示
      //errorShow($('.dOne').find('ul'));
    },

    //加载成功
    success:function(res){
      //console.log(res.recommend[0]);   cs  wc
      //为第一个商品展示   ->   果园推荐  插入数据
      succShow(res.recommend,$('.dOne').find('ul'));
      //console.log($('.dOne').find('ul'));
      succShow(res.fruit,$('.dTwo').find('ul'));
      succShow(res.fresh,$('.dThree').find('ul'));
      succShow(res.gift,$('.dFour').find('ul'));

      $('.good_list').on('mouseenter','img',function(){
        //console.log(1,"..");
        moveLarge($(this));
      });
      $('.good_list').on('mouseleave','img',function(){
        moveSmarll($(this));
      });


    }//success结束


  });//加载商品展示列表结束

  //加入购物车
  $.ajax({
    url:'data/shopping.json',
    type:'GET',
    success:function(res){
      //加入购物车
      $('.fruit_kinds').on('click','.good_che',function(){
        //获取id
        var id = $(this).parent().parent().attr('id');
        //添加到购物车
        addCookie(id,1);
        //console.log(id);
        //购物车小车数字改变
        goodCheChange();
        //遮罩层中的商品数，和总价变化
        zhezhaoChange(res);
        //打开遮罩
        $('#zhezhao').children('.zhezhao').css({'display':'block'}).siblings('.shop_cart').css({'display':'block'});
      });//加入购物车结束

      //遮罩层中的功能
      //点击继续购买
      $('#zhezhaoBox').on('click','.fr_buy a,.cha',function(){
        //加入购物车，并关闭遮罩
        goodCheChange();//购物车图标数字改变
        $('.zhezhao,.shop_cart').css({"display":'none'});
      });//点击继续购买按钮结束

      //购物车小车数字改变
      goodCheChange();

    }//success结束
  });//jiarugouwuchejieshu


});//$(function()结束



//加载轮播图图片
function addBannerImg(res){
  var html = '';
  for(var i=0; i<res.length; i++){
    html += '<li><a href="'+res[i][0]+'" target="_blank"><img src="'+res[i][1]+'" alt=""></a></li>';
  }
  $('.slidee').html(html);
}

//轮播图运动  ->   运动之前先生成
function bannerMove(){
  var timer,index=0;
  //获取li
  var $li = $('.slidee').children('li');
  //console.log($('body').width());  cs wc
  //设置ul  li  的宽度， li 等于浏览器可视区域宽度
  $li.css('width',$('body').width());
  $('.slidee').css('width',$('body').width()*$li.length);
  //生成轮播图下侧按钮,且为第一个按钮添加背景色
  for(var i=0; i<$li.length; i++){
    $('.slideeBtn').append($('<li></li>'));
  }
  $('.slideeBtn').children('li').eq(0).css('background','#64a131');

  //设置定时器，轮播图轮播
  timer = setInterval(function(){
    index = move(index,$li);
  }, 2000);

  //当鼠标划至轮播图上是，停止轮播，划出是启动轮播
  $('#banner').hover(function(){
    clearInterval(timer);
  },function(){
    clearInterval(timer);
    timer = setInterval(function(){
      index = move(index,$li);
    }, 2000);
  });

  //点击下侧按钮时，运动至对应图片
  $('.slideeBtn').on('click','li',function(){
    index = move($(this).index()-1, $li)
  });

}//轮播图运动函数结束

//轮播函数
function move(index,$li){

  if(index==$li.length-1){
    index=0;
  }else{
    index++;
  }
  //left 值变化
  $('.slidee').animate({left:-index*$li.width()});

  //图片对应按钮变色
  $('.slideeBtn').children('li').css('background','');
  $('.slideeBtn').children('li').eq(index).css('background','#64a131');

  //不是全局变量，所以需要将每次运动之后的index值返回，上一个函数接收
  return index;
}//轮播函数结束


//加载四则广告
function showd(res){
  //console.log(res[0][0],'..',res[0][1]);
  //获取li
  var $showdLi = $('.showd').find('li');

  //为每个li的a,img赋地址
  for(var i=0; i<$showdLi.length; i++){
    //console.log($showdLi.eq(i).children('a'));
    $showdLi.eq(i).find('a').attr({'href':res[i][0]});
    $showdLi.eq(i).find('img').attr({'src':res[i][1]});
  }

}//加载四则广告结束


//商品展示列表，加载未完成，或加载错误时，显示
function errorShow($obj){
  var html = '';
  for(var i=0; i<5; i++){
    html += '<li><div class="good_img"><a href="" title=""><img src="images/guanEmptyHome402x.png" alt="" class=""></a></div><div class="good_info"><strong><a href="" title="">商品</a></strong><span>价格</span><div class="good_che"></div></div></li>';
  }
  $obj.html(html);
}//商品展示列表，加载未完成，或加载错误时，显示  ->  函数结束


//加载成功，显示图片价格
function succShow($arr,$obj){
  //console.log($obj);   cs wc
  //两个参数分别为json文件中对应的数据（是一个数组），和需要插入的ul父元素
  var html = '';
  var id = '';
  for(var i=0; i<$arr.length; i++){
    id = $arr[i][3].substring($arr[i][3].indexOf('=')+1);
    html += '<li id="'+id+'"><div class="good_img"><a href="'+$arr[i][3]+'" title=""><img src="'+$arr[i][0]+'" alt="" class=""></a></div><div class="good_info"><strong><a href="'+$arr[i][3]+'" title="">'+$arr[i][1]+'</a></strong><span>'+$arr[i][2]+'</span><div class="good_che"></div></div></li>';
  }
  $obj.html(html);
}//加载成功，显示图片价格  ->  函数结束


//给图片加划入划出事件，划过图片变换大小
function moveLarge(obj){

    //console.log(1);
    obj.stop().animate({
      "width":"278px",
      "height":"278px",
      "marginTop":"-15px",
      "marginLeft":"-15px"

  });//给图片加划入划出事件，划过图片变换大小  结束
}
//给图片加划入划出事件，划过图片变换大小
function moveSmarll(obj){

    //console.log(1);
    obj.stop().animate({
      "width":"248px",
      "height":"248px",
      "marginTop":"0",
      "marginLeft":"0"

  });//给图片加划入划出事件，划过图片变换大小  结束
}


//cookies存储添加入购物车的信息
function addCookie(id,num){
  //console.log($.cookie('goods'));  //cs wc
  //获取cookie
  var cookieArr = eval($.cookie('goods'));
  //设置开关，cookie中是否有相同的商品
  var same = false;
  if(!cookieArr){
    //cookie中商品列表为空
    //alert(id);
    var str = '[{"id":"'+id+'","num":'+1+'}]';
    $.cookie('goods',str,{path:"/"});
    //console.log(eval(str));
  }else{
    //否则
    //console.log(cookieArr);
    //console.log($.cookie('goods'));
    //alert(cookieArr[0].id);
    for(var i=0; i<cookieArr.length; i++){
      if(cookieArr[i].id == id){
        cookieArr[i].num = ++cookieArr[i].num;
        str = JSON.stringify(cookieArr);//将json转化成字符串
        //alert(str);
        $.cookie('goods',str,{path:"/"});
        //如果有一样的，将开关状态改变
        same = true;
      }
    }
    //如果cookie中没有一样的id，则想后弹入一个
    if(!same){
      var obj = {"id":id,"num":1};
      cookieArr.push(obj);
      str = JSON.stringify(cookieArr);
      $.cookie('goods',str,{path:"/"});
    }
  }
  //alert($.cookie('goods'));
}//cookies存储添加入购物车的信息


//刷新页面，检索是否cookie是否存有购物车信息，若有，改变购物车图标上的数字
function goodCheChange(){
  var sum = 0;
  //获取cookie
  var cookieArr = eval($.cookie('goods'));
  if(cookieArr){
    for(var i=0; i<cookieArr.length; i++){
      //cookie中每条商品信息的数量，并全部相加
      sum += cookieArr[i].num;
    }
  }
  //alert(sum);
  //将数量添加到页面上部购物车图标处
  console.log($.cookie('goods'));
  $('.shoppingCart').find('span').text(sum);
}//改变购物车图标上的数字结束


//改变遮罩层的商品数量，和总价格
function zhezhaoChange(ress){
  var sum = 0;
  var priceSum = 0;
  var price = 0;
  //获取cookies
  var cookieArr = eval($.cookie('goods'));
  if(cookieArr){
    for(var i=0; i<cookieArr.length; i++){
      //cookie中每条商品信息的数量，并全部相加
      sum += cookieArr[i].num;
      //获取每个商品的单价
      price = ress[cookieArr[i].id]['skg']['skg1'][1].replace('￥','');
      priceSum += price * cookieArr[i].num;
    }
  }
  //总价格保留两位小数
  priceSum = changeTwoDecimal(priceSum);
  //alert(priceSum);
  //数量，价格填入遮罩
  $('#zhezhaoBox').find('.cartcount').text(sum);
  $('#zhezhaoBox').find('.cartprice').text('￥'+priceSum);
}//改变遮罩层的商品数量，和总价格结束

//输出价格保留两位小数
function changeTwoDecimal(x){
  //判断输入参数是否符合规则，能否执行
  var cx = parseFloat(x);
  if(isNaN(cx)){
    alert('function:changeTwoDecimal->parameter error');
    return false;
  }
  //四舍五入，当输入参数小数位数大于2时，保留两位小数
  var cx = Math.round(x*100)/100;
  var sx = cx.toString();
  //检索是否有小数点
  var pos_decimal = sx.indexOf('.');
  if(pos_decimal<0){
    pos_decimal = sx.length;
    sx += '.';
  }
  //为小数点后边增添0
  while(sx.length <= pos_decimal +2){
    sx += '0';
  }
  return sx;

}//保留两位小数结束
