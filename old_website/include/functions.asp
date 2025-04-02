<%
LunileAnuluiLong=Array("Ianuarie","Februarie", "Martie", "Aprilie","Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie","Decembrie")

Function DateView(DataEng, Format) ' display date in custom format 
	
	if not isDate(DataEng) then Exit Function

	luna		= cStr(Month(DataEng))
	ziua	= cStr(Day(DataEng))
	anul		= cStr(DatePart("yyyy", DataEng))
	ora = hour(DataEng)
	minut = minute(DataEng)
	secunde = second(DataEng)
	Select Case Format
		Case "/"		:	DateView = AddZero(ziua) & "/" & AddZero(luna) & "/" & anul
		Case "."		:   DateView = AddZero(ziua) & "." & AddZero(luna) & "." & anul
		Case "selectie"	:   DateView = AddZero(ziua) & "." & AddZero(luna) & "." & anul
		Case "custom"	:	DateView = DayName(DataEng) & " , " & MonthName(luna) & " " & AddZero(ziua) & " , " & anul
		Case "custom1"	:	DateView = AddZero(ziua) & "." & AddZero(luna) & "." & anul & " " & AddZero(ora) & ":" & AddZero(minut)
		Case "SQLServer"		:   DateView = AddZero(luna) & "/" & AddZero(ziua) & "/" & anul
	End Select
End Function

Function DateViewInterval(Data1,Data2, Format) ' display date in custom format 
	
	if not isDate(Data1) then Exit Function
	if not isDate(Data2) then Exit Function

	luna1	= cStr(Month(Data1))
	ziua1	= cStr(Day(Data1))
	anul1	= cStr(DatePart("yyyy", Data1))

	luna2	= cStr(Month(Data2))
	ziua2	= cStr(Day(Data2))
	anul2	= cStr(DatePart("yyyy", Data2))
	Select Case Format
		Case "/"		:	DateViewInterval = AddZero(ziua1) & "/" & AddZero(luna1) & "/" & anul1 & " - " & AddZero(ziua2) & "/" & AddZero(luna2) & "/" & anul2
		Case "."		:   DateViewInterval = AddZero(ziua1) & "." & AddZero(luna1) & "." & anul1 & " - " & AddZero(ziua2) & "." & AddZero(luna2) & "." & anul2
		Case "custom1"	:   DateViewInterval = AddZero(ziua1) & "." & AddZero(luna1) & " - " & AddZero(ziua2) & "." & AddZero(luna2) & "&nbsp;" & anul2
	End Select
End Function

Function MakeUSDate(x)
	arrSplit=Split(x,".")
	if Ubound(arrSplit)<>2 then
		exit function
	else
		MakeUSDate = arrSplit(1) & "/" & arrSplit(0) & "/" & arrSplit(2)
	End If
End Function

Function MakeDate2Control(x)
	if instr(x," ")>0 then
		x=Left(x,Instr(x," "))
	end if
	arrSplit=Split(x,"/")
	if Ubound(arrSplit)<>2 then
		exit function
	else
		MakeDate2Control = AddZero(arrSplit(1)) & "." & AddZero(arrSplit(0)) & "." & AddZero(arrSplit(2))
	End If
End Function

Function AddZero(Number)
	if len(Number) = 1 then
		AddZero = cstr("0" & cstr(Number))
	else
		AddZero = cstr(Number)
	end if
end function

Function AddNZero(Number,intLength)
	AddNZero = cstr(Number)
	for i=1 to intLength-len(Number)
		AddNZero = "0" & AddNZero
	next
end function

function CMonthName(Data)
	CMonthName = LunileAnuluiLong(Month(Data)-1)
'	select case Month(Data)
'		case 1	: CMonthName = "Ianuarie"
'		case 2	: CMonthName = "Febbruarie"
'		case 3	: CMonthName = "Martie"
'		case 4	: CMonthName = "Aprilie"
'		case 5	: CMonthName = "Mai"
'		case 6	: CMonthName = "Iunie"
'		case 7	: CMonthName = "Iulie"
'		case 8	: CMonthName = "August"
'		case 9	: CMonthName = "Septembrie"
'		case 10	: CMonthName = "Octombrie"
'		case 11	: CMonthName = "Noembrie"
'		case 12	: CMonthName = "Decembrie"
'	end select
end function


function DayName(Data)
	select case WeekDay(Data)
		case 1	:	DayName = "Sunday"
		case 2	:	DayName = "Monday"
		case 3	:	DayName = "Tuesday"
		case 4	:	DayName = "Wednesday"
		case 5	:	DayName = "Thursday"
		case 6	:	DayName = "Friday"
		case 7	:	DayName = "Saturday"
	end select
end function

function strcmp(str1,str2) 
	if cstr(str1) = cstr(str2) then
		strcmp = " selected"
	else
		strcmp = ""
	end if
end function

Function RoundText(sText,iLength, sSep) 
    If len(sText) > iLength Then
		sText = left(sText,iLength)
		If Instr(sText,sSep) then
			RoundText = left(sText,inStrRev(sText,sSep))
		Else
			RoundText = left(sText,iLength)
		End If
	Else
		RoundText = sText
    End If
    'RoundText = sText
End Function

Function URLDecode(ByVal What)
	What = Replace(What, "+", " ")
	Set Stream = Server.CreateObject("ADODB.Stream")
	Stream.Type = 2 'String
	Stream.Open
	Pos = InStr(1, What, "%")
	pPos = 1
	Do While Pos > 0
		Stream.WriteText Mid(What, pPos, Pos - pPos) + Chr(CLng("&H" & Mid(What, Pos + 1, 2)))
		pPos = Pos + 3
		Pos = InStr(pPos, What, "%")
	Loop
	Stream.WriteText Mid(What, pPos)
	Stream.Position = 0
	URLDecode = Stream.ReadText
	Stream.Close
	Set Stream=Nothing
End Function

Function BinaryToString(vBin)
	Set oConv = Server.CreateObject("ADODB.Stream")
	oConv.Charset = "utf-8"
	oConv.Type = 1 'binary
	oConv.Open
	oConv.Write vBin
	oConv.Position = 0
	oConv.Type = 2 'Text
	'oConv.Charset = "Windows-1252" 'optionally
	BinaryToString = oConv.ReadText()
	Set oConv=Nothing
End Function

function cutText(strText, maxLength)
if len(strText)<=maxLength then
	cutText = strText
else
	cutText = Left(strText,maxLength) & "..."
end if
end function

function checkNumeric(myString,defaultValue)
	if myString<>"" AND isNumeric(myString) then
		checkNumeric = CLng(myString)
	else
		checkNumeric = defaultValue	 
	end if
end function

function checkText(myString,defaultValue)
	if trim(myString)<>"" then
		checkText = Server.HTMLEncode(myString)
	else
		checkText = defaultValue	 
	end if
end function

function checkDate(myString,defaultValue)
	if isDate(MakeUSDate(myString)) then
		checkDate = MakeUSDate(myString)
	else
		checkDate = defaultValue	 
	end if
end function

function shortText(strText, noWords)
	shortText=""
	for x=1 to Len(strText)
		shortText = shortText & Mid(strText,x, 1)
		if Mid(strText,x, 1)=" " then
			noWords = noWords-1
		end if
		if noWords=0 then
			exit for
		end if
	next
	if len(strText)> len(shortText) then
		shortText = shortText & "..."
	end if
end function

Function stripTags(HTMLstring)
	Set RegularExpressionObject = New RegExp
	With RegularExpressionObject
		.Pattern = "<[^>]+>"
		.IgnoreCase = True
		.Global = True
	End With
	stripTags = RegularExpressionObject.Replace(HTMLstring, "")
	Set RegularExpressionObject = nothing
End Function
%>