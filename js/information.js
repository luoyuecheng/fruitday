// 详情页

$(function(){

  //ajax加载当前浏览的商品
  //获取当前页面的地址中的参数
  var thisId = window.location.toString();
  thisId = thisId.substring(thisId.indexOf('?')+1);
  thisId = thisId.substring(thisId.indexOf('=')+1);
  //将浏览的商品存入cookie
  lookHistoryCon(thisId);

  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(ress){
      //console.log(res);  cs wc

      //获取当前页面需要显示的商品
      res = ress[thisId];
      //console.log(thisId)
      //调用函数，插入图片等
      myShopFocus(res);

      //加载评论部分的添加购物车的内容
      addThefruit(res);

      //将最近浏览商品，添加到最近浏览
      lookHistoryList(ress);

      //刷新改变购物车图标上的数字
      goodCheChange();
      //点击确定，添加入购物车
      $('.thefruit').on('click','btn',function(){
        //alert(1);
        addCookie(thisId,1);
        goodCheChange();
        //关闭当前框
        $('.thefruit').css({"display":'none'});
        //遮罩层中的商品数，和总价变化
        zhezhaoChange(ress);
        //显示遮罩层
        $('.zhezhao,.shop_cart').css({"display":'block'});
      });

      //遮罩层中的功能
      //点击继续购买
      $('#zhezhaoBox').on('click','.fr_buy a,.cha',function(){
        //加入购物车，并关闭遮罩
        goodCheChange();//购物车图标数字改变
        $('.zhezhao,.shop_cart').css({"display":'none'});
      });//点击继续购买按钮结束

      //点击购物车主体右侧的立即购买和加入购物车
      //点击立即购买
      $('.it_buy').children('a').click(function(){
        //获取输入框中的数值
        var num = parseInt($('.goods_buy').children('input').val());
        //加入购物车
        addCookie(thisId, num);
        //改变购物车图标数字
        goodCheChange();
        //跳转到购物车页面
        window.location.href = 'cart.html';
      });//点击立即购买结束
      //点击加入购物车
      $('.it_add').children('a').click(function(){
        //获取输入框中的数字
        var num = parseInt($('.goods_buy').children('input').val());
        //加入购物车
        addCookie(thisId, num);
        //改变购物车图标数字
        goodCheChange();
        //遮罩层中的商品数，和总价变化
        zhezhaoChange(ress);
        //打开遮罩
        $('.zhezhao,.shop_cart').css({"display":'block'});
      });//点击加入购物车结束

    }//success结束
  });//ajax结束

  //详情图片轮播
  itLunbo();
  //放大镜功能
  $('.tuulBox').mousemove(function(event){
    //console.log(event.offsetX);  cs wc
    var evt = event || window.event;
    var left = evt.offsetX - $('.fdjsele').width()/2;
    var top = evt.offsetY - $('.fdjsele').height()/2;
    left = left<0 ? 0: left;
    top = top<0 ? 0 : top;
    left = left > ($('.tuulBox').width() - $('.fdjsele').width()) ? ($('.tuulBox').width() - $('.fdjsele').width()):left;
    top = top > ($('.tuulBox').height() - $('.fdjsele').height()) ? ($('.tuulBox').height() - $('.fdjsele').height()) : top;
    //灰色框的移动
    $('.fdjsele').css({'left':left+'px','top':top+'px'});
    //图片放大框变换
    var biliX = left / ($('.tuulBox').width() - $('.fdjsele').width());
    var biliY = top / ($('.tuulBox').height() - $('.fdjsele').height());
    leftTu = biliX * ($('.fdj').width()-$('.fdj').children('div').width());
    topTu = biliY * ($('.fdj').height()-$('.fdj').children('div').height());
    $('.fdj').children('div').css({'left':leftTu,'top':topTu});
  });
  //移入显示灰色框，即需要放大的区域
  $('.tuBox').mouseover(function(){
    $('.fdjsele').css("display","block");
    $('.fdj').css('display','block');
  });
  //移除隐藏灰色框
  $('.tuBox').mouseout(function(){
    $('.fdjsele').css("display","none");
    $('.fdj').css('display','none');
  });//放大镜功能结束


  //二维码放大功能
  $('.price_right').mouseenter(function(){
    $('.erweima').stop().toggle(200);
  });
  $('.price_right').mouseleave(function(){
    $('.erweima').stop().toggle(200);
  });


  //选择收货地址
  addrLook();
  //点击换收货地址
  $.ajax({
    url:'../data/hfFile/header.json',
    type:'GET',
    success:function(res){
      //console.log(res);
      //获取页面头部地址，插入到地址选择框中，初始地址为页面的初始地址
      var text = $('#header').find('.cityBox').children('a').children('span').text();
      $('.send').find('.select_addr').children('p').text(text);
      //console.log(text);

      res = res[0]['city'][1]['selected'];
      //加载收货地址
      addDizhi(res);

      //点击a标签对应功能实现
      $('.addr_list,.addr_list_area').on('click','a',function(){
        //alert(1);  cs wc
        //判断当前标签的父元素li是否有addr-id属性，若有，则表示有下级菜单
        if($(this).parent('li[addr-id]').length){
          //如有下级菜单，显示下级菜单
          var html = '';
          var addrId = $(this).parent().attr('addr-id');
          for(var keyAddr in res[addrId]){
            for(var i=0; i<res[addrId][keyAddr].length; i++){
              //console.log(res[addrId][keyAddr][i]);
              html += '<li data-pid="1"><a href="javascript:void(0)">'+res[addrId][keyAddr][i]+'</a></li>';
            }
          }
          //将地址数组插入到addr_list_area中的ul中
          $('.addr_list_area').children('ul').html(html);
          //三级菜单显示，二级菜单隐藏
          $('.addr_list').css({'display':'none'}).siblings('.addr_list_area').css({'display':'block'});
        }else{
          //将点击的地址输入到显示框
          $('.send').find('.select_addr').children('p').text($(this).text());
          //隐藏地址选择框，并将选择框还原会2级菜单
          $('.addr_menu').css({'display':'none'});
          $('.addr_list').css({'display':'block'}).siblings('.addr_list_area').css({'display':'none'});
        }//if-else结束

      });//点击a标签对应功能实现结束
    }
  });//点击换收货地址结束


  //购买数量选择，数量不能小于1
  $('.goods_buy').on('click','span',function(){
    var num = $(this).siblings('input').val();
    if($(this).index() == 0){
      if(num==1){
        num = 1;
      }else{
        num--;
      }
    }else{
      num++;
    }
    $(this).siblings('input').val(num);
  });
  //数量选择输入框 -> 当不为数字，或者小于1时，或者为小数时
  $('.goods_buy').children('input').keyup(function(event){
    var event = event || window.event;
    //console.log(typeof $(this).val());
    //console.log(event.keyCode);   //数字键键值  48-57
    var val = parseInt($(this).val());

    if(isNaN(val)){
      $(this).val(1);
    }else if(val == 0){
      $(this).val(1);
    }else{
      $(this).val(val);
    }
  });

  //评论简介交替显现
  $('.good_details').on('click','span',function(){
    //alert(1);
    $(this).toggleClass('show_details').siblings('span').toggleClass('show_details');
    $('.good_comments').children('ul').eq($(this).index()).css({'display':'block'}).siblings('ul').css({'display':'none'});
  });//评论简介交替显现 -> 结束

  //加入购物车按钮，点击弹出
  $('.good_details').children('a').click(function(event){
    //console.log(1);
    var event = event || window.event;
    if(this == event.target){
      $(this).children('.thefruit').toggle();
    }
  });// 加入购物车按钮，点击弹出 -> 结束

  //good_details栏的固定$('.good_details').get(0).offsetTop
  var isClone = false;

  $(document).scroll(function(){
    //获取其爹的爹的距离顶部和左侧的距离（有一个像素的边框的偏差）
    var goodDetailsLeft = $('.assess').get(0).offsetLeft+1;
    var goodDetailsTop = $('.assess')[0].offsetTop+1;
    var scrollTop = $(document).scrollTop();
    //console.log(goodDetailsTop);

    if(scrollTop > goodDetailsTop){
      $('.good_details').eq(0).css({'position':'fixed','top':'0','left':goodDetailsLeft,'display':'block'});
    }else{
      $('.good_details').eq(0).css({'position':'static'});
    }
  });//good_details栏的固定 -> 结束

  //评论上的翻页
  var fanyePage = 0;
  $('.btn_toolbar_main').on('click','.pagenum a',function(){
    $(this).addClass('cur').siblings().removeClass('cur');
    fanyePage = $(this).index();
    //console.log(fanyePage)
  });
  $('.btn_toolbar_main').on('click','.jq_first',function(){
    $(this).siblings('.pagenum').children('a').eq(0).addClass('cur').siblings().removeClass('cur');
    fanyePage = 0;
  });
  $('.btn_toolbar_main').on('click','.jq_last',function(){
    $(this).siblings('.pagenum').children('a').eq(2).addClass('cur').siblings().removeClass('cur');
    fanyePage = 2;
  });
  $('.btn_toolbar_main').on('click','.last a',function(){
    if(fanyePage==0){
      fanyePage = 2;
    }else{
      fanyePage--;
    }
    $(this).parent().siblings('.pagenum').children('a').eq(fanyePage).addClass('cur').siblings().removeClass('cur');
  });
  $('.btn_toolbar_main').on('click','.next a',function(){
    if(fanyePage==2){
      fanyePage = 0;
    }else{
      fanyePage++;
    }
    $(this).parent().siblings('.pagenum').children('a').eq(fanyePage).addClass('cur').siblings().removeClass('cur');
  });

  //
  $('.detail_user_title').on('click','li',function(){
    $(this).addClass('now_gray').siblings().removeClass('now_gray');
  })


});//$(function)结束


//详情图片轮播函数
function itLunbo(){
  var index = 0;
  var itTimer;
  itTimer = setInterval(function(){
    index = itMove(index);
  },3000);

  //划入停止定时器
  $('.dianul,.tuulBox').hover(function(){
    clearInterval(itTimer);
  },function(){
    clearInterval(itTimer);
    itTimer = setInterval(function(){
      index = itMove(index);
    },3000);
  });

  //点击查看对应图片
  $('.dianul').on('mouseenter','li',function(){
    clearInterval(itTimer);
    index = itMove($(this).index()-1);
  });
}//详情图片轮播函数 -> 结束

// 图片轮播，运动函数
function itMove(index){
  if(index == $('.tuul').children('li').length-1){
    index = 0;
  }else{
    index++;
  }
  //放大镜中的图片的切换
  $('.fdj').children('div').html($('.tuul').children('li').eq(index).children('img').clone());
  //左侧图片列表外层的切换
  $('.hsc').css('top',index*(138+2));

  //轮播图中的图片的切换
  $('.tuul').children('li').eq(index).fadeIn().siblings().fadeOut();
  return index;
}// 图片轮播，运动函数 -> 结束


//选择地址框的出现和隐藏
function addrLook(){
  var addrLookTimer;
  //划入显示的地址框。选择框显示
  $('.select_addr').mouseenter(function(){
    clearTimeout(addrLookTimer);
    $('.addr_menu').css('display','block');
  });
  //滑入选择框，选择框不隐藏
  $('.addr_menu').mouseenter(function(){
    clearTimeout(addrLookTimer);
    $(this).css('display','block');
  });
  //滑出显示的地址框。选择框延迟隐藏
  $('.select_addr').mouseleave(function(){
    clearTimeout(addrLookTimer);
    addrLookTimer = setTimeout(function(){
      $('.addr_menu').css('display','none');
      $('.addr_list').css({'display':'block'}).siblings('.addr_list_area').css({'display':'none'});
      //alert(2);
    },1000);
  });
  //滑出选择框，选择框延迟隐藏
  $('.addr_menu').mouseleave(function(){
    clearTimeout(addrLookTimer);
    addrLookTimer = setTimeout(function(){
      $('.addr_menu').css('display','none');
      $('.addr_list').css({'display':'block'}).siblings('.addr_list_area').css({'display':'none'});
      //alert(1);
    },1000);
  });
  //点击删除按钮，关闭选择框
  $('.delet').click(function(){
    clearTimeout(addrLookTimer);
    $('.addr_menu').css('display','none');
    $('.addr_list').css({'display':'block'}).siblings('.addr_list_area').css({'display':'none'});
  });
}//选择地址框的出现和隐藏结束



//将获取的参数插入到页面
function myShopFocus(res){

  //标题信息
  $('.bread').children('span').eq(1).text(res['name']);

  //插入图片
  var html = '';
  for(var i=0; i<res['img_it_Li'].length; i++){
    html += '<li><img src="'+res['img_it_Li'][i]+'">';
    //console.log(res['img_it_Li'][i]);
  }
  //将图片插入详情图片列表
  $('.myFocus').find('.dianul').html(html);
  //将图片插入大图轮播
  $('.myFocus').find('.tuul').html(html);
  //初始化放大镜，第一张图片为显示的第一张图片
  $('.myFocus').find('.fdj').find('img').attr({'src':res['img_it_Li'][0]});

  //生产地的加载
  html = '<div class="guoqi"></div><div class="name"><h3>'+res['name']+'</h3><p>'+res['describe']+'</p></div>';
  $('.product_detail').find('.country').html(html);

  //单价的加载
  if(res['skg']['skg1'].length>2){
    var span = '<span>'+res['skg']['skg1'][2]+'</span>';
  }else{
    span = '';
  }
  html = '<h5>果园价</h5><strong>'+res['skg']['skg1'][1]+'</strong>'+span;
  $('.price_info').find('.price_left').html(html);

  //规格的加载
  html = '';
  for(var keySkg in res['skg']){
    html += '<span>'+res['skg'][keySkg][0]+'</span>';
  }
  $('.product_detail').children('.guige').find('.zhuang').html(html);

}//将获取的参数插入到页面结束



//加载收货地址
function addDizhi(res){
  var html = '';

  for(var i=0; i<res.length; i++){
    if(typeof res[i] != 'object'){
      //如果不是对象，则其下没有三级菜单
      html += '<li><a href="javascript:void(0)">'+res[i]+'</a></li>';
    }else{
      //否则有三级菜单，并获取键值
      for(var keyAddr in res[i]){
        html += '<li addr-id="'+i+'"><a href="javascript:void(0)">'+keyAddr+'</a></li>';
      }
    }
  }
  $('.addr_list').children('ul').html(html);
}//加载收货地址结束



//加载评论部分的添加购物车的内容
function addThefruit(res){

  var html = '<dl class="clearfix"><dt><img src="'+res['img_pag']+'"></dt><dd><h5>'+res['name']+'</h5><p>'+res['skg']['skg1'][1]+' / '+res['skg']['skg1'][0]+'</p><btn>确认</btn></dd></dl>';
  $('.thefruit').html(html);

}//加载评论部分的添加购物车的内容结束


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
    var str = '[{"id":"'+id+'","num":'+num+'}]';
    $.cookie('goods',str,{path:'/'});
    //console.log(eval(str));
  }else{
    //否则
    //console.log(cookieArr);
    //console.log($.cookie('goods'));
    //alert(cookieArr[0].id);
    for(var i=0; i<cookieArr.length; i++){
      if(cookieArr[i].id == id){
        cookieArr[i].num = cookieArr[i].num + num;
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
}


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


//将浏览过的商品存入cookie最近浏览
function lookHistoryCon(id){
  var lookHistory = eval($.cookie('lookHistory'));
  if(!lookHistory){
    lookHistory = [id];
  }else{
    for(var i=0; i<lookHistory.length; i++){
      if(id==lookHistory[i]){
        break;
      }
    }
    if(i==lookHistory.length){
      lookHistory.push(id);
    }
  }
  $.cookie('lookHistory',JSON.stringify(lookHistory),{path:'/'});
}//将浏览过的商品存入cookie最近浏览

// 将最近浏览放入最近浏览列表
function lookHistoryList(ress){
  var lookHistory = eval($.cookie('lookHistory'));
  var html = '';
  var s = '';
  for(var key in lookHistory){
    if(ress[lookHistory[key]]['skg']['skg1'][2]){
      s = ress[lookHistory[key]]['skg']['skg1'][2];
    }
    html += '<li><a href="information.html?id='+lookHistory[key]+'" target="_blank" title="'+ress[lookHistory[key]].name+'"><div class="zj_through_left"><img src="'+ress[lookHistory[key]].img_pag+'" alt=""></div><div class="zj_through_right"><h5>'+ress[lookHistory[key]].name+'</h5><p>'+ress[lookHistory[key]]['skg']['skg1'][1]+' / '+ress[lookHistory[key]]['skg']['skg1'][0]+'</p><s>'+s+'</s></div></a></li>';
  }
  $('.assess').children('.rightpart').children('ul').html(html);
}
