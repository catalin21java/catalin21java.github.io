<%
pNameArr=Split(Request.ServerVariables("SCRIPT_NAME"),"/")
pName=lcase(pNameArr(Ubound(pNameArr)))
%>
<ul>
  <li<%if InStr(pName, "default.asp")>0 then%> class="active"<%end if%>><a href="default.asp"><strong>Home</strong></a></li>
  <li<%if InStr(pName, "localizare.asp")>0 then%> class="active"<%end if%>><a href="localizare.asp"><strong>Localizare</strong></a></li>
  <li<%if InStr(pName, "galerie_foto.asp")>0 then%> class="active"<%end if%>><a href="galerie_foto.asp"><strong>Galerie foto</strong></a></li>
  <li<%if InStr(pName, "oferte_speciale.asp")>0 then%> class="active"<%end if%>><a href="oferte_speciale.asp"><span class="oferta"></span><strong>Oferte speciale</strong></a></li>
  <li<%if InStr(pName, "imprejurimi.asp")>0 then%> class="active"<%end if%>><a href="imprejurimi.asp"><strong>Imprejurimi</strong></a></li>
  <li<%if InStr(pName, "contact.asp")>0 then%> class="active"<%end if%>><a href="contact.asp"><strong>Contact</strong></a></li>
</ul>
