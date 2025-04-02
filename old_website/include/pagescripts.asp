<%

Set PageContent = Server.CreateObject("Scripting.Dictionary")
	PageContent.Item("Texte_CMSPage") = ""
	PageContent.Item("Texte_Title") = ""

function GetPageContent(pagecode)  
		strSQL = "SELECT Page_Content,Page_Title FROM Site_Page WHERE UCASE(Page_Code)='" & ucase(pagecode) & "'"
		Set rsPages=Server.CreateObject("ADODB.Recordset")
			rsPages.Open strSQL,conex,0,1,1

			if not rsPages.bof or not rsPages.eof then
				PageContent.Item("Texte_CMSPage") = rsPages(0)
				PageContent.Item("Texte_Title") = rsPages(1)
			else
				PageContent.Item("Texte_CMSPage") = ""
				PageContent.Item("Texte_Title") = ""
			end if
	
			rsPages.close
		Set rsPages=nothing
end function

function LangText(strTextRO, strTextEN, strTextHU, strTextIT)
	LangText=eval("strText" & lang)
end function

%>