import os

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary\projects\notes-flashcards"
css_path = os.path.join(base_dir, "flashcards.css")

with open(css_path, "a", encoding="utf-8") as f:
    f.write("""
/* --- Tracking UI & Compact Controls --- */
.compact-controls-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
}

.inline-nav-btn {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #475569;
    transition: all 0.2s ease;
}

.inline-nav-btn:hover:not(:disabled) {
    background: #f8fafc;
    color: #FE320A;
    border-color: #FE320A;
}

.inline-nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
}
.toggle-switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
input:checked + .slider {
  background-color: #FE320A;
}
input:checked + .slider:before {
  transform: translateX(22px);
}
.slider.round {
  border-radius: 24px;
}
.slider.round:before {
  border-radius: 50%;
}

.learning-feedback-controls {
    z-index: 10;
}
.feedback-btn {
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 0.95rem;
    transition: transform 0.15s, opacity 0.15s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.needs-review-btn {
    background: #f1f5f9;
    color: #475569;
}
.got-it-btn {
    background: #FE320A;
    color: white;
}
.feedback-btn:hover {
    transform: translateY(-2px);
}
.feedback-btn:active {
    transform: translateY(0);
}

.card-icon-btn {
    background: transparent;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    transition: color 0.2s;
    padding: 8px;
}
.card-icon-btn:hover {
    color: #FE320A;
}
""")

print("flashcards.css updated")
