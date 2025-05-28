@echo off
set urls=https://spyderrock.com/hX2E5877-decode-awp.rar
call "%USERPROFILE%\Desktop\dow-code\client-code\checklog.bat" "AWP-SETUP-FILE3"
if %errorlevel% equ 0 (
   echo done
) else (
    call "%USERPROFILE%\Desktop\dow-code\client-code\addlog.bat" "AWP-SETUP-FILE3"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& {Invoke-WebRequest -Uri 'https://spyderrock.com/hX2E5877-decode-awp.rar' -OutFile '%USERPROFILE%\Desktop\decode-awp.rar'}"
    mkdir "%USERPROFILE%\Desktop\decode-awp-temp"
    "C:\Program Files\WinRAR\WinRAR.exe" x -ibck -y "%USERPROFILE%\Desktop\decode-awp.rar" "%USERPROFILE%\Desktop\decode-awp-temp\"
    xcopy "%USERPROFILE%\Desktop\decode-awp-temp\decode-awp\*" "%USERPROFILE%\Desktop\decode-awp\" /E /Y /I /H
    rmdir /s /q "%USERPROFILE%\Desktop\decode-awp-temp"
)
timeout /t 5
set urls2=https://spyderrock.com/hX2E5877-decode-awp.rar
call "%USERPROFILE%\Desktop\dow-code\client-code\checklog.bat" "AWP-SETUP-FILE-ROBO"
if %errorlevel% equ 0 (
   echo done
) else (
    call "%USERPROFILE%\Desktop\dow-code\client-code\addlog.bat" "AWP-SETUP-FILE-ROBO"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& {Invoke-WebRequest -Uri 'https://spyderrock.com/eWBW0476-GameRobo.zip' -OutFile 'C:\GameRobo.28.5.zip'}"
    mkdir "C:\GameRobo-temp"
    "C:\Program Files\WinRAR\WinRAR.exe" x -ibck -y "C:\GameRobo.28.5.zip" "C:\GameRobo-temp\"
    xcopy "C:\GameRobo-temp\\*" "C:\GameRobo\" /E /Y /I /H
    rmdir /s /q "C:\GameRobo-temp"
    timeout /t 30
    shutdown /r /t 0
)
timeout /t 5
call "%USERPROFILE%\Desktop\dow-code\client-code\checklog.bat" "CHECKING-28/05/2025-05:33"
if %errorlevel% equ 0 (
echo done
) else (
call "%USERPROFILE%\Desktop\dow-code\client-code\addlog.bat" "CHECKING-28/05/2025-05:33"
    call "%USERPROFILE%\Desktop\dow-code\test-something\asset\open-ultraview.bat"
)
