"""
InsightHunt - Gemini Integration for Methodology Extraction and Infographic Generation
Uses Anthropic SDK to call Gemini 3 Pro High through Antigravity proxy
"""

from anthropic import Anthropic
import json
import os
import time
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

# Antigravity Proxy Configuration
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

MODEL = "gemini-3-pro-high"

def extract_methodologies(transcript_path: str) -> Dict:
    """
    Extract methodologies from a podcast transcript using Gemini 3 Pro High
    """
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    # Truncate if too long
    if len(transcript) > 80000:
        transcript = transcript[:80000]
    
    prompt = f"""You are an expert product management analyst. Analyze this podcast transcript and extract structured data.

TRANSCRIPT:
{transcript}

---

Please extract and return a JSON object with the following structure:
{{
  "guest": {{
    "name": "Guest full name",
    "title": "Current/Former title and company",
    "company": "Primary company"
  }},
  "keyTakeaways": ["5-8 key insights from this episode"],
  "methodologies": [
    {{
      "name": "Framework/Methodology name",
      "category": "one of: product-strategy, growth-metrics, team-culture, user-research, execution, career-leadership",
      "summary": "2-3 sentence description",
      "principles": ["3-5 core principles"],
      "quote": "One powerful quote from the guest"
    }}
  ]
}}

Return ONLY valid JSON. Extract 1-3 methodologies per episode.
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )
    
    text = response.content[0].text
    
    # Clean up markdown if present
    if text.startswith('```'):
        lines = text.split('\n')
        text = '\n'.join(lines[1:-1]) if lines[-1].strip().startswith('`') else '\n'.join(lines[1:])
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        raise ValueError(f"Could not parse JSON")


def generate_infographic_html(methodology: Dict, guest_name: str) -> str:
    """
    Generate HTML/CSS infographic content for a methodology using Gemini
    """
    prompt = f"""Create a beautiful infographic in HTML/CSS for this product methodology.

METHODOLOGY:
Name: {methodology['name']}
Guest: {guest_name}
Category: {methodology['category']}
Summary: {methodology['summary']}
Principles: {json.dumps(methodology['principles'], ensure_ascii=False)}
Quote: {methodology.get('quote', '')}

DESIGN REQUIREMENTS (Dopamine Geek Style):
- Background: #FAF8F5 (cream) with soft gradient accents
- Primary gradient: linear-gradient(135deg, #6366f1, #a855f7, #ec4899)
- Font: Outfit from Google Fonts
- Card style: rounded corners (20px), soft purple/pink shadows
- Size: 1200px width
- Include: gradient title, guest name, category badge, numbered principles (2x2 grid), quote block, InsightHunt footer

Return ONLY complete HTML with inline CSS. No markdown, no explanations.
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=8192,
        messages=[{"role": "user", "content": prompt}]
    )
    
    html = response.content[0].text
    
    # Clean markdown wrapper
    if html.startswith('```'):
        lines = html.split('\n')
        html = '\n'.join(lines[1:-1]) if lines[-1].strip().startswith('`') else '\n'.join(lines[1:])
    
    return html


def process_single_transcript(filepath: str, output_dir: str) -> Dict:
    """Process a single transcript file"""
    filename = os.path.basename(filepath).replace('.txt', '')
    
    print(f"  📝 Extracting: {filename}")
    
    try:
        # Extract methodologies
        data = extract_methodologies(filepath)
        data['filename'] = filename
        
        # Save JSON
        json_dir = os.path.join(output_dir, 'json')
        os.makedirs(json_dir, exist_ok=True)
        with open(os.path.join(json_dir, f"{filename}.json"), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"     ✅ Extracted {len(data.get('methodologies', []))} methodologies")
        
        # Generate infographics
        infographic_dir = os.path.join(output_dir, 'infographics')
        os.makedirs(infographic_dir, exist_ok=True)
        
        for i, method in enumerate(data.get('methodologies', [])):
            try:
                html = generate_infographic_html(method, data['guest']['name'])
                html_path = os.path.join(infographic_dir, f"{filename}_{i+1}.html")
                with open(html_path, 'w', encoding='utf-8') as f:
                    f.write(html)
                print(f"     🎨 Generated: {method['name'][:40]}...")
            except Exception as e:
                print(f"     ⚠️ Infographic error: {e}")
        
        return data
        
    except Exception as e:
        print(f"     ❌ Error: {e}")
        return {"filename": filename, "error": str(e)}


def main():
    """Process all transcripts"""
    transcripts_dir = "/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts"
    output_dir = "/Users/yaoguanghua/Projects/Skills/insighthunt/data/extracted"
    
    # Get all transcript files
    files = sorted([f for f in os.listdir(transcripts_dir) if f.endswith('.txt')])
    total = len(files)
    print(f"🎙️ Found {total} transcripts to process\n")
    
    all_data = []
    errors = []
    
    for i, file in enumerate(files):
        print(f"\n[{i+1}/{total}] Processing...")
        filepath = os.path.join(transcripts_dir, file)
        
        try:
            data = process_single_transcript(filepath, output_dir)
            if 'error' not in data:
                all_data.append(data)
            else:
                errors.append(data)
        except Exception as e:
            print(f"     ❌ Fatal: {e}")
            errors.append({"filename": file, "error": str(e)})
        
        # Rate limiting - be nice to the API
        time.sleep(1)
    
    # Save combined data
    combined_path = os.path.join(output_dir, 'all_methodologies.json')
    with open(combined_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    # Save errors
    if errors:
        errors_path = os.path.join(output_dir, 'errors.json')
        with open(errors_path, 'w', encoding='utf-8') as f:
            json.dump(errors, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*50}")
    print(f"✅ Completed: {len(all_data)} transcripts")
    print(f"❌ Errors: {len(errors)} transcripts")
    print(f"📁 Output: {output_dir}")


if __name__ == "__main__":
    main()
