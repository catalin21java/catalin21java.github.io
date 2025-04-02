<%
' included on client side
if IsObject(conex) then
	if conex.state > 0 then
		conex.Close()
		set conex = nothing
	end if
end if
%>