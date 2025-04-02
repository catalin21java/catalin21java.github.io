<!-- #include file="../include/conex.asp"-->
<%
GetPageContent "GALERIE_FOTO"
strSQL="SELECT B.*,a.Zona_Nume FROM ZoneCabana A, Photos B WHERE A.Zona_ID = B.Zona_ID AND B.Activ<>0 ORDER BY B.Zona_ID"
set rsPoze=conex.execute(strSQL)
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
<script type="text/javascript">
$(function() {
	$('.gallery a').lightBox(); // Select all links in object with gallery ID

});
</script>

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
      <%=PageContent.Item("Texte_CMSPage")%> 
	  <%zonaID=0
	  while not(rsPoze.eof)
	  if rsPoze("Zona_ID")<>zonaID then
	  	if zonaID<>0 then%>
			</div><div class="clear"></div>
		<%end if%>
		<h3><%=rsPoze("Zona_Nume")%></h3><div class="gallery"> 
	  <%end if%>
	  <div class="elem"> <a href="../files/poze/<%=rsPoze("Photo_Name")%>"><img src="../files/poze/<%=rsPoze("Photo_Name_small")%>" width="188" height="141" /></a></div>
	  <%zonaID = rsPoze("Zona_ID")
	  rsPoze.MoveNext
	  wend%>
		<%if zonaID<>0 then%>
			</div>	  
		<%end if%>
	  
      <div class="clear"></div>
    </div>
  </div>
</div>
<div class="footer"> 
  <!--#include file="_footer.asp"-->
</div>
</body>
</html>
