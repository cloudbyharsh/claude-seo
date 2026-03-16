@echo off
echo =============================================
echo   Claude SEO Auditor - Starting Backend
echo =============================================

cd /d "%~dp0backend"

echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install from https://python.org
    pause
    exit /b 1
)

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo Starting API server at http://localhost:8000
echo Open frontend\index.html in your browser
echo Press Ctrl+C to stop.
echo.

uvicorn app:app --reload --host 0.0.0.0 --port 8000
pause
