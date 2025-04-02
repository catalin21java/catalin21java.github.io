<!-- #include file="../include/conex.asp"-->
<%
GetPageContent "HOME"
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
      <div class="right_visual"><img src="../images/right_visual.jpg" width="205" height="154" alt=" " /></div>
      <div class="left"> 
        <h2><%=PageContent.Item("Texte_Title")%></h2>
        <%=PageContent.Item("Texte_CMSPage")%> 
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
