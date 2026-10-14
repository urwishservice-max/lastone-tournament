"""
LastZone DevOps Report Generator
Edits the master template DOCX (23IT723_Final_Project_Sample_Report.docx)
by replacing Digital Canteen content with LastZone content.
Preserves ALL formatting, tables, layout, and structure.
"""
import zipfile
import shutil
import os
import re
import sys

# Check dependencies
try:
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    import docx
    print(f"python-docx version: {docx.__version__}")
except ImportError:
    print("python-docx not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    print("python-docx installed successfully")

from docx import Document
from docx.shared import Inches, Pt
from copy import deepcopy
import io

TEMPLATE_PATH = "/mnt/e/naveen/refrence/23IT723_Final_Project_Sample_Report.docx"
OUTPUT_PATH = "/mnt/e/naveen/refrence/LastZone_DevOps_Report_DHARNIDHARAN_V.docx"
SCREENSHOTS_PATH = "/mnt/e/naveen/refrence/screenshots"

# ============================================================
# TEXT REPLACEMENTS: Digital Canteen -> LastZone
# ============================================================
REPLACEMENTS = [
    # Project name replacements
    ("Digital Canteen", "LastZone – Online Tournament Platform"),
    ("digital canteen", "LastZone – Online Tournament Platform"),
    ("DIGITAL CANTEEN", "LASTZONE – ONLINE TOURNAMENT PLATFORM"),
    ("Feature Vote", "LastZone – Online Tournament Platform"),
    ("FEATURE VOTE", "LASTZONE – ONLINE TOURNAMENT PLATFORM"),
    ("FeatureVote", "LastZone"),

    # Student name and roll number
    ("(Your Name)", "DHARNIDHARAN V"),
    ("Your Name", "DHARNIDHARAN V"),
    ("STUDENT NAME", "DHARNIDHARAN V"),
    # Roll number - needs careful replacement
    ("23IT[0-9]+", "2303717620521014"),  # regex handled separately

    # Technology replacements
    ("Flask", "Spring Boot 3.3.5"),
    ("Python", "Java 21 (OpenJDK)"),
    ("SQLite", "PostgreSQL 16"),
    ("canteen.db", "lastzonedb (PostgreSQL)"),
    ("SQLite database", "PostgreSQL 16 database"),
    ("Flask application", "Spring Boot application"),
    ("React.js", "React 18 + Vite 5 + TypeScript"),

    # Container / image names
    ("digital-canteen", "lastzone"),
    ("canteen-backend", "lastzone-backend"),
    ("canteen-frontend", "lastzone-frontend"),
    ("canteen-db", "lastzone-postgres"),
    ("canteen_db", "lastzone_postgres_data"),

    # Port numbers
    ("port 5000", "port 8080 (backend), port 80 (frontend)"),
    ("localhost:5000", "localhost:80"),

    # GitHub repo
    ("feature-vote", "lastone-tournament"),
    ("FEATURE-VOTE", "lastone-tournament"),

    # Food ordering content
    ("food ordering", "zombie survival tournament gameplay"),
    ("Food Ordering", "Zombie Survival Tournament"),
    ("food items", "game scores and leaderboard entries"),
    ("food menu", "tournament leaderboard"),
    ("shopping cart", "game run session"),
    ("order management", "run and score management"),
    ("admin dashboard", "leaderboard dashboard"),
    ("canteen staff", "game administrator"),
    ("canteen admin", "tournament administrator"),
    ("menu items", "tournament participants"),
    ("place order", "submit game score"),
    ("Food item", "Game score entry"),

    # Abstract text
    (
        "aims to digitize the canteen ordering process",
        "is a web-based competitive zombie survival tournament platform featuring a Unity WebGL game engine, "
        "a React/Vite/TypeScript frontend, a Spring Boot 3.3.5 REST API backend, and a PostgreSQL 16 database"
    ),
]

# Text that maps section content to LastZone equivalents
SECTION_TEXT_MAP = {
    "ABSTRACT": """
LastZone – Online Tournament Platform is a full-stack, enterprise-grade competitive gaming platform that integrates 
a Unity WebGL 3D zombie survival game with a modern React/Vite/TypeScript frontend and a robust Spring Boot 3.3.5 
REST API backend. The platform provides secure user registration, JWT-based authentication, cryptographic game-run 
token verification, and a live real-time tournament leaderboard. Player scores are persisted in a PostgreSQL 16 
database housed within a Docker container with named volumes, ensuring data survives restarts and redeployments.

The DevOps implementation encompasses a complete CI/CD pipeline using Jenkins, multi-stage Docker image builds, 
Docker Compose service orchestration, automated integration testing via Spring Boot Test and MockMvc, Ansible 
infrastructure-as-code automation, Git branching and merge-conflict resolution workflows, and automated PostgreSQL 
backup mechanisms. All deployment automation is version-controlled in the GitHub repository 
https://github.com/urwishservice-max/lastone-tournament on branch main.
""",

    "INTRODUCTION": """
LastZone is a competitive online zombie survival tournament platform that challenges players to achieve the highest 
score across multiple survival waves. The platform combines high-fidelity 3D Unity WebGL gameplay with a 
production-grade cloud-ready architecture implementing modern DevOps principles.

The application provides secure player registration, BCrypt password hashing, JWT token-based session management, 
and an anti-cheat cryptographic run-token mechanism that prevents score tampering. Each game session begins with 
a unique server-generated runToken; score submission is accepted only once per token, with duplicate submissions 
returning HTTP 409 Conflict.

This project serves as a comprehensive DevOps laboratory implementation demonstrating: Git version control with 
feature branching and merge-conflict resolution, Jenkins CI/CD pipeline with automated testing, Docker multi-stage 
image builds and container orchestration, Ansible playbook automation, and PostgreSQL persistent data storage 
with automated backup procedures.
""",

    "OBJECTIVES": """
1. Build a competitive online tournament platform combining Unity WebGL gameplay with a secure backend REST API.
2. Implement a JWT-authenticated user registration and login system with BCrypt password hashing.
3. Provide a cryptographic anti-cheat run-token mechanism preventing score manipulation.
4. Deploy the application as a three-tier containerized fleet: Nginx frontend, Spring Boot backend, and PostgreSQL database.
5. Configure a Jenkins CI/CD pipeline with automated integration tests, Docker builds, and deployment verification.
6. Demonstrate Git branching, merge-conflict resolution, and clean Conventional Commits commit history.
7. Implement Ansible infrastructure-as-code for repeatable idempotent deployment automation.
8. Ensure PostgreSQL data persistence across container restarts using named Docker volumes.
9. Document automated timestamped database backup and recovery procedures.
10. Serve a 396 MB Unity WebGL binary efficiently using Nginx with MIME types, HTTP Range requests, and immutable caching.
""",
}


def replace_text_in_paragraph(para, old, new):
    """Replace text preserving run formatting."""
    if old.lower() in para.text.lower():
        for run in para.runs:
            if old.lower() in run.text.lower():
                run.text = run.text.replace(old, new)
                ci = re.compile(re.escape(old), re.IGNORECASE)
                run.text = ci.sub(new, run.text)


def replace_all_text(doc, replacements):
    """Apply text replacements across all paragraphs and table cells."""
    replaced_count = 0

    def process_para(para):
        nonlocal replaced_count
        for old, new in replacements:
            if old.lower() in para.text.lower():
                for run in para.runs:
                    ci = re.compile(re.escape(old), re.IGNORECASE)
                    new_text = ci.sub(new, run.text)
                    if new_text != run.text:
                        run.text = new_text
                        replaced_count += 1

    # Process all paragraphs
    for para in doc.paragraphs:
        process_para(para)

    # Process all table cells
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    process_para(para)

    return replaced_count


def update_cover_page(doc):
    """Update student name and roll number on cover page."""
    for para in doc.paragraphs[:40]:  # Cover is in first ~40 paragraphs
        text = para.text.strip()

        # Look for roll number pattern
        if re.search(r'\d{16}', text) or 'roll' in text.lower():
            for run in para.runs:
                if re.search(r'\d{10,}', run.text):
                    run.text = re.sub(r'\d{10,}', '2303717620521014', run.text)

        # Look for name placeholder
        if any(x in text for x in ['Name', 'STUDENT', 'name:']):
            full = para.text
            if 'dharni' not in full.lower() and 'dharni' not in full.lower():
                for run in para.runs:
                    if 'name' in run.text.lower() or run.text.strip() == '':
                        pass  # Preserve structure


def print_doc_structure(doc):
    """Print the document structure for debugging."""
    print("\n=== DOCUMENT STRUCTURE (First 60 paragraphs) ===")
    for i, para in enumerate(doc.paragraphs[:60]):
        text = para.text.strip()
        if text:
            style = para.style.name if para.style else "None"
            print(f"[{i:3d}] [{style:20s}] {text[:80]}")
    print("=== END STRUCTURE ===\n")


def main():
    print(f"Loading template: {TEMPLATE_PATH}")
    doc = Document(TEMPLATE_PATH)

    print_doc_structure(doc)

    # Count images in document
    image_count = 0
    for rel in doc.part.rels.values():
        if "image" in rel.reltype:
            image_count += 1
    print(f"\nFound {image_count} embedded images in document")

    # Count tables
    print(f"Found {len(doc.tables)} tables in document")

    # Apply text replacements
    print("\nApplying text replacements...")
    count = replace_all_text(doc, REPLACEMENTS)
    print(f"Applied {count} replacements")

    # Save
    print(f"\nSaving to: {OUTPUT_PATH}")
    doc.save(OUTPUT_PATH)
    print("Saved successfully!")
    print("\nDocument statistics:")
    print(f"  Paragraphs: {len(doc.paragraphs)}")
    print(f"  Tables: {len(doc.tables)}")
    print(f"  Images: {image_count}")


if __name__ == "__main__":
    main()
