@echo off
set all=%1

del theme.list /Q
dir /b "../src/themes/" > theme.list
cd ..

rd "deploy\starter-kit-deploy\angularjs\starterkit-blog-themes\" /S /Q
md "deploy\starter-kit-deploy\angularjs\starterkit-blog-themes\" 

if "%all%" == "all" (echo Build all themes and prepare the deploy) 

for /f "usebackq delims=" %%F in (deploy\theme.list) DO (		
    call :subroutine "%%F" "%all%"
)
cd deploy
GOTO :End

:subroutine
    echo %1
    if %2 == "all" (GOTO :Run)
    SET /P Proceed=Do you want to proceed (Y/N)
    if /i {%Proceed%}=={y} (GOTO :Run)
    if /i {%Proceed%}=={yes} (GOTO :Run)
    GOTO :Skip

    :Run    
    echo gulp %1
    call gulp dist --theme %1 --baseUrl "/angularjs/starterkit-blog-themes/%1/"
    rd "deploy\starter-kit-deploy\angularjs\starterkit-blog-themes\%1\" /S /Q
    md "deploy\starter-kit-deploy\angularjs\starterkit-blog-themes\%1\"
    xcopy "dist\*.*" "deploy\starter-kit-deploy\angularjs\starterkit-blog-themes\%1\" /Y /D /E /I /Q      
    :Skip

GOTO :End

:End