import os
import re
import html
import json
import markdown

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes"
ml_dir = os.path.join(base_dir, "machineLearningNotes")

pages = [
    {"ipynb": "1_machine_learning.ipynb", "html": "1_machine_learning.html", "title": "1. Machine Learning Foundation", "icon": "fa-robot"},
    {"ipynb": "2_regression.ipynb", "html": "2_regression.html", "title": "2. Regression", "icon": "fa-chart-line"},
    {"ipynb": "3_simple_linear_regression.ipynb", "html": "3_simple_linear_regression.html", "title": "3. Simple Linear Regression", "icon": "fa-chart-bar"},
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

def unescape_mermaid(match):
    return f'<div class="mermaid">\n{html.unescape(match.group(1))}\n</div>'

for page in pages:
    ipynb_path = os.path.join(ml_dir, page["ipynb"])
    if not os.path.exists(ipynb_path):
        print(f"Skipping {ipynb_path}, not found.")
        continue

    with open(ipynb_path, "r", encoding="utf-8") as f:
        nb = json.load(f)

    html_notes = ""
    for cell in nb.get("cells", []):
        if cell["cell_type"] == "markdown":
            source = "".join(cell.get("source", []))
            source = re.sub(r'>\s*\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]\n((?:>.*\n?)+)', replace_callout, source)
            cell_html = md.convert(source)
            cell_html = re.sub(r'<pre><code class="language-mermaid">([\s\S]*?)</code></pre>', unescape_mermaid, cell_html)
            html_notes += f'<div class="markdown-cell">\n{cell_html}\n</div>\n'
        elif cell["cell_type"] == "code":
            source = "".join(cell.get("source", []))
            escaped_source = html.escape(source)
            html_notes += f'<div class="code-cell" style="background-color: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; margin: 1rem 0;"><pre><code class="language-python" style="color: #a5d6ff;">{escaped_source}</code></pre></div>\n'
            
            # Render outputs
            for output in cell.get("outputs", []):
                if output.get("output_type") == "error":
                    continue # Ignore errors from pseudo-code blocks
                elif output.get("output_type") == "stream":
                    text = "".join(output.get("text", []))
                    html_notes += f'<div class="output-stream" style="background: rgba(0,0,0,0.3); color: #d4d4d4; padding: 1rem; border-radius: 8px; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; white-space: pre-wrap; font-size: 0.9em;">{html.escape(text)}</div>\n'
                elif output.get("output_type") in ["display_data", "execute_result"]:
                    data = output.get("data", {})
                    if "image/png" in data:
                        img_b64 = data["image/png"].strip()
                        html_notes += f'<div class="output-image" style="margin: 1rem 0; text-align: center;"><img src="data:image/png;base64,{img_b64}" alt="Output Chart" style="max-width: 100%; border-radius: 8px; border: 1px solid var(--card-border);"></div>\n'
                    elif "text/html" in data:
                        html_content = "".join(data["text/html"])
                        html_notes += f'<div class="output-html" style="margin: 1rem 0; background: white; padding: 1rem; border-radius: 8px;">{html_content}</div>\n'
                    elif "text/plain" in data:
                        text = "".join(data["text/plain"])
                        html_notes += f'<div class="output-text" style="background: rgba(0,0,0,0.3); color: #d4d4d4; padding: 1rem; border-radius: 8px; margin-top: -0.5rem; margin-bottom: 1rem; font-family: monospace; white-space: pre-wrap; font-size: 0.9em;">{html.escape(text)}</div>\n'

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
      }},
      options: {{
        renderActions: {{
          findScript: [10, function (doc) {{
            document.querySelectorAll('script[type^="math/tex"]').forEach(function(node) {{
              var display = !!node.type.match(/; *mode=display/);
              var math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
              var text = document.createTextNode('');
              node.parentNode.replaceChild(text, node);
              math.start = {{node: text, delim: '', n: 0}};
              math.end = {{node: text, delim: '', n: 0}};
              doc.math.push(math);
            }});
          }}, '']
        }}
      }}
    }};
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <link rel="stylesheet" href="../flashcards.css">
    <link rel="icon" type="image/png" href="/assets/images/favicon_circular.png">
    <style>
        .code-cell pre {{
            margin: 0;
            overflow-x: auto;
        }}
        .code-cell code {{
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <div class="app-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <a href="../anujsNotes.html" style="text-decoration:none; color:inherit;">
                    <h1 class="logo">Anuj's <span>Notes</span></h1>
                </a>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <h3>Machine Learning</h3>
                    <ul id="subject-list">
                        {nav_links}
                    </ul>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-bar">
                <h2 id="current-title">{page["title"]}</h2>
            </header>
            
            <div class="content-area" id="content-display">
                {html_notes}
            </div>
        </main>
    </div>
</body>
</html>"""

    html_path = os.path.join(ml_dir, page["html"])
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(template)
        
    print(f"Successfully generated {html_path}")
