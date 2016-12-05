//选择支付方式页

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

      //订单金额
      var payMoney = parseFloat($.cookie('payMoney'));
      var nowRemain = $('.now_remain').children('em').eq(0).text().replace('￥','');
      console.log(nowRemain)
      //订单金额
      $('#really_pay').html('￥'+payMoney);
      //需支付金额
      $('#need_online_pay').html('￥'+(payMoney-parseFloat(nowRemain)));

      //选择支付方式
      $('#pay_ment').on('click','li',function(){
        $(this).addClass('active').siblings('li').removeClass('active');
      });//选择支付方式结束

      //点击立即支付
      $('input[type=image]').click(function(){
        //option_bd
        var payid = $('#pay_ment').children('li.active').attr('payid');
        //console.log(payid);
        window.location.href = 'https://cashier.95516.com/b2c/index.action?transNumber=201609201248304610368?payid='+payid;
      });

    }//success结束

  });//ajax结束



});//$(function)结束
