@echo off
set all=%1

del theme.list /Q
dir /b "../src/themes/" > theme.list
cd ..

if "%all%" == "all" (echo Build all themes and prepare the deploy) 

for /f "usebackq delims=" %%F in (deploy\theme.list) DO (	
	REM echo "%%F" -OutputDirectory %%~dpF    
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

echo material-design-lite
SET /P Proceed=Do you want to proceed (Y/N)?
if /i {%Proceed%}=={y} (GOTO :NextMDL)
if /i {%Proceed%}=={yes} (GOTO :NextMDL)
GOTO :QGastro

:NextMDL
call gulp dist --theme material-design-lite --baseUrl "/angularjs/starterkit-blog-themes/material-design-lite/"

:QGastro
echo gastro-thumbnail
SET /P Proceed=Do you want to proceed (Y/N)?
if /i {%Proceed%}=={y} (GOTO :NextGastro)
if /i {%Proceed%}=={yes} (GOTO :NextGastro)
GOTO :QSpaceMinimal

:NextGastro
call gulp dist --theme gastro-thumbnail --baseUrl "/angularjs/starterkit-blog-themes/gastro-thumbnail/"

:QSpaceMinimal
echo space-minimal
SET /P Proceed=Do you want to proceed (Y/N)?
if /i {%Proceed%}=={y} (GOTO :NextSpaceMinimal)
if /i {%Proceed%}=={yes} (GOTO :NextSpaceMinimal)
GOTO :QSpaceThumb

:NextSpaceMinimal
call gulp dist --theme space-minimal --baseUrl "/angularjs/starterkit-blog-themes/space-minimal/"

:QSpaceThumb
echo space-thumbnail
SET /P Proceed=Do you want to proceed (Y/N)?
if /i {%Proceed%}=={y} (GOTO :NextSpaceThumb)
if /i {%Proceed%}=={yes} (GOTO :NextSpaceThumb)
GOTO :QSpaceTiles

:NextSpaceThumb
call gulp dist --theme space-thumbnail --baseUrl "/angularjs/starterkit-blog-themes/space-thumbnail/"

:QSpaceTiles
echo space-tiles
SET /P Proceed=Do you want to proceed (Y/N)?
if /i {%Proceed%}=={y} (GOTO :NextSpaceTiles)
if /i {%Proceed%}=={yes} (GOTO :NextSpaceTiles)
GOTO :End

:NextSpaceTiles
call gulp dist --theme space-tiles --baseUrl "/angularjs/starterkit-blog-themes/space-tiles/"

REM SET /P Proceed=Do you want to proceed (Y/N)?
REM if /i {%Proceed%}=={y} (GOTO :NextSpaceTiles)
REM if /i {%Proceed%}=={yes} (GOTO :NextSpaceTiles)
REM GOTO :End


:End