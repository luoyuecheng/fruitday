//购物车页面

$(function(){

  $.ajax({
    url:'',
    type:'GET',
    success:function(){
      //删除公有文件中加载的头部多余部分
      $('.logNavContent').children('.navbar,.nav,.navbar_right').remove();
      //添加新的板块
      var html = '<div class="collapse navbar_collapse"><ul class="icons_cart clearfix pull-right"><li class="pull-left li1 cur"><span>1</span><p>我的购物车</p></li><li class="pull-left li2"><span>2</span><p>确认订单信息</p></li><li class="pull-left li3"><span>3</span><p>成功提交订单</p></li></ul></div>';
      $('.logNavContent').append(html);
    }
  });


  //加载购物车物品
  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(res){
      //console.log(res);
      //获取cookie的存的值，并填入购物车列表
      addChe(res);

      //加载最近浏览历史
      lookHistoryList(res);

      //商品数量左右两边的增加减少按钮
      //左边按钮减少，并最小为1
      $('.list_unstyled').on('click','.goods_buy_left',function(){
        //获取商品数量
        var num = $(this).siblings('input').val();
        //获取当前商品单价 -> 单价现为带￥符号的字符串
        var price = $(this).parent().prev().children().text();
        //获取当前商品id
        var thisId = $(this).parent().parent().parent('li').attr('id');
        if(num > 1){
          $(this).siblings('input').val(--num);
        }
        //计算商品总价格，并填入原价
        changePriceSun(thisId,price,num);
        //遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
        allSeleShopping();
      });
      //右边按钮增加，最大值为..
      $('.list_unstyled').on('click','.goods_buy_right',function(){
        //获取商品数量
        var num = $(this).siblings('input').val();
        //获取当前商品单价 -> 单价现为带￥符号的字符串
        var price = $(this).parent().prev().children().text();
        //获取当前商品id
        var thisId = $(this).parent().parent().parent('li').attr('id');
        if(num){
          $(this).siblings('input').val(++num);
        }
        //计算商品总价格，并填入原价
        changePriceSun(thisId,price,num);
        //遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
        allSeleShopping();
      });
      //商品数量左右两边的增加减少按钮 -> 结束

      //删除标签
      $('.list_unstyled').on('click','.delete p a',function(){
        //打开确认删除框
        $('#p_dialog').css({'display':'block'});
        //获取当前商品的id
        var thisId = $(this).parent().parent().parent().parent('li').attr('id');

        //确认删除，或取消删除
        $('.btn_success').click(function(){
          //删除当前商品在cookie中的记录
          removeThisCookie(thisId);
          //重新加载商品列表
          addChe(res);
          //遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
          allSeleShopping();
          $('#p_dialog').css({'display':'none'});

        });//确认删除结束

        $('.btn_default,.dialog h5 span').click(function(){
          $('#p_dialog').css({'display':'none'});
        });//取消按钮，关闭按钮结束

      });//删除标签结束

      //点击全选按钮
      $('.cartmain').on('click','.seleAll',function(){
        //alert(1)
        //判断是否选中，若选中，则p标签有select的class值
        if($(this).hasClass('select')){
          //移除，select，取消选择
          $('.seleAll').removeClass('select');
          //取消商品列表的选择
          $('.list_unstyled').find('.checkP').removeClass('select');
        }else{
          $('.seleAll').addClass('select');
          $('.list_unstyled').find('.checkP').addClass('select');
        }
        //遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
        allSeleShopping();
      });//点击全选按钮结束

      //点击商品列表中各自的选择按钮
      $('.list_unstyled').on('click','.checkP',function(){
        //alert($(this).parent().parent().parent().attr('id'));
        //开关，是否给全选按钮选中
        var isSele = true;
        //判断是否已被选中
        if($(this).hasClass('select')){
          //若已选中，则取消选中
          $(this).removeClass('select');
          //检查，全选按钮是否选中，若选中，取消全选按钮的选中
          if($('.seleAll').hasClass('select')){
            $('.seleAll').removeClass('select');
          }
        }else{
          //若没有选中，则选中此商品
          $(this).addClass('select');
          //检查列表中的所有商品中是否都被选中，若都选中，则选中全选按钮
          for(var i=0; i<$('.list_unstyled').children('li').length; i++){
            if(!$('.list_unstyled').children('li').eq(i).find('.checkP').hasClass('select')){
              isSele = false;
            }
          }
          //选中全选按钮
          if(isSele){
            $('.seleAll').addClass('select');
          }
        }//if-else结束
        //遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
        allSeleShopping();
      });//点击商品列表中各自的选择按钮结束


      //点击最近浏览或可能感兴趣商品，显示对应条目
      $('.scrollbar').find('li').click(function(){
        //改变当前li的样式，和其兄弟的样式
        $(this).addClass('looked').siblings('li').removeClass('looked');
        //改变所要显示的项
        $('.look_history_con').children('.wrap').eq($(this).index()).css('display','block').siblings('.wrap').css('display','none');
      });//点击最近浏览或可能感兴趣商品，显示对应条目结束


      //点击结算付款
      $('.go_pay').click(function(){
        //获取前面选择的商品数
        var num = parseInt($(this).siblings('.goodsSelect').children('em').text());
        //判断有没有选中商品，若商品数量为0，无法跳转
        if(!num){
          $('#p_warning').css({'display':'block'});
        }else{
          //console.log(eval($.cookie('payDesk'))[0].id)
          window.location.href = 'order.html';
        }
      });//点击结算付款结束
      $('.warning_btn_success,.warning h5 span').click(function(){
        $('#p_warning').css({'display':'none'});
      });
      //点击是否能付款结束

    }//success结束
  });//ajax结束


});//$(function)结束


//获取cookie的存的值，并填入购物车列表
function addChe(res){
  //获取cookie,并转为jaon
  var cookieArr = eval($.cookie('goods'));
  //字符串拼接，填入购物车列表
  var html = '';
  var price = 0;
  var priceSum = 0;
  for(var i=0; i<cookieArr.length; i++){
    //获取得到的cookie中的商品的单价，并非数字字符
    price = res[cookieArr[i].id]['skg']['skg1'][1].replace('￥','');
    //计算总价格
    priceSum = changeTwoDecimal(price)*cookieArr[i].num;
    //总价格保留整数位
    priceSum = Math.floor(priceSum);
    //字符串拼接
    html += '<li id="'+cookieArr[i].id+'"><div class="cartbox"><div class="cartorder_select"><p class="checkP"></p></div><div class="cart_imgs"><a href="information.html?id='+cookieArr[i].id+'" target="_blank"><img src="'+res[cookieArr[i].id]['img_pag']+'"></a></div><div class="cart_name"><p><a href="information.html?id='+cookieArr[i].id+'">'+res[cookieArr[i].id]['name']+'</a></p></div><div class="spec_num"><p>'+res[cookieArr[i].id]['skg']['skg1'][0]+'</p></div><div class="price_singular"><p>￥'+price+'</p></div><div class="num_sel_lage"><span class="goods_buy_left">-</span><input type="text" name="" value="'+cookieArr[i].num+'" disabled="disabled"><span class="goods_buy_right">+</span></div><div class="sum"><p>￥'+priceSum+'</p></div><div class="delete"><p><a href="javascript:void(0)">删除</a></p></div></div></li>';
  }
  $('.cart_select').css({'visibility':''});
  if(!cookieArr.length){
    html = '<div class="cart_empty">购物车中还没有商品，<a href="shopList.html">继续逛逛</a>吧！</div>';
    $('.cart_select').css({'visibility':'hidden'});
  }
  //填入购物车列表
  $('.list_unstyled').html(html);
}//获取cookie的存的值，并填入购物车列表结束


//数量改变，改变原价中的值
function changePriceSun(thisId,price,num){
  //计算商品总价格
  var price = changeTwoDecimal(price.replace('￥',''));
  var priceSum = Math.floor(price * num);
  //输入至原价中
  $('#'+thisId).find('.sum').children('p').text('￥'+priceSum);

  //获取cookie并转化为json
  var cookieArr = eval($.cookie('goods'));
  //遍历cookie，改变当前id所指示商品的数量
  for(var i in cookieArr){
    if(thisId == cookieArr[i].id){
      cookieArr[i].num = num;
    }
  }
  //cookie再转回字符串，填入cookie
  $.cookie('goods',JSON.stringify(cookieArr),{path:'/'});
}//数量改变，改变原价中的值结束


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



//删除当前商品在cookie中的记录
function removeThisCookie(thisId){
  //获取cookie
  var cookieArr = eval($.cookie('goods'));
  for(var i=0; i<cookieArr.length; i++){
    if(thisId == cookieArr[i].id){
      cookieArr.splice(i,1);
      break;
    }
  }
  //将数组重新转化为字符串，存入cookie
  $.cookie('goods',JSON.stringify(cookieArr),{path:'/'});

}//删除当前商品在cookie中的记录结束



//遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前
function allSeleShopping(){
  var priceSum = 0;
  var price = 0;
  var sum = 0;
  //new一个数组和一个对象，接收商品id和商品数量
  var obj = new Object();
  var arr = [];
  //获取商品列表中有多少中商品，即有多少个li
  var oLi = $('.list_unstyled').children('li');
  //循环遍历所有li
  for(var i=0; i<oLi.length; i++){
    if(oLi.eq(i).find('.checkP').hasClass('select')){
      //获取所有选中商品的总数
      sum += parseInt(oLi.eq(i).find('input').val());
      //获取当前循环到的商品的总金额
      price = oLi.eq(i).find('.sum').children('p').text();
      //获取所有选中商品的总金额数
      priceSum += parseInt(price.replace('￥',''));
      //将获得的id和数量存入对象
      obj = {
        id:oLi.eq(i).attr('id'),
        num:parseInt(oLi.eq(i).find('input').val())
      };
      //将获得的对象弹入数组
      arr.push(obj);
      //console.log(arr);
    }
  }
  $('.goodsSelect').children('em').text(sum+'件');
  $('.goodsPrice').text('￥'+priceSum);
  //将获得的选中的商品id和数量存入cookie
  $.cookie('payDesk',JSON.stringify(arr),{path:'/'});
}//遍历列表中所有选中的商品，获取数量和总价格，输入到结算之前结束


// 将最近浏览放入最近浏览列表
function lookHistoryList(ress){
  var lookHistory = eval($.cookie('lookHistory'));
  var html = '';
  var s = '';
  for(var key in lookHistory){
    if(ress[lookHistory[key]]['skg']['skg1'][2]){
      s = ress[lookHistory[key]]['skg']['skg1'][2];
    }
    html += '<li><a href="information.html?id='+lookHistory[key]+'" target="_blank"><img src="'+ress[lookHistory[key]].img_pag+'" alt=""><p class="history_name">'+ress[lookHistory[key]].name+'</p><p class="history_price">'+ress[lookHistory[key]]['skg']['skg1'][1]+' / '+ress[lookHistory[key]]['skg']['skg1'][0]+'</p></a></li>';
  }
  $('.look_history_con').find('.slidee').eq(0).html(html);
}// 将最近浏览放入最近浏览列表

