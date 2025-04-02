<%Function SendMail_ASPMail(FromAddress, FromName, RecipientEmail, MailSubject, MailContent, DirAttach, FileAttach)
	Set Mailer = Server.CreateObject("SMTPsvg.Mailer")
	Mailer.ContentType= "text/html"
	Mailer.TimeOut	= 120
	Mailer.FromName   = FromName
	Mailer.FromAddress= FromAddress
	Mailer.RemoteHost = "mail.easycgi.com"
	Mailer.AddRecipient RecipientEmail, RecipientEmail
	Mailer.Subject    = MailSubject
	Mailer.BodyText   = MailContent
	if DirAttach<>"" then
		For i=0 to ubound(FileAttach)
			if FileAttach(i) <> "na" then
				Mailer.AddAttachment  DirAttach &  FileAttach(i) 
			end if
		Next
	end if
	if Mailer.SendMail then
	  SendMail_ASPMail = True
	else
	  SendMail_ASPMail = False
	end if
End Function

Function SendMail_CDonts(FromAddress, FromName, RecipientEmail, MailSubject, MailContent)
	Set Mailer = Server.CreateObject("CDONTS.NewMail")
	Mailer.BodyFormat = 0
	Mailer.MailFormat = 0
	Mailer.From = FromAddress
	Mailer.To = RecipientEmail
	Mailer.Subject = MailSubject
	Mailer.Body = MailContent
	Mailer.Send
	Set Mailer = Nothing
	SendMail_CDonts = True
End Function

Function SendMail_ASPEMail(FromAddress, FromName, RecipientEmail, MailSubject, MailContent, DirAttach, FileAttach)
	Set Mailer = Server.CreateObject("Persits.MailSender")
	Mailer.IsHTML = True 
	Mailer.TimeOut	= 120
	Mailer.FromName   = FromName
	Mailer.From = FromAddress
	Mailer.Host = "mail.easycgi.com"
	Mailer.AddAddress RecipientEmail, RecipientEmail
	Mailer.Subject    = MailSubject
	Mailer.Body   = MailContent
	if DirAttach<>"" then
		For i=0 to ubound(FileAttach)
			if FileAttach(i) <> "na" then
				Mailer.AddAttachment  DirAttach &  FileAttach(i) 
			end if
		Next
	end if
'	On Error Resume Next 
	Mailer.Send
	if Err <> 0 then
	  SendMail_ASPEMail = True
	else
	  SendMail_ASPEMail = False
	end if
'	on error goto 0
End Function

function SendEmails(fromName,fromAdresse,toName,toAdresse,emailSubject,emailBody)
Set Mailer = Server.CreateObject("Persits.MailSender")
Mailer.FromName   = fromName
Mailer.From= fromAdresse
Mailer.Host = "mail.easycgi.com"
Mailer.AddAddress toName, toAdresse
Mailer.Subject    = emailSubject
Mailer.Body   = emailBody
Mailer.IsHTML  = true
Mailer.Timeout=60
if Mailer.Send then
	SendEmails=""
else
	SendEmails=Mailer.Response
end if
set Mailer=Nothing
end function

%>