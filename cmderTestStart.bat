@echo off


start "Cmder" "C:\cmder\cmder.exe" /single /x "/cmd /k  "cd %~dp0/WebSocket-APP & node server.js""


REM start "Cmder" "C:\cmder\cmder.exe" /k  "cd ./WebSocket-APP & node server.js"
REM cmder /single /x "/cmd \"c:\folder one\test.bat\""