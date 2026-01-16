#!/usr/bin/env python3
"""
Dynamic Visualization Extraction Script
AI selects the most appropriate visualization type for each methodology.
"""

import json
import os
import time
from pathlib import Path
from anthropic import Anthropic

# Configuration
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts")
JSON_DIR = Path("data/extracted/json")
MODEL = "gemini-3-pro-high"

# Visualization types with descriptions for AI selection
VIZ_TYPES = """
VISUALIZATION TYPES (choose the BEST match):

SEQUENTIAL/PROCESS:
- StepFlow: Sequential steps (Step 1→2→3). Use for: Processes, methods, procedures.
- Timeline: Phase-based progression. Use for: Career stages, product lifecycle, evolution.
- Funnel: Narrowing stages. Use for: Conversion, filtering, prioritization.
- Cycle: Iterative loops. Use for: PDCA, feedback loops, sprint cycles.

COMPARATIVE/EVALUATIVE:
- Matrix2x2: 2x2 grid analysis. Use for: Impact/Effort, Urgent/Important decisions.
- DosDonts: Do vs Don't comparison. Use for: Best practices, anti-patterns.
- Spectrum: Linear range. Use for: Conservative→Aggressive, types on a scale.
- BeforeAfter: Transformation comparison. Use for: Mindset shifts, process improvements.

HIERARCHICAL/STRUCTURAL:
- MindMap: Central concept + branches. Use for: Core idea with related concepts.
- TreeDiagram: Parent-child hierarchy. Use for: Org structure, category breakdown.
- Pyramid: Layered priority. Use for: Maslow-style hierarchy, priority levels.
- Onion: Concentric layers. Use for: Abstraction levels, depth-based models.

FORMULA/EVALUATION:
- Equation: Mathematical relationship. Use for: PMF=Product×Market, success formulas.
- Checklist: Verification items. Use for: Launch checklists, quality gates.
- Scorecard: Metric-based evaluation. Use for: Candidate assessment, product scoring.

NARRATIVE:
- CaseStudy: Real example analysis. Use for: Company examples, implementation stories.
"""

# Initialize client
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

def extract_with_visualization(transcript_path: str, existing_data: dict) -> dict:
    """Extract methodology with AI-selected visualization type"""
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    if len(transcript) > 100000:
        transcript = transcript[:100000]
    
    existing_methods = [m.get('name', '') for m in existing_data.get('methodologies', [])]
    
    prompt = f"""You are an expert PM content strategist. Analyze this podcast and select the OPTIMAL visualization for each methodology.

{VIZ_TYPES}

EXISTING METHODOLOGIES TO ENHANCE:
{json.dumps(existing_methods, indent=2)}

PODCAST TRANSCRIPT:
{transcript}

---

TASK: For each methodology, analyze its STRUCTURE and select the visualization that BEST represents its logic:

- If it's a step-by-step process → StepFlow or Timeline
- If it's a 2-dimension decision framework → Matrix2x2
- If it's about transformation/change → BeforeAfter
- If it's a central concept with branches → MindMap
- If it's a formula/equation → Equation
- If it's a hierarchy of importance → Pyramid
- If it has iterative cycles → Cycle
- If it's verification/quality → Checklist

Return JSON:
{{
  "guest": {{ "name": "...", "title": "...", "company": "...", "background": "..." }},
  "episodeSummary": "...",
  "methodologies": [
    {{
      "name": "<KEEP SAME: {existing_methods[0] if existing_methods else 'Framework Name'}>",
      "category": "<category>",
      "summary": "...",
      "principles": ["Step 1: ...", "Step 2: ..."],
      "problemItSolves": "...",
      "whenToUse": "...",
      "commonMistakes": "...",
      "quote": "...",
      "realWorldExample": "...",
      "visualizationType": "<ONE OF: StepFlow|Timeline|Funnel|Cycle|Matrix2x2|DosDonts|Spectrum|BeforeAfter|MindMap|TreeDiagram|Pyramid|Onion|Equation|Checklist|Scorecard|CaseStudy>",
      "visualizationData": {{
        // Structure depends on visualizationType:
        // StepFlow: {{"steps": ["Step 1", "Step 2", ...]}}
        // Matrix2x2: {{"xAxis": "Effort", "yAxis": "Impact", "quadrants": [...]}}
        // Pyramid: {{"levels": ["Base", "Middle", "Top"]}}
        // Equation: {{"terms": ["A", "B", "C"], "result": "Success", "operator": "×"}}
        // etc.
      }}
    }}
  ]
}}

CRITICAL: 
1. KEEP methodology names exactly as provided
2. Choose visualizationType that BEST matches the framework's logical structure
3. Provide visualizationData with the right structure for the chosen type

Return ONLY valid JSON.
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=16384,
        messages=[{"role": "user", "content": prompt}]
    )
    
    content = response.content[0].text.strip()
    
    # Clean markdown formatting
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    if content.endswith("```"):
        content = content[:-3]
    
    return json.loads(content.strip())

def find_transcript(guest_name: str) -> Path:
    """Find transcript file for a guest"""
    for txt_file in TRANSCRIPTS_DIR.glob("*.txt"):
        if guest_name.lower() in txt_file.stem.lower():
            return txt_file
    for txt_file in TRANSCRIPTS_DIR.glob("*.txt"):
        name_parts = guest_name.lower().split()
        if any(part in txt_file.stem.lower() for part in name_parts):
            return txt_file
    return None

def main():
    print("🎨 Dynamic Visualization Extraction\n")
    
    # Get all episodes
    episodes = []
    for json_file in sorted(JSON_DIR.glob("*.json")):
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            data['_file'] = json_file
            episodes.append(data)
    
    print(f"📊 Found {len(episodes)} episodes\n")
    
    for i, ep in enumerate(episodes):
        guest_name = ep.get('guest', {}).get('name', ep['_file'].stem)
        print(f"[{i+1}/{len(episodes)}] Processing: {guest_name}")
        
        # Skip if already has visualization data
        has_viz = any(m.get('visualizationType') for m in ep.get('methodologies', []))
        if has_viz:
            print(f"  ⏭️ Already has visualization data, skipping")
            continue
        
        transcript_path = find_transcript(guest_name)
        if not transcript_path:
            print(f"  ⚠️ Transcript not found, skipping")
            continue
        
        try:
            enhanced = extract_with_visualization(str(transcript_path), ep)
            enhanced['filename'] = ep['_file'].stem
            
            # Save
            with open(ep['_file'], 'w', encoding='utf-8') as f:
                json.dump(enhanced, f, indent=2, ensure_ascii=False)
            
            viz_types = [m.get('visualizationType', 'None') for m in enhanced.get('methodologies', [])]
            print(f"  ✅ Extracted: {viz_types}")
            
            time.sleep(2)
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print("\n✅ Dynamic extraction complete!")
    print("   Run: python3 scripts/dedup_data.py")

if __name__ == "__main__":
    main()
