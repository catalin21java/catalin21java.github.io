<%
 Function FillSelectItemWithInterval(arg, fromValue, toValue, selectedValue)
	FillSelectItemWithInterval = "<select name=""" & arg & """ id=""" & arg & """>"
	for a=fromValue to toValue
		FillSelectItemWithInterval = FillSelectItemWithInterval & "<option value='" & a & "'"
			if not isNull(selectedValue) then
				if cstr(selectedValue) = cstr(a) then
					FillSelectItemWithInterval = FillSelectItemWithInterval & " selected"
				end if
			end if
		FillSelectItemWithInterval = FillSelectItemWithInterval & ">" & a & "</option>"
	next
	FillSelectItemWithInterval = FillSelectItemWithInterval & "</select>"
end function

 Function FillSelectItem(arg)
	dim tempstr
	dim i
	dim idx
	idx=-1

	for i=0 to Ubound(selName)-1
		if selName(i)=arg then
			idx = i
			exit for
		end if
	next	
	
	FillSelectItem = "<select name=""" & arg & """ id=""" & arg & """>"
	if selType(idx) = "db" then
		Set cnn = Server.CreateObject("ADODB.Connection")
		cnn.Open connstring
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open selQuery(idx),cnn,0,1,1
		
		while not rs.EOF
			FillSelectItem = FillSelectItem & "<option value=""" & rs(0) & """"
			if not isNull(valmat.Item(selName(idx)).Item("value")) then
				if not isNull(rs(0)) then
					if Cstr(valmat.Item(selName(idx)).Item("value")) = Cstr(rs(0)) then
						FillSelectItem = FillSelectItem & " selected=""true"""
					end if
				end if
			end if
			FillSelectItem = FillSelectItem & ">" & rs(1) & "</option>"
			rs.MoveNext
		wend
			
		rs.Close
		set rs = Nothing
		cnn.Close
		set cnn = Nothing
	else 
		selArrayup = ubound(selArray(idx))
		for a=0 to selArrayup step 2
			FillSelectItem = FillSelectItem & "<option value='" & selArray(idx)(a) & "'"
				if not isNull(valmat.Item(selName(idx)).Item("value")) then
					if InStr("," & replace(cstr(valmat.Item(selName(idx)).Item("value"))," ","") & ",", "," & cstr(selArray(idx)(a)) & ",") >0 then
						FillSelectItem = FillSelectItem & " selected"
					end if
				end if
			FillSelectItem = FillSelectItem & ">" & selArray(idx)(a+1) & "</option>"
		next
	end if		
	FillSelectItem = FillSelectItem & "</select>"
end function
 
function valclass(arg1)		' change the css class of a label
	if valmat.Item(arg1).Item("valbool") then
		valclass="text_error"
	else
		valclass = "text_form"
	end if
end function
	

Sub PopulateFields()	' populates form fields	
	dim query
	query = "SELECT "
	for i=0 to fnamesup
		query = query & fnames(i) & "," 
	next		
	query = query & idfield &  " FROM " & tablename & " WHERE " & idfield & " = " & rowid

	Set cnn = Server.CreateObject("ADODB.Connection")
	cnn.Open connstring
	Set rsObject = Server.CreateObject("ADODB.Recordset")
	rsObject.Open query,cnn,0,1,1

	for i=0 to fnamesup
		valmat.Item(valformel(i)).Item("value") = rsObject(fnames(i))
	next
	rsObject.Close()
	Set rsObject = Nothing
	cnn.Close()
	Set cnn = Nothing
End Sub		
	
Sub ValidateFields()	' fields validation
	for i=0 to ubound(valformel)
		valmat.Item(valformel(i)).Item("value")  = trim(Request.Form(valformel(i)))
		if (instr(valformel(i),"_") > 0) then
			splitArr = Split(valformel(i),"_")
			validateType = splitArr(Ubound(splitArr)-1)
			requireType = splitArr(Ubound(splitArr)-2)
			select case UCase(requireType)
				case "REQ"
					isRequired = true
				case "NRQ"
					isRequired = false
				case else
					isRequired = false
			end select
			if ((isRequired = true) OR (isRequired = false AND stripWhitespace(valmat.Item(valformel(i)).Item("value")) <> "")) then
					select case (validateType) 
						case "cn" 
							if (not isAlphanumeric(stripWhitespace(valmat.Item(valformel(i)).Item("value")))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "int" 
							if (not isInteger(stripWhitespace(valmat.Item(valformel(i)).Item("value")))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "int0" 
							if (int(stripWhitespace(valmat.Item(valformel(i)).Item("value"))) = 0) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "fl" 
							if (not (isFloat(stripWhitespace(valmat.Item(valformel(i)).Item("value"))) or isSignedFloat(stripWhitespace(valmat.Item(valformel(i)).Item("value"))))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "zip" 
							if (not isZIPCode(stripWhitespace(valmat.Item(valformel(i)).Item("value")))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "email" 
							if (not ValEmail(stripWhitespace(valmat.Item(valformel(i)).Item("value")))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "na" 
							if (stripWhitespace(valmat.Item(valformel(i)).Item("value")) = "") then
								valmat.Item(valformel(i)).Item("value") = ""
							end if
						case "ne" 
							if (stripWhitespace(valmat.Item(valformel(i)).Item("value")) = "") then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "dt" 
							if (stripWhitespace(valmat.Item(valformel(i)).Item("value")) = "" or not isDate(stripWhitespace(valmat.Item(valformel(i)).Item("value")))) then
								valid = valid and false
								valmat.Item(valformel(i)).Item("valbool") = true
							end if
						case "ckb" 
							if (lcase(valmat.Item(valformel(i)).Item("value")) = "on") then
								valmat.Item(valformel(i)).Item("value") = "true"
							else
								valmat.Item(valformel(i)).Item("value") = "false"	
							end if
					end select
				end if
		end if
	next
End Sub
	
Sub UpdateDatabase(externalQry) ' update database
	dim query
	dim i
	Set cnn = Server.CreateObject("ADODB.Connection")
	cnn.Open connstring
	Set rs = Server.CreateObject("ADODB.Recordset")
	
	if externalQry = "" then
		query = "SELECT  "
		for i=0 to fnamesup
			query = query & fnames(i) & "," 
		next		
		query = query & idfield & " FROM " & tablename & "  WHERE " & idfield & " = "  & rowid
	else
		query = externalQry
	end if

	rs.Open query,cnn,2,3,1
	if action = "add" then
		rs.AddNew
	end if
	if action = "update" AND rs.eof then
		rs.AddNew
		rs(idfield) = rowid
	end if

	for i=0 to fnamesup
		select case ftype(i)
			case "ckb"
				if valmat.Item(valformel(i)).Item("value") = "on" then
					rs(fnames(i)) =  1
				else
					rs(fnames(i)) =  0
				end if
			case "date"
				if valmat.Item(valformel(i)).Item("value")<>"" then
					rs(fnames(i)) =  MakeUSDate(valmat.Item(valformel(i)).Item("value"))
				else
					rs(fnames(i)) = NULL
				end if
			case else
				if valmat.Item(valformel(i)).Item("value")<> "" then
					rs(fnames(i)) = valmat.Item(valformel(i)).Item("value")
				else
					rs(fnames(i)) = NULL
				end if
		end select	
	next
	rs.Update 
	rs.Close()
	Set rs = Nothing				
	cnn.Close()
	Set cnn = Nothing
End Sub			

Sub GetFieldSize()	' sets maxlength attribute of form's texts fields

	Set cnn = Server.CreateObject("ADODB.Connection")
	cnn.Open connstring
		
	Set xCat = Server.CreateObject("ADOX.Catalog")
	Set xCat.ActiveConnection = cnn
		
	for i=0 to ubound(fnames)
		select case xCat.Tables(tablename).Columns(fnames(i)).Type
			case 200,202
				fsize(i) = xCat.Tables(tablename).Columns(fnames(i)).DefinedSize
			case else
				fsize(i) = 10
		end select		
	next
	cnn.Close
	Set cnn = Nothing	
End Sub

Function CHTMLEncode(arg1) ' fills textarea fields
	if isNull(arg1) then 
		CHTMLEncode = ""
	else
		CHTMLEncode = Server.HTMLEncode(CStr(arg1))
	end if
End Function

Sub Uppercase()
	for i=0 to fnamesup
		select case ftype(i)
			case "ckb"
			case "date"
			case else
				valmat.Item(valformel(i)).Item("value") = Ucase(valmat.Item(valformel(i)).Item("value"))
		end select	
	next
end Sub

Function GenerateHierarchy(parent, level, selectedElem)
	tmp=""
	strSQL = "SELECT * FROM Product_Hierarchy WHERE Parent_ID=" & parent
	if level>2 then
		strSQL = strSQL  &  " ORDER BY Hierarchy_Name"
	end if
	set rsM=conex.execute(strSQL)
	if parent=0 then
		tmp = tmp & "<option value=""0"""
		if cstr(selectedElem) = Cstr(0) then
				tmp = tmp & " selected"
			end if
		tmp = tmp & " level=""0"">Top Level</option>"
	end if
	while not(rsM.eof)
		tmp = tmp & "<option value=""" & rsM("Hierarchy_ID") & """" 
		if cstr(selectedElem) = Cstr(rsM("Hierarchy_ID")) then
			tmp = tmp & " selected"
		end if
		tmp = tmp & " level=""" & level & """>"
		for ii=2 to Cint(level)
			tmp = tmp & "--"
		next
		tmp = tmp & rsM("Hierarchy_Name") & "</option>"
		tmp = tmp & GenerateHierarchy(rsM("Hierarchy_ID"), level+1, selectedElem)
		rsM.MoveNext
	wend
	GenerateHierarchy = tmp
end function

function GetAllChildrens(parent)
	tmp=""
	strSQL = "SELECT * FROM Product_Hierarchy WHERE Parent_ID=" & parent
	set rsM=conex.execute(strSQL)
	while not(rsM.eof)
		if tmp<>"" then
			tmp = tmp & ","
		end if
		tmp = tmp & rsM("Hierarchy_ID") & GetAllChildrens(rsM("Hierarchy_ID"))
		rsM.MoveNext
	wend
	GetAllChildrens = tmp
end function

function DrawBreadCrumb(hierarchy)
	aux = hierarchy
	while aux<>0 
	  set x=conex.execute("SELECT * FROM Product_Hierarchy WHERE Hierarchy_ID=" & aux)
	  temp= "<span class='sep'>&nbsp;</span><a href='produse.asp?Cat_ID=" & x("Hierarchy_ID") & "'>" & x("Hierarchy_Name") & "</a>" & temp
	  aux = x("Parent_ID")
	wend
	DrawBreadCrumb=temp
end function
%>