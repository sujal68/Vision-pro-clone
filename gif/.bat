@echo off
setlocal enabledelayedexpansion
set count=1

for %%f in (*.jpg) do (
    set "num=00!count!"
    set "num=!num:~-3!"
    ren "%%f" "!num!.jpg"
    set /a count+=1
)