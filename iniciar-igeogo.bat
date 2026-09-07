@echo off
REM ==========================================================
REM  Lanzador de igeogo (MVP bot de WhatsApp)
REM  Abre 2 ventanas: el servidor Node y el tunel ngrok.
REM  Deja ambas ventanas ABIERTAS mientras pruebas el bot.
REM  Para detener todo: cierra las dos ventanas.
REM ==========================================================
cd /d "%~dp0"
if not exist logs mkdir logs

echo ============================================
echo   Iniciando igeogo (servidor + tunel ngrok)
echo ============================================
echo.

REM Ventana 1: servidor Node. La salida se ve en pantalla Y se guarda en logs\server.log
start "igeogo - servidor" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%~dp0'; node src\server.js 2>&1 | Tee-Object -FilePath 'logs\server.log'"

REM Ventana 2: tunel ngrok con la URL fija (authtoken en linea para no depender del config).
start "igeogo - ngrok" powershell -NoExit -ExecutionPolicy Bypass -Command "ngrok http --authtoken 3FbrSR85SWBNPJ9dZqprIU9PiFW_5SHsD2nk5PZPPiEveKQba --url=https://dayroom-pluck-agony.ngrok-free.dev 3000"

echo Se abrieron dos ventanas:
echo   - "igeogo - servidor"  debe decir: MongoDB conectado / escuchando en 3000
echo   - "igeogo - ngrok"     debe decir: Session Status: online
echo.
echo DEJA ESAS DOS VENTANAS ABIERTAS mientras pruebas el bot.
echo Esta ventana se cierra sola en unos segundos.
timeout /t 10 >nul
