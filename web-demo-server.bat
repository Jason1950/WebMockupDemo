@echo off



:: ****       ngrok 開通 3030 port 給遠端url連結  for Websocket監聽           ****    // cd 到 ngrok ，執行 ngrok http 3030 port 給 websocket 用 

start cmd /k %cd%\ngrok\ngrok.exe http --region=us --hostname=itri-router-sstc.ngrok.io 3030




:: ****     ngrok 開通 800 port 給遠端url連結  for Web mokup Client端使用     ****

start cmd /k %cd%\ngrok\ngrok.exe http --region=us -hostname=itri-webgl-sstc.ngrok.io  8090




:: ****       透過 node 啟動 server.js : 3030 port 作為監聽的server           ****

start cmd /k  "cd ./WebSocket-APP & node server.js"





:: ****     透過 lite-server 建立 Web mokup Client server ，Port為8090        ****

start cmd /k  "cd ./Web-Mockup & lite-server -c=config.json"





:: ****     透過 lite-server 建立 Web mokup Scene server ，Port為8080        ****

start cmd /k  "cd ./Web-Mockup-Scene & lite-server -c=config.json"
