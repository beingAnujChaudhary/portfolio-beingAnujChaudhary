import os
import re
import markdown

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes"
ml_dir = os.path.join(base_dir, "machineLearningNotes")

pages = [
    {"md": "ml_raw.md", "html": "0.1_machine_learning.html", "title": "1. Machine Learning Foundation", "icon": "fa-robot"},
    {"md": "0.2_regression.md", "html": "0.2_regression.html", "title": "2. Regression", "icon": "fa-chart-line"},
    {"md": "0.3_simple_linear_regression.md", "html": "0.3_simple_linear_regression.html", "title": "3. Simple Linear Regression", "icon": "fa-chart-bar"},
]

def replace_callout(match):
    type_str = match.group(1).upper()
    content_raw = match.group(2)
    content = re.sub(r'^>\s*', '', content_raw, flags=re.MULTILINE)
    
    if type_str in ["IMPORTANT", "WARNING"]:
        css_class = "warning"
        icon = "⚠️"
        title = "Important"
    elif type_str == "TIP":
        css_class = "example"
        icon = "💡"
        title = "Tip"
    else:
        css_class = "memory"
        icon = "🧠"
        title = "Note"

    return f"""<div class="callout {css_class}">
<span class="callout-icon">{icon}</span>
<div class="callout-content" markdown="1">
<div class="callout-title">{title}</div>
{content}
</div>
</div>"""

md = markdown.Markdown(
    extensions=['tables', 'fenced_code', 'mdx_math', 'md_in_html', 'toc', 'attr_list'],
    extension_configs={
        'mdx_math': {'enable_dollar_delimiter': True}
    }
)

for page in pages:
    md_path = os.path.join(ml_dir, page["md"])
    if not os.path.exists(md_path):
        print(f"Skipping {md_path}, not found.")
        continue

    with open(md_path, "r", encoding="utf-8") as f:
        text = f.read()

    text = re.sub(r'>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\n((?:>.*\n?)+)', replace_callout, text)

    html_notes = md.convert(text)
    html_notes = re.sub(r'<pre><code class="language-mermaid">([\s\S]*?)</code></pre>', r'<div class="mermaid">\1</div>', html_notes)

    # Generate the nav links
    nav_links = ""
    for p in pages:
        active_style = "font-weight:bold; color:var(--accent-primary);" if p['html'] == page['html'] else "color:inherit;"
        nav_links += f'<li><a href="{p["html"]}" style="text-decoration:none; display:block; {active_style}"><i class="fa-solid {p["icon"]}" style="width:20px;"></i> {p["title"]}</a></li>\n                    '

    template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page["title"]} - Anuj's Notes</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>mermaid.initialize({{startOnLoad:true}});</script>
    <!-- MathJax for rendering math equations -->
    <script>
    MathJax = {{
      tex: {{
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]
      }}
    }};
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <link rel="stylesheet" href="../flashcards.css">
    <link rel="icon" type="image/png" href="/assets/images/favicon_circular.png">
    <style>
        .note-content table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            background: white;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border-radius: 12px;
            overflow: hidden;
        }}
        .note-content th {{
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-weight: 600;
            text-align: left;
            padding: 1rem;
        }}
        .note-content td {{
            padding: 1rem;
            border-top: 1px solid var(--card-border);
            color: var(--text-secondary);
        }}
        body {{
            /* Create a colorful gradient background for glassmorphism to reflect */
            background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%) !important;
            color: #111 !important;
            background-attachment: fixed !important;
        }}
        
        /* Glassmorphism overrides */
        .sidebar, .note-card, .content-area {{
            background: rgba(255, 255, 255, 0.4) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255, 255, 255, 0.6) !important;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1) !important;
            border-radius: 1.25rem !important;
        }}

        /* Make sure cards inside don't double up too heavily unless intended */
        .note-card {{
            margin-bottom: 2rem;
            padding: 2rem;
        }}

        .content-area {{
            padding: 2rem !important;
        }}

        p, li {{
            color: #111 !important;
            font-weight: 400;
        }}
        mjx-container {{
            font-weight: 800 !important;
            color: #000;
        }}
        
        /* Modern Typography enhancements */
        h1, h2, h3, h4 {{
            color: #000 !important;
            font-weight: 600 !important;
            letter-spacing: -0.02em;
        }}
        
        /* Glassmorphism tables */
        .note-content table {{
            background: rgba(255, 255, 255, 0.3) !important;
            backdrop-filter: blur(8px) !important;
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
        }}
        .note-content th {{
            background: rgba(255, 255, 255, 0.5) !important;
        }}
    </style>
</head>
<body>
    <div class="app-container">
        <aside class="sidebar">
            <div class="logo">
                <h1><a href="../anujsNotes.html" style="text-decoration:none;color:inherit;">Anuj's Notes</a></h1>
            </div>
            <nav class="nav-menu">
                <h2 style="margin-top:0.5rem; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">Main Hub</h2>
                <ul id="subject-list">
                    <li><a href="../anujsNotes.html" style="text-decoration:none;color:inherit;display:block;"><i class="fa-solid fa-house" style="width:20px;"></i> Overview</a></li>
                </ul>

                <h2 style="margin-top:1.5rem; font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">MACHINE LEARNING NOTES</h2>
                <ul id="subject-list">
                    {nav_links}
                </ul>
            </nav>
        </aside>

        <main class="main-content">
            <header class="top-header">
                <h2 id="current-title">{page["title"]}</h2>
            </header>

            <div class="content-area" id="main-view">
                <div class="view-container">
                    <div class="notes-section">
                        <div class="note-card">
                            <div class="note-content">
{html_notes}
                            </div>
                        </div>
                    </div>

                    <!-- LINK TO DEDICATED FLASHCARDS -->
                    <div class="note-card" style="text-align:center; padding: 3rem 2rem; margin-top:2rem; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border:none;">
                        <h2 style="color:#3730a3; font-size:1.8rem; margin-bottom:1rem;">Master this Topic</h2>
                        <p style="color:#4f46e5; margin-bottom:2rem;">Practice with our interactive, full-screen Quizlet-style flashcards!</p>
                        <a href="flashcardforml1.html" style="display:inline-block; background:#4f46e5; color:white; padding:1rem 2rem; border-radius:12px; font-weight:bold; font-size:1.2rem; text-decoration:none; box-shadow:0 4px 14px rgba(79,70,229,0.4); transition:transform 0.2s;">
                            <i class="fa-solid fa-layer-group" style="margin-right:0.5rem;"></i> Practice Flashcards ➔
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script src="../app.js"></script>
</body>
</html>
"""
    output_path = os.path.join(ml_dir, page["html"])
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(template)
    print(f"Successfully generated {output_path}")
