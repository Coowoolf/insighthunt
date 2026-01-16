#!/usr/bin/env python3
"""
Re-extract existing episodes with deep prompts to add missing fields:
- problemItSolves
- whenToUse
- commonMistakes
- realWorldExample
- notableQuotes
- episodeSummary
- guest.background
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

# Initialize client
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

def extract_deep(transcript_path: str, existing_data: dict) -> dict:
    """Re-extract with deep prompts, preserving existing data structure"""
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    if len(transcript) > 100000:
        transcript = transcript[:100000]
    
    # Get existing methodology names to maintain consistency
    existing_methods = [m.get('name', '') for m in existing_data.get('methodologies', [])]
    
    prompt = f"""You are an expert product management analyst. Re-analyze this podcast transcript and enhance it with deep, actionable insights.

EXISTING DATA (for reference - keep the methodology names consistent):
Guest: {existing_data.get('guest', {}).get('name', 'Unknown')}
Existing Methodologies: {', '.join(existing_methods)}

PODCAST TRANSCRIPT:
{transcript}

---

TASK: Provide enhanced analysis with these SPECIFIC FIELDS:

{{
  "guest": {{
    "name": "{existing_data.get('guest', {}).get('name', 'Full Name')}",
    "title": "<Current or most notable title>",
    "company": "<Primary company>",
    "background": "<2-3 sentence bio explaining why this person is an authority on this topic>"
  }},
  "episodeSummary": "<A compelling 3-4 sentence summary of the episode's core thesis and value>",
  "keyTakeaways": [
    "<5-8 specific, tactical insights a PM can apply immediately>",
    "<Be specific, not generic like 'listen to users'>",
    "<Include numbers, timeframes, or concrete examples when available>"
  ],
  "methodologies": [
    {{
      "name": "<Keep same as existing: {existing_methods[0] if existing_methods else 'Framework Name'}>",
      "category": "<product-strategy|growth-metrics|team-culture|user-research|execution|career-leadership>",
      "problemItSolves": "<What specific pain point does this framework address?>",
      "summary": "<Clear 3-4 sentence explanation of what this methodology is and why it works>",
      "principles": [
        "<Step 1: Specific actionable principle>",
        "<Step 2: Concrete guidance, not generic advice>",
        "<Step 3: With examples if possible>"
      ],
      "whenToUse": "<Specific situations where this framework is most valuable>",
      "commonMistakes": "<1-2 pitfalls to avoid when applying this methodology>",
      "quote": "<The most powerful quote from the guest about this topic>",
      "realWorldExample": "<A concrete example from the podcast of how this was applied>"
    }}
  ],
  "notableQuotes": [
    {{
      "text": "<A powerful standalone quote>",
      "context": "<Brief context for when/why they said this>"
    }}
  ]
}}

IMPORTANT:
1. Keep methodology NAMES the same as existing to avoid breaking links
2. ADD the new fields: problemItSolves, whenToUse, commonMistakes, realWorldExample
3. ADD episodeSummary and guest.background
4. ADD notableQuotes (3-4 powerful quotes)
5. Make everything SPECIFIC and ACTIONABLE

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

def get_shallow_episodes():
    """Find episodes that lack deep fields"""
    shallow = []
    for json_file in sorted(JSON_DIR.glob("*.json")):
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Check if missing deep fields
        has_deep = True
        if not data.get('episodeSummary'):
            has_deep = False
        if not data.get('guest', {}).get('background'):
            has_deep = False
        for m in data.get('methodologies', []):
            if not m.get('problemItSolves') and not m.get('whenToUse'):
                has_deep = False
                break
        
        if not has_deep:
            shallow.append((json_file, data))
    
    return shallow

def find_transcript(guest_name: str) -> Path:
    """Find transcript file for a guest"""
    for txt_file in TRANSCRIPTS_DIR.glob("*.txt"):
        if guest_name.lower() in txt_file.stem.lower():
            return txt_file
    # Try partial match
    for txt_file in TRANSCRIPTS_DIR.glob("*.txt"):
        name_parts = guest_name.lower().split()
        if any(part in txt_file.stem.lower() for part in name_parts):
            return txt_file
    return None

def main():
    print("🔄 Deep Re-extraction for Shallow Episodes\n")
    
    shallow = get_shallow_episodes()
    print(f"📊 Found {len(shallow)} episodes needing deep fields\n")
    
    for i, (json_file, existing_data) in enumerate(shallow):
        guest_name = existing_data.get('guest', {}).get('name', json_file.stem)
        print(f"[{i+1}/{len(shallow)}] Re-extracting: {guest_name}")
        
        # Find transcript
        transcript_path = find_transcript(guest_name)
        if not transcript_path:
            print(f"  ⚠️ Transcript not found, skipping")
            continue
        
        try:
            deep_data = extract_deep(str(transcript_path), existing_data)
            deep_data['filename'] = json_file.stem
            
            # Save enhanced data
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(deep_data, f, indent=2, ensure_ascii=False)
            
            method_count = len(deep_data.get('methodologies', []))
            quote_count = len(deep_data.get('notableQuotes', []))
            print(f"  ✅ Enhanced: {method_count} methodologies, {quote_count} quotes")
            
            time.sleep(2)  # Rate limiting
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print("\n✅ Re-extraction complete!")
    print("   Run: python3 scripts/dedup_data.py  to regenerate sample_data.json")

if __name__ == "__main__":
    main()
