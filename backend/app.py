"""
FastAPI backend for Claude SEO Auditor.
Run with: uvicorn app:app --reload  (from the backend/ folder)
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from seo_runner import run_audit
from pdf_generator import generate_pdf

app = FastAPI(title="Claude SEO Auditor API", version="1.0.0")

# Allow the frontend (served from file:// or a local dev server) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Claude SEO Auditor API is running. GET /audit?url=https://example.com"}


@app.get("/audit")
def audit(url: str):
    """Run a full SEO audit on the provided URL and return JSON results."""
    if not url:
        raise HTTPException(status_code=400, detail="url parameter is required")
    result = run_audit(url)
    if "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])
    return result


@app.get("/audit-pdf")
def audit_pdf(url: str):
    """Run a full SEO audit and return a downloadable PDF report."""
    if not url:
        raise HTTPException(status_code=400, detail="url parameter is required")
    result = run_audit(url)
    if "error" in result:
        raise HTTPException(status_code=502, detail=result["error"])

    # Change working dir to backend so reports/ lands in the right place
    original_dir = os.getcwd()
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    try:
        pdf_path = generate_pdf(url, result)
    finally:
        os.chdir(original_dir)

    abs_path = os.path.join(backend_dir, pdf_path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=500, detail="PDF generation failed")

    return FileResponse(
        abs_path,
        media_type="application/pdf",
        filename=os.path.basename(abs_path),
    )
