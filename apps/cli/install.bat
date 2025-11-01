@echo off

echo.
echo ========================================
echo   Brebaje CLI Installation for Windows
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if errorlevel 1 (
    echo ERROR: This script requires administrator privileges.
    echo Please right-click and select "Run as administrator"
    pause
    exit /b 1
)

REM Get current directory
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%

echo Current project directory: %PROJECT_DIR%

REM Check if WSL is already installed
echo Checking WSL installation...
wsl --list >nul 2>&1
if errorlevel 1 (
    echo WSL is not installed. Installing WSL2 with Ubuntu...
    echo.
    echo NOTE: This may require a system restart.
    echo After restart, please run this script again.
    echo.
    
    wsl --install -d Ubuntu
    
    if errorlevel 1 (
        echo ERROR: Failed to install WSL2
        echo Please install WSL2 manually
        pause
        exit /b 1
    )
    
    echo.
    echo WSL2 installation initiated. 
    echo Please restart your computer and run this script again.
    pause
    exit /b 0
)

echo WSL is already installed.

REM Check for any WSL distributions
echo Checking Ubuntu distribution...
wsl --list >nul 2>&1
if errorlevel 1 (
    echo No WSL distributions found. Installing Ubuntu...
    wsl --install -d Ubuntu
    
    if errorlevel 1 (
        echo ERROR: Ubuntu installation failed
        echo Try manually: wsl --install -d Ubuntu
        pause
        exit /b 1
    )
    
    echo Ubuntu installation initiated.
    echo Please complete Ubuntu setup and run this script again.
    pause
    exit /b 0
)

REM Check specifically for Ubuntu
wsl -l -v > wsl_check.txt 2>&1
type wsl_check.txt | find /i "ubuntu" >nul
if errorlevel 1 (
    echo Ubuntu not found in installed distributions.
    echo Available distributions:
    type wsl_check.txt
    echo.
    echo Installing Ubuntu...
    wsl --install -d Ubuntu
    
    if errorlevel 1 (
        echo ERROR: Ubuntu installation failed
        echo Try manually: wsl --install -d Ubuntu
        pause
        exit /b 1
    )
    
    echo Please complete Ubuntu setup and run this script again.
    pause
    exit /b 0
)

del wsl_check.txt
echo Ubuntu found!

REM Convert Windows path to WSL path
set "WSL_PATH=/mnt/c%PROJECT_DIR:~2%"
set "WSL_PATH=%WSL_PATH:\=/%"

echo.
echo Converting Windows path to WSL path:
echo Windows: %PROJECT_DIR%
echo WSL:     %WSL_PATH%

REM Check if install.sh exists
if not exist "%PROJECT_DIR%install.sh" (
    echo ERROR: install.sh not found in %PROJECT_DIR%
    echo Make sure you're running this script from the correct directory.
    pause
    exit /b 1
)

echo.
echo Starting Brebaje CLI installation in WSL...
echo ==========================================

REM Execute the bash installer in WSL
wsl bash -c "cd '%WSL_PATH%' && echo 'Current WSL directory:' && pwd && echo 'Running install.sh...' && bash install.sh"

if errorlevel 1 (
    echo.
    echo ERROR: Installation failed in WSL environment
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo You can now use brebaje-cli from WSL:
echo 1. Open WSL terminal: wsl
echo 2. Run: brebaje-cli --help
echo.
echo Or create a Windows shortcut with:
echo wsl brebaje-cli
echo.
pause