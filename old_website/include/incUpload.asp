<%
' ****************************
' Description : functions for file upload
' Usage	 	  :	 
'	UploadSave								- it's called on postback	
'	variable = UploadForm("fieldname")		- retrieve postback values	
'		files = Array("photo1","photo2")	- variable number of files; args are field names	
'		filenames = Array("name1","name2")	- change the files' names
'		newfile=UploadFile(files, "..\files\images\", filenames) - saves the files on disk and returns their names 
' ****************************
Set objDict = Server.CreateObject("Scripting.Dictionary")

function getString(StringBin)
	Dim intCount
    getString =""
    For intCount = 1 To LenB(StringBin)
	    getString = getString & chr(AscB(MidB(StringBin,intCount,1))) 
    Next
end function

function getByteString(StringStr)
	Dim i, char
    For i = 1 To Len(StringStr)
    	char = Mid(StringStr, i, 1)
    	getByteString = getByteString & chrB(AscB(char))
    Next
end function

sub BuildUploadRequest(RequestBin)
	Dim iPos
	Dim iPosBeg
	Dim iPosEnd
	Dim iPosFile
	Dim Name
	Dim sBoundary
	Dim iBoundaryPos
	

	iPosBeg = 1
	iPosEnd = InstrB(iPosBeg,RequestBin,getByteString(chr(13)))
	sBoundary = MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg)
	iBoundaryPos = InstrB(1,RequestBin,sBoundary)
	Do until (iBoundaryPos=InstrB(RequestBin,sBoundary & getByteString("--")))
		Dim UploadControl
		Set UploadControl = CreateObject("Scripting.Dictionary")
		iPos = InstrB(iBoundaryPos,RequestBin, getByteString("Content-Disposition"))
		iPos = InstrB(iPos,RequestBin,getByteString("name="))
		iPosBeg = iPos+6
		iPosEnd = InstrB(iPosBeg,RequestBin,getByteString(chr(34)))
		sName = getString(MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg))
		iPosFile=InstrB(iBoundaryPos,RequestBin,getByteString("filename="))
		iPosBound = InstrB(iPosEnd,RequestBin,sBoundary)
		if iPosFile<>0 AND (iPosFile<iPosBound) Then
			iPosBeg = iPosFile + 10
			iPosEnd = InstrB(iPosBeg,RequestBin,getByteString(chr(34)))
			FileName = getString(MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg))
			UploadControl.Add "FileName", FileName
			iPos = InstrB(iPosEnd,RequestBin,getByteString("Content-Type:"))
			iPosBeg = iPos+14
			iPosEnd = InstrB(iPosBeg,RequestBin,getByteString(chr(13)))
			ContentType = getString(MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg))
			UploadControl.Add "ContentType",ContentType
			iPosBeg = iPosEnd+4
			iPosEnd = InstrB(iPosBeg,RequestBin,sBoundary)-2
			Value = MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg)
		Else
			iPos = InstrB(iPos,RequestBin,getByteString(chr(13)))
			iPosBeg = iPos+4
			iPosEnd = InstrB(iPosBeg,RequestBin,sBoundary)-2
			Value = getString(MidB(RequestBin,iPosBeg,iPosEnd-iPosBeg))
		End if
		UploadControl.Add "Value" , Value
		objDict.Add sName, UploadControl
		iBoundaryPos=InstrB(iBoundaryPos+LenB(sBoundary),RequestBin,sBoundary)
	Loop
end sub



function ParseFileFromPath(iStr)
    Dim tPos
    tPos = InStrRev(iStr, "\")
    if tPos = 0 Or IsNull(tPos) Then
		ParseFileFromPath = iStr
		Exit function
    End if
    ParseFileFromPath = Right(iStr, Len(iStr) - tPos)
end function

function GetFileExtension(sFile)
	GetFileExtension = Right(sFile, Len(sFile) - InStrRev(sFile, "."))
end function

' called by page code

' first called method
sub UploadSave
	Dim iBytes
	Dim binData
	iBytes = Request.TotalBytes
	binData = Request.BinaryRead(iBytes)
	call BuildUploadRequest(binData)
end sub

' saves the files to disk ; returns a matrix containing files's names
function UploadFile(sFileFields, sPath, sNewFileNames)
	Dim sFileName
	Dim sFileSpecifier
	Dim binFileContent
	Dim objFSO
	Dim objFSOFile
	

	l1 = ubound(sFileFields)
	l2 = ubound(sNewFileNames)
	Dim sFileField()
	Dim sNewFileName()
	Dim sFileNameFin()
	ReDim sFileField(l1)
	ReDim sNewFileName(l2)
	ReDim sFileNameFin(l1)

	
	for j=0 to ubound(sNewFileNames)
		sNewFileName(j) = replace(sNewFileNames(j),"&","")
	next
	
	for j=0 to ubound(sFileFields)
		sFileField(j) = replace(sFileFields(j),"&","")
	next

	for a=0 to ubound(sFileField)
	
	binFileContent = objDict.Item(sFileField(a)).Item("Value")
	sFileName = objDict.Item(sFileField(a)).Item("FileName")
	sFileName = ParseFileFromPath(sFileName)
	
	if LenB(binFileContent) > 0 then	

		If sNewFileName(a) <> "" then 
		'If len(sNewFileName(a)) > 1 Then
			sFileSpecifier = Server.MapPath(sPath & sNewFileName(a) & "." & GetFileExtension(sFileName))
			sFileName = sNewFileName(a) & "." & GetFileExtension(sFileName)
		Else
			sFileSpecifier = Server.MapPath(sPath & sFileName)
		End If
		'--------------->>>>>>
		 'response.write sFileSpecifier 
		'--------------->>>>>>
	
		Set objFSO = Server.CreateObject("Scripting.FileSystemObject")
		'If objFSO.FileExists(sFileSpecifier) Then 
			'objFSO.DeleteFile sFileSpecifier 
		'	sFileName = mid(sFileName,1,len(sFileName)-4) & "1." & GetFileExtension(sFileName)
		'	sFileSpecifier = Server.MapPath(sPath & sFileName)
		'End If
		Set objFSOFile = objFSO.CreateTextFile(sFileSpecifier, True)
		For i = 1 To LenB(binFileContent)
			objFSOFile.Write Chr(AscB(MidB(binFileContent, i, 1)))
		Next
		objFSOFile.Close
		Set objFSO = Nothing

		sFileNameFin(a) = sFileName
	else
		sFileNameFin(a) = "na"
	end if
	

	next
	UploadFile = sFileNameFin
end function

' returns the POST values ; equivalent to Request.Form which cannot be used in this case 
function UploadForm(argform)
	if objDict.Exists(argform) then
		UploadForm = objDict.Item(argform).Item("Value")
	end if
end function
%>
