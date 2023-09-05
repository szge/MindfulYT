@echo off

REM Remove old package folder if it exists
if exist package rmdir /s /q package

REM Create a new package folder
mkdir package

REM Copy dist and images folders to the package folder
xcopy /E /I dist package\dist
xcopy /E /I icon package\icon
xcopy /E /I styles package\styles
copy manifest.json package\