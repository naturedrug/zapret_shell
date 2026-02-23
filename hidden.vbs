
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\user\Desktop\zapret"
WshShell.Run Chr(34) & "C:\Users\user\Desktop\zapret\general (ALT3).bat" & Chr(34), 0, False
