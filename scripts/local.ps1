$ErrorActionPreference = 'Stop'

Write-Host "Starting SportsIntelAI local dev..." -ForegroundColor Cyan

# Backend
Push-Location "$PSScriptRoot\..\backend"
if (-not (Test-Path .venv)) { py -3 -m venv .venv }
& .\.venv\Scripts\python -m ensurepip --upgrade | Out-Null
& .\.venv\Scripts\python -m pip install --upgrade pip | Out-Null
& .\.venv\Scripts\python -m pip install -r requirements.txt | Out-Null
Start-Process -WindowStyle Hidden -FilePath .\.venv\Scripts\python.exe -ArgumentList '-m','uvicorn','main:app','--host','127.0.0.1','--port','8001','--reload' | Out-Null
Pop-Location

# Frontend + Netlify
Push-Location "$PSScriptRoot\.."
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null
npm install --no-fund --no-audit | Out-Null
Start-Process -WindowStyle Hidden powershell -ArgumentList '-NoProfile','-Command','npx --yes netlify-cli@latest dev --port 8888 --target-port 3000' | Out-Null
Pop-Location

Start-Sleep -Seconds 4
Start-Process "http://localhost:8888/dashboard"
Write-Host "Local dev started: http://localhost:8888 (dashboard at /dashboard)" -ForegroundColor Green


