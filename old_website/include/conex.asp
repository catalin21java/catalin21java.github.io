<!--#include file="config.asp"-->
<!--#include file="functions.asp"-->
<!--#include file="pagescripts.asp"-->
<%
' included on client side
set conex = Server.CreateObject("ADODB.Connection")
	conex.Open connstring
Session.LCID = 1048

%>