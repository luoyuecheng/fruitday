// order 下订单页面

$(function(){

  //头部文件的改写
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

  //加载商品，上一页面选取的商品
  $.ajax({
    url:'../data/shopping.json',
    type:'GET',
    success:function(res){

      //console.log(res);
      //获取cookie并将内容加载进页面相应区域
      addOrderCartlist(res);

    }//success结束

  });//加载商品ajax结束

  //加载地址等等等
  $.ajax({
    url:'',
    type:'GET',
    success:function(res){

      // 点击添加收货地址
      $('#newaddress').click(function(){
        $('.warning').children('h5').html('添加收货地址<span class="chachu"><img src="../images/shoppingList/cha.png"></span>');
        $('.warning').css({'marginLeft':'-358px'});
        $('#p_warning').stop().toggle({'display':'block'});
      });//点击添加收货地址结束

      //点击关闭弹出框
      $('.warning').on('click','.chachu',function(){
        $('#p_warning').stop().toggle({'display':'block'});
        $('.warning').find('form').find('input').val('');
        $('.warning').find('form').find('.inpSel').eq(0).children('span').text('省/直辖市');
        $('.warning').find('form').find('.inpSel').eq(1).children('span').text('市');
        $('.warning').find('form').find('.inpSel').eq(2).children('span').text('区／县');
      });//点击关闭弹出框结束

      //选择地区下拉框
      $('.warning').on('click','.inpSel',function(event){
        var evt = event || window.event;
          $(this).toggleClass('act').siblings('.inpSel').removeClass('act');
          $(this).children('ul').slideToggle(200).end().siblings('.inpSel').children('ul').slideUp(200);
          //取消错误的红框提醒
          $(this).removeClass('hasError');
      });//选择地区下拉框结束

      //点击那个地址，实时显示那个
      $('.warning').on('click','.inpSel li',function(event){
        $(this).parent().prev().text($(this).text());
      });

      //划过时背景颜色的变化
      $('.warning').on('mouseenter','.inpSel li',function(event){
        $(this).addClass('cur').siblings('li').removeClass('cur');
      });

      //输入框失去焦点时，取消错误红框提示
      $('.warning').on('blur','input[type=text]',function(){
        //alert(1);
        $(this).removeClass('hasError');
      });

      //点击保存收货人地址
      $('#submit').click(function(){
        var isDrag = true;
        var isTel = true;
        //创建正则，判断电话输入是否正确
        var reg = /^1[34578][0-9]{9}$/g;
        //判断输入框是不是为空
        if(!$('#name').val() || !$('#detailAddr').val() || !$('#tel').val()){
          isDrag = false;
        }
        //判断手机号码是否正确
        if(!reg.test($('#tel').val())){
          isDrag = false;
          isTel = false;
        }
        //判断三个选择地址框是否选择
        if($('.inpSel').eq(0).children('span').text()=='省/直辖市' || $('.inpSel').eq(1).children('span').text()=='市' || $('.inpSel').eq(2).children('span').text()=='区／县'){
          isDrag = false;
        }
        //若有一个不符合要求则无法保存地址
        if(isDrag){
          //判断是否选择了设为默认收货地址
          var moren = '';
          var isNone = 'none';
          if($('#def').is(':checked')){
            moren = 'cur';
            isNone = 'block';
            //取消其他的默认收货地址
            $('.order_item').children('ul').children('li').removeClass('cur');
            $('.order_item').find('li').find('span:has(a)').css({'display':'none'});
          }
          //输入都符合要求，则将地址输入到页面中
          var html = '<li class="'+moren+'"><span class="tag">广东省</span><span>'+$('#name').val()+' '+$('#tel').val()+' '+$('.inpSel').eq(0).children('span').text()+$('.inpSel').eq(1).children('span').text()+$('.inpSel').eq(2).children('span').text()+$('#detailAddr').val()+'</span><span style="display:'+isNone+'"><a href="javascript:void(0)">编辑</a><a href="javascript:void(0)">删除</a></span></li>';
          //添加到页面
          $('.order_item').children('ul').append($(html));
          //关闭输入地址弹框
          $('#p_warning').stop().toggle();
          $('.warning').find('form').find('input').val('');
          $('.warning').find('form').find('.inpSel').eq(0).children('span').text('省/直辖市');
          $('.warning').find('form').find('.inpSel').eq(1).children('span').text('市');
          $('.warning').find('form').find('.inpSel').eq(2).children('span').text('区／县');
        }else{
          //alert(1)
          if(!isTel){
            //手机号码错误
            $('#tel').addClass('hasError');
          }
          //选择区域错误
          if($('.inpSel').eq(0).children('span').text()=='省/直辖市'){
            $('.inpSel').eq(0).addClass('hasError');
          }
          if($('.inpSel').eq(1).children('span').text()=='市'){
            $('.inpSel').eq(1).addClass('hasError');
          }
          if($('.inpSel').eq(2).children('span').text()=='区／县'){
            $('.inpSel').eq(2).addClass('hasError');
          }
          //输入框为空
          for(var i=0; i<$('.formitem').find('input[type=text]').length; i++){
            if($('.formitem').find('input[type=text]').eq(i).val()==''){
              $('.formitem').find('input[type=text]').eq(i).addClass('hasError');
            }
          }
        }//if-else结束
      });//点击保存收货人地址结束

      //点击收货人信息，更改默认收货地址
      $('.order_item').on('click','li .tag',function(){
        //alert(1);
        $(this).parent().addClass('cur').siblings('li').removeClass('cur');
        $(this).siblings('span:has(a)').css({'display':'block'}).end().parent().siblings('li').find('span:has(a)').css({'display':'none'});
      });//点击收货人信息，更改默认收货地址结束

      //点击删除收货地址按钮
      $('.order_item').on('click','a:contains(删除)',function(){
        $(this).parent().parent().remove();
      });//点击删除收货地址按钮结束

      //点击编辑收货地址按钮
      $('.order_item').on('click','a:contains(编辑)',function(){
        //获取页面上的地址
        var str = $(this).parent().prev().text();
        //字符串截取成数组
        var arr = str.split(' ');
        //编辑框头部标题的改变
        $('.warning').children('h5').html('编辑收货地址<span class="chachu"><img src="../images/shoppingList/cha.png"></span>');
        //收货人
        $('#name').val(arr[0]);
        //电话
        $('#tel').val(arr[1]);
        //字符串接收为详细地址
        $('#detailAddr').val(arr[2]);
        console.log(arr);
        //显示编辑框
        $('.warning').css({'marginLeft':'-358px'});
        $('#p_warning').stop().toggle({'display':'block'});
      });//点击编辑按钮结束

      //点击更改地址按钮，可以将除了第一个地址以外的地址隐藏，再点击显示
      $('.orderAddressSwitch').click(function(){
        if($(this).children('span').hasClass('b_u')){
          $(this).children('span').removeClass('b_u');
          $(this).siblings('ul').animate({'height':'46px'});
        }else{
          $(this).children('span').addClass('b_u');
          $(this).siblings('ul').stop().animate({'height':(46*$(this).siblings('ul').children('li').length)+'px'}).css({'height':''});
        }
       });//点击更改地址按钮，可以将除了第一个地址以外的地址隐藏，再点击显示结束

      //点击支付方式下的li选择支付方式
      $('.order_pay').on('click','li',function(){
        $(this).toggleClass('cur')

      });//点击支付方式下的li选择支付方式结束

      //文字输入域，获取焦点的时候改变样式
      $('.order_item_sendinfo').on('focus','textarea',function(){
        $(this).addClass('textarea_focus');
      });
      $('.order_item_sendinfo').on('blur','textarea',function(){
        $(this).removeClass('textarea_focus');
      });//文字输入域，获取焦点的时候改变样式结束

      //点击提交订单
      $('.order_item_last').children('a').click(function(){
        var isDrag = true;
        //判断收货人信息处，是否选择了收货地址
        if(!$('.order_item').find('li').hasClass('cur')){
          isDrag = false;
          alert('请选择收货地址');
        }
        //判断是否选择了支付方式
        if(!$('.order_pay').find('li').hasClass('cur')){
          isDrag = false;
          alert('请选择支付方式');
        }
        if(isDrag){
          //选中才能跳转
          var payMoney = $('.order_item_last').children('strong').text().replace('￥','');
          //将需支付的金额存入cookie
          $.cookie('payMoney',parseFloat(payMoney));
          //console.log($.cookie('payMoney'));
          window.location.href = 'payDesk.html';
        }
      });//点击提交订单结束

    }//success结束

  });//加载地址等等等结束

});//$(function)结束



//获取cookie并将内容加载进页面相应区域
function addOrderCartlist(res){
  //获取cookie
  var cookieArr = eval($.cookie('payDesk'));
  var html = '';
  var obj;//不能在for循环内声明，否则第二遍报错
  var price = 0, priceSum = 0;
  for(var i=0; i<cookieArr.length; i++){
    obj = res[cookieArr[i]['id']]
    html += '<li><dl class="clearfix"><dt><img src="'+obj['img_pag']+'"></dt><dd><div class="protitle">'+obj.name+'</div><div class="proinfo">'+obj['skg']['skg1'][1]+' / '+obj['skg']['skg1'][0]+' <span>x '+cookieArr[i].num+'</span></div></dd></dl></li>';
    //获取总价格
    price = parseFloat(obj['skg']['skg1'][1].replace('￥',''));
    priceSum += price * cookieArr[i].num;
  }
  //显示的购买商品列表
  $('.order_item_cartlist').html(html);
  //显示金额
  $('.order_item_inall').children('p').eq(0).children('span').text('￥'+priceSum);
  //显示应付金额
  $('.order_item_last').children('strong').text('￥'+(20.00+priceSum));
  //console.log(priceSum);

}//获取cookie并将内容加载进页面相应区域结束
