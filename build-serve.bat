@echo off
setlocal ENABLEDELAYEDEXPANSION

rem Change to script directory (project root)
cd /d %~dp0

echo [1/3] Installing deps (if needed)...
call pnpm install
if errorlevel 1 goto :error

echo [2/3] Building site...
call pnpm build
if errorlevel 1 goto :error

echo [3/3] Serving dist on http://localhost:8024 ...
call npx --yes serve dist -l 8024
goto :eof

:error
echo Build or serve failed. See messages above.
exit /b 1


