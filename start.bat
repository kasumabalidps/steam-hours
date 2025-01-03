@echo off
cls
color 0A

echo ╔════════════════════════════════════════════╗
echo ║         Steam Bot - Installation           ║
echo ╚════════════════════════════════════════════╝

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo Error: npm is not installed!
    echo Please install npm and try again
    pause
    exit /b 1
)

if not exist "node_modules\" (
    goto :install_deps
) else (
    for %%i in (package.json) do set package_time=%%~ti
    for %%i in (node_modules) do set modules_time=%%~ti
    if "!package_time!" gtr "!modules_time!" goto :install_deps
)
goto :check_config

:install_deps
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!

:check_config
if not exist "config.json" (
    color 0C
    echo Error: config.json not found!
    echo Please ensure config.json exists in the root directory
    pause
    exit /b 1
)

echo Starting Steam Bot...
node bot.js
pause 