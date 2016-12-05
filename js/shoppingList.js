//商品列表页

$(function(){
  //定义res_shopping,在加载商品列表中赋值，使点击类别列表时能试用
  var res_shopping;

  //加载水果选择分类
  $.ajax({
    url:'../data/shoppingList/fenlei.json',
    type:'GET',
    success:function(res){
      //console.log(res);  //cs wc
      //加载分类列表
      fenLei(res);

      //点击类别，选中并改变样式，去除其他类别样式
      $('.fl_list').on('click','span',function(){
        //点击改变样式
        gbYangshi($(this));
        if($(this).parent().is('.fl_left')){
          //如果点击的“全部”按钮，则加载全部
          fenLei(res);
          gbYangshi($(this).parents('.fl').siblings().find('.fl_left').children('span'));
          //加载全部商品
          spList(res_shopping);
        }else if($(this).parent().is('.fl_right') && $(this).parents('.fl').is('.pl,.cd')){
          //如果点击的是具体类别，则移除其兄弟结点，且另一个分类中相应改变
          $(this).siblings().remove();
          var html = '';
          var keyWord = $(this).children('a').text();
          if($(this).parents('.fl').hasClass('pl')){
            //如果点击的是.pl
            for(var key in res){
              for(var i=0; i<res[key].length; i++){
                if(res[key][i]==keyWord){
                  html += '<span><a href="javascript:void(0)" title="">'+key+'</a></span>';
                }
              }
            }
            $('.cd').find('.fl_right').html(html);
            //加载对应的商品
            bfspList(res_shopping,keyWord,'type');
          }else if($(this).parents('.fl').hasClass('cd')){
            //如果点击的是.cd
            for(var i=0; i<res[keyWord].length; i++){
              html += '<span><a href="javascript:void(0)" title="">'+res[keyWord][i]+'</a></span>';
            }
            $('.pl').find('.fl_right').html(html);
            //加载对应的商品
            bfspList(res_shopping,keyWord,'producing_area');
          }
        }
      });

    },//success结束

    error:function(response,status,xhr){

    },//error结束

    complete:function(){
      //alert(2);
      //console.log(res);
    }//complete结束

 });//加载水果选择分类  结束


  //加载水果列表
  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(res){
      res_shopping = res;
      //console.log(res_shopping);  //cs wc
      spList(res);
      //加载最近浏览到最近浏览
      lookHistoryList(res);
    },
    error:function(response,status,xhr){
      //console.log(status)
    }//error结束
  });//加载水果列表结束


  //点击不同的规格，显示不同的价格
  $('.sl_left').on('click','.p_operatte span',function(){
    //console.log($(this).index());  cs wc
    //获取点击的水果的id
    var thisId = $(this).siblings('.good_che').attr('id');
    //获取当前span的index()
    var index = $(this).index();
    //改变span的样式，需显示的外边加边框，否则不加
    $(this).addClass('cur').siblings('span').removeClass('cur');
    //改变显示的价格
    $(this).parent().prev().children('.s_price').text(res_shopping[thisId]['skg']['skg'+(index+1)][1]);
  });


  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(res){

      //添加购物车
      $('.shoppingList').on('click','.good_che',function(){
        //alert(2); cs wc
        //打开遮罩
        zhezhaoChange(res)
        $('.zhezhao,.shop_cart').css({'display':'block'});
        $(this).stop().animate({
          'backgroundPositionX':'-514px',
          'backgroundPositionY':'-291px'
        });
        //用cookies记录
        addCookie(this.id,1);

      });//添加购物车结束

      //关闭购物车遮罩
      $('.cha').click(function(){
        //关闭遮罩和框
        zhezhaoChe();
        //改变购物车图标显示的购物车商品数量
        goodCheChange();
      });
    }
  });

  //刷新页面，检索是否cookie是否存有购物车信息，若有，改变购物车图标上的数字
  //利用ajax异步性，在头部加载出来之后逐步执行ajax，改变值
  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(res){
      goodCheChange();

      //点击继续购物按钮，关闭遮罩和购物车确认框
      //点击继续购物按钮，改变购物车图标上的数字
      $('.shop_cart').find('.fr_buy').children('a').click(function(){
        zhezhaoChe();
        goodCheChange();
      });

    }
  });//改变购物车图标上的数字结束


});// $(function)结束


//添加产品分类，选择函数
function fenLei(res){
  //console.log(res);  cs wc
  //console.log(obj);

  var htmlPl = '', htmlCd = '';
  for(var key in res){
    htmlCd += '<span><a href="javascript:void(0)" title="">'+key+'</a></span>';
    for(var i=0; i<res[key].length; i++){
      htmlPl += '<span><a href="javascript:void(0)" title="">'+res[key][i]+'</a></span>';
    }
  }
  $('.pl').find('.fl_right').html(htmlPl);
  $('.cd').find('.fl_right').html(htmlCd);

}//添加产品分类，选择函数结束


//改变样式，并给其他类别去除样式
function gbYangshi($this){
  //找到当前分类的所有类别的共同父元素
  var $parent = $this.parent().parent();
  //移除样式  ->   移除class
  $parent.find('span').removeClass('active');
  //给当前添加样式  ->  添加class属性
  $this.addClass('active');
}


//获取信息总条数
function jsPage(res){
  //获取json中分组数
  var sumArr = [];
  for(var key in res){
    for(var j=0; j<res[key].length; j++){
      sumArr.push(res[key][j]);
    }
  }
  //将总数返回
  return sumArr;
}//获取信息总条数结束


//商品列表
function spList(res){
  //console.log(sumArr);  cs wc
  var html = '', span = '', snew = '';
  var n = 0;
  for(var key in res){
    n++;
    if(res[key]['skg']["skg2"]){
      //加载第二类购买规格
      span = '<span>'+res[key]['skg']["skg2"][0]+'</span>';
    }
    if(res[key]["remark"]){
      //判读是否是新品，是则加载
      snew = '<span class="new">'+res[key]["remark"]+'</span>';
    }
    html += '<li><div class="wrap"><div class="s_img"><a href="information.html?id='+key+'" target="_blank"><img src="'+res[key].img_pag+'" alt=""></a></div><div class="s_info clearfix">'+snew+'<strong> <a href="information.html?id='+key+'" title="">'+res[key].name+'</a></strong><span class="s_price">'+res[key]['skg']["skg1"][1]+'</span></div><div class="p_operatte clearfix"><span class="cur">'+res[key]['skg']["skg1"][0]+'</span>'+span+'<div class="good_che" id="'+key+'"></div></div></div></li>';
    span = '';
    snew = '';
  }
  $('.sl_left').children('ul').html(html);

}//商品列表结束


//部分商品列表，显示点击的对应的商品列表
function bfspList(res,keyWord,style){
  var html = '', span = '', snew = '';
  for(var key in res){
    if(res[key][style]==keyWord){
      if(res[key]['skg']["skg2"]){
        //加载第二类购买规格
        span = '<span>'+res[key]['skg']["skg2"][0]+'</span>';
      }
      if(res[key]["remark"]){
        //判读是否是新品，是则加载
        snew = '<span class="new">'+res[key]["remark"]+'</span>';
      }
      html += '<li><div class="wrap"><div class="s_img"><a href="information.html?id='+key+'" target="_blank"><img src="'+res[key].img_pag+'" alt=""></a></div><div class="s_info clearfix">'+snew+'<strong> <a href="information.html?id='+key+'" title="">'+res[key].name+'</a></strong><span class="s_price">'+res[key]['skg']["skg1"][1]+'</span></div><div class="p_operatte clearfix"><span class="cur">'+res[key]['skg']["skg1"][0]+'</span>'+span+'<div class="good_che" id="'+key+'"></div></div></div></li>';
      span = '';
      snew = '';
    }
  }
  $('.sl_left').children('ul').html(html);
}//部分商品列表，显示点击的对应的商品列表结束


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
  $('.shoppingCart').find('span').text(sum);
}//改变购物车图标上的数字结束


//关闭购物车确认提示框和购物车遮罩
function zhezhaoChe(){
  //关闭遮罩和购物车确认框
  $('.zhezhao,.shop_cart').css({'display':'none'});
  //之前所点击的商品列表中，商品下的加入购物车按钮购物车背景图改变
  $('.good_che').stop().animate({
    'backgroundPositionX':'-517px',
    'backgroundPositionY':'-243px'
  });
}


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
  $('.shoppingList').children('.sl_right').children('ul').html(html);
}// 将最近浏览放入最近浏览列表
