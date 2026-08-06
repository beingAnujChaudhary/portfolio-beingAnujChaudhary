import os
import re
import nbformat

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\anujsNotes\machineLearningNotes"

md_files = [
    "1_machine_learning.md",
    "2_regression.md",
    "3_simple_linear_regression.md"
]

for md_file in md_files:
    md_path = os.path.join(base_dir, md_file)
    ipynb_path = os.path.join(base_dir, md_file.replace(".md", ".ipynb"))
    
    print(f"Converting {md_file} to {os.path.basename(ipynb_path)}...")
    
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
        
    nb = nbformat.v4.new_notebook()
    
    # Split text by ```python ... ``` blocks
    blocks = re.split(r'(```python\n[\s\S]*?\n```)', text)
    
    for block in blocks:
        if block.startswith('```python'):
            # Strip the leading ```python\n and trailing \n```
            code = block[10:-4]
            nb.cells.append(nbformat.v4.new_code_cell(code))
        else:
            if block.strip():
                nb.cells.append(nbformat.v4.new_markdown_cell(block))
                
    with open(ipynb_path, 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)

print("Conversion complete!")
