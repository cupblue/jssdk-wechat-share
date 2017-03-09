# jssdk-wechat-share
## 使用步骤

<pre>
<script type="text/javascript" src="/jweixin-1.0.0.js"></script> 
<script type="text/javascript" src="/share.js"></script>
<script type="text/javascript">
    var openid = $("#openid").val() ? $("#openid").val() : '123456';
    Flyme.wxShareInit(appid, shareid, openid);
</script>
</pre>
## JSSDK微信分享组件功能
- 支持分享到微信好友、朋友圈、QQ好友、QQ微博
- 自定义JSONP支持跨域
- 支持数据统计
- 支持系统配置调用
- 自定义参数等方式
