//公共js文件

$(function(){

  //加载头尾
  $('#headerBox').load('data/commont.html #header');
  $('#footerBox').load('data/commont.html #footer');
  $('#zhezhaoBox').load('data/commont.html #zhezhao');
  $('#broadside_buttonBox').load('data/commont.html #broadside_button',function(){


  //按钮功能，回到顶部
  $('.return_top').click(function(){
    //alert(1);  cs wc
    $(document).scrollTop(0);
  });

  //获取cookieUser，是否已登录
  loginWhether();

});

  //ajax请求数据
  $.ajax({
    url:'data/hfFile/header.json',
    type:'GET',
    success:function(res){
      //请求成功函数
      //console.log(res[0].city);  cs  wc

      //热门城市
      //console.log(res[0].city[0].hotCity);
      //将数据插入城市选择
      var html = '';
      for(var i=0; i<res[0].city[0].hotCity.length; i++){
        html += '<li><a href="javascript:void(0)" title="">'+res[0].city[0].hotCity[i]+'</a></li>';
      }
      //插入ul
      $('.hotCity').html(html);

      //城市菜单
      var checkHtmlLi = '';
      for(var i=0; i<res[0].city[1].selected.length; i++){
        var menuHtml = '<ul>';
        checkHtmlLi += '<li>';
        //判断  ->   若请求的数据是对象，则生成三级菜单
        //console.log(typeof res[0].city[1].selected[i]);  cs wc
        //console.log(res[0].city[1].selected[i]);
        if((typeof res[0].city[1].selected[i])=='object'){
          //判断若是对象，则获取对象的键，和值，其分别为二级菜单，和三级菜单
          for(var key in res[0].city[1].selected[i]){
            for(var j=0; j<res[0].city[1].selected[i][key].length; j++){
              menuHtml += '<li><a href="javascript:void(0)" title="">'+res[0].city[1].selected[i][key][j]+'</a></li>';
            }
            //console.log(key);
            //取值，二级菜单内容
              //三级菜单
              checkHtmlLi += '<a title="">'+key+'<span><i class="iconfont">&#xe606;</i></span></a>'+menuHtml+'</ul>';
          }
        }else{
          //若不是对象，而是string
          checkHtmlLi += '<a href="javascript:void(0)" title="">'+res[0].city[1].selected[i]+'</a>';
        }
        //闭合li
        checkHtmlLi += '</li>';
      }//最外层for循环结束
      //插入进ul
      $('.checkCity').html(checkHtmlLi);
      $('li:has(ul)').children('ul').css('display','none');
      //下拉菜单生成完毕    ->    控制三级菜单

      //鼠标移入显示，移除隐藏  ->  下拉菜单
/*      $('.city').hover(function(){
        $(this).parent().parent().children('.cityMenu').css('display','block');
      },function(){
        $(this).parent().parent().children('.cityMenu').css('display','none');
      });*/
      $('#headerBox').on('mouseenter','.city',function(event){
        $(this).parent().parent().children('.cityMenu').css('display','block');
      });
      $('#headerBox').on('mouseleave','.city',function(){
        $(this).parent().parent().children('.cityMenu').css('display','none');
      });

      $('.cityMenu').hover(function(){
        $(this).css('display','block');
      },function(){
        $(this).css('display','none');
      });

      //三级菜单的显示隐藏
        /*此处若是直接写li的点击时间，事件中的this指向li，但是，浏览器传过来的target指向的是a，所以，此处应该是写li下a的点击事件*/
      $('#headerBox').on('click','li:has(ul) a',function(event){
        //console.log(event,'..',this);  cs wc
        if(this == event.target){
          $(this).parent().children('ul').toggle(1000);
        }
      });
      //左侧选择城市下拉菜单结束

      $('#headerBox').on('click','.checkCity li',function(){
        if(!$(this).children('ul').length){
          var addres = $(this).children('a').text();
          //alert($(this).children('a').text());
          $('.cityBox').html('<a href="javascript:void(0)" title="" class="city"><i class="iconfont"></i> &nbsp;<span>'+addres+'</span><em class="iconfont"></em></a>');
           $('.cityMenu').css('display','none');
        }
      });


      //果园公告
      //加载果园公告
      var html = '';
      for(var i=0; i<res[1].notice.length; i++){
        html += '<li><a>'+res[1].notice[i][0]+'</a>'+res[1].notice[i][1]+'</li>';
        //console.log(html);
      }
      $('.navMenu').children('ul').prepend(html);
      //果园公告，及手机果园下拉菜单的显示与隐藏
      $('.navMenu').hover(function(){
        $(this).children('ul,div').toggle();
      });

      //点击推出登录
      $('#headerBox').on('click','.tuichu',function(){
        var cookieUser = eval($.cookie('cookieUser'));
        for(var i in cookieUser){
          //console.log(cookieUser[i]['status'])
          cookieUser[i]['status'] = 0;
        }
        var cookieUserStr = JSON.stringify(cookieUser);
        $.cookie('cookieUser',cookieUserStr,{expires:2,path:"/"});
        window.location.reload(true);
      });


    }  //success结束
  });   //ajax结束




});  //$(function)结束


//判断是否登录
function loginWhether(){
  //获取账号密码的cookie
  var cookieUser = eval($.cookie('cookieUser'));

  //判断读取到的cookie的状态，status为1表示已经登录
  for(var i in cookieUser){
    if(cookieUser[i]['status']==1){
      //当前用户为登录状态，则改变头部
      $('#header').find('.pullRight').children('li').eq(0).html('欢迎<a href="javascript:void(0)">用户'+cookieUser[i]['user']+'</a> , <a href="javascript:void(0)" class="tuichu">退出</a>');
      //console.log(cookieUser[i]['user']);
    }
  }


}//判断是否登录结束
