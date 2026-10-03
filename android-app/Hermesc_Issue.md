If you get hermesc issue in windows
- RNWoF\M\android\app\build.gradle

```
/* Hermes Commands */
def hermescBin = org.gradle.internal.os.OperatingSystem.current().isWindows() ? "hermesc.exe" : "hermesc"
hermesCommand = "node_modules/hermes-compiler/hermesc/%OS-BIN%/" + hermescBin
```

- create hermesc.cmd under android folder
```
@echo off
REM Wrapper script to run the Linux hermesc binary via WSL on Windows.
REM This is needed because hermes-compiler does not ship a Windows binary.

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"

REM Resolve hermesc Linux binary path
for /f "usebackq tokens=*" %%i in (`wsl wslpath -u "%SCRIPT_DIR%..\node_modules\hermes-compiler\hermesc\linux64-bin\hermesc"`) do set "HERMESC_PATH=%%i"

REM Build argument list, converting backslashes to forward slashes for WSL
set "ARGS="
:argloop
if "%~1"=="" goto :run
set "ARG=%~1"

REM Replace backslashes with forward slashes so WSL treats them as path separators
set "ARG=!ARG:\=/!"

REM Convert absolute Windows paths (e.g. C:/...) to WSL paths
echo !ARG! | findstr /r "^[A-Za-z]:/" >nul 2>&1
if !errorlevel!==0 (
    REM Convert back to backslash temporarily for wslpath
    set "WINARG=!ARG:/=\!"
    for /f "usebackq tokens=*" %%i in (`wsl wslpath -u "!WINARG!"`) do set "ARG=%%i"
)

if defined ARGS (
    set "ARGS=!ARGS! !ARG!"
) else (
    set "ARGS=!ARG!"
)
shift
goto :argloop

:run
wsl !HERMESC_PATH! !ARGS!
exit /b %errorlevel%

```

- package.json

```
"dependencies": {
    ...
    "hermes-compiler": "0.16.0-commitly-202602131951-703589f79",
    ...
  },
```