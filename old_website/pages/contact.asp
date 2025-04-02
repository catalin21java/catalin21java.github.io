<!-- #include file="../include/conex.asp"-->
<%
GetPageContent "CONTACT"
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Pensiunea Floriana</title>
<link href="../css/style.css" rel="stylesheet" type="text/css" />
<script src="../js/jquery-1.4.4.min.js"></script>
<script src="../js/jquery.jcarousel.min.js"></script>
<script src="../js/jquery.lightbox-0.5.min.js"></script>
<script src="../js/general.js"></script>
</head>
<body>
<div class="page"> 
  <div class="menu"> 
    <!--#include file="_menu.asp"-->
  </div>
  <div class="content"> 
    <!--#include file="_imageSlider.asp"-->
    <div class="main_content"> 
      <div class="top_main_content"></div>
      <h2><%=PageContent.Item("Texte_Title")%></h2>
      <div class="contactform"> 
        <div class="map"> 
          <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.com/maps?q=46.646381,23.348472&amp;num=1&amp;t=h&amp;sll=37.0625,-95.677068&amp;sspn=23.875,57.630033&amp;ie=UTF8&amp;ll=46.645459,23.349252&amp;spn=0.020623,0.036478&amp;z=14&amp;output=embed"></iframe>
          <br />
          <small><a href="http://maps.google.com/maps?q=46.646381,23.348472&amp;num=1&amp;t=h&amp;sll=37.0625,-95.677068&amp;sspn=23.875,57.630033&amp;ie=UTF8&amp;ll=46.645459,23.349252&amp;spn=0.020623,0.036478&amp;z=14&amp;source=embed" style="color:#0000FF;text-align:left">View 
          Larger Map</a></small> </div>
      </div>
      <div class="rightcnt"> <%=PageContent.Item("Texte_CMSPage")%> 
        
      </div>
      <div class="clear"></div>
    </div>
  </div>
</div>
<div class="footer"> 
  <!--#include file="_footer.asp"-->
</div>
</body>
</html>
