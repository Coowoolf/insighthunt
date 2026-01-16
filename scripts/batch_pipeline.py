"""
InsightHunt - Batch Processing Pipeline
Usage: python3 scripts/batch_pipeline.py --start 0 --count 10

Processes transcripts in batches for incremental review and deployment.
"""

from anthropic import Anthropic
import json
import os
import time
import argparse
from typing import List, Dict

# Antigravity Proxy Configuration
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

MODEL = "gemini-3-pro-high"

def extract_methodologies(transcript_path: str) -> Dict:
    """Extract methodologies from a podcast transcript"""
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
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


def process_single_transcript(filepath: str, output_dir: str) -> Dict:
    """Process a single transcript file (extraction only, no infographics for speed)"""
    filename = os.path.basename(filepath).replace('.txt', '')
    
    print(f"  📝 Extracting: {filename}")
    
    try:
        data = extract_methodologies(filepath)
        data['filename'] = filename
        
        json_dir = os.path.join(output_dir, 'json')
        os.makedirs(json_dir, exist_ok=True)
        with open(os.path.join(json_dir, f"{filename}.json"), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"     ✅ Extracted {len(data.get('methodologies', []))} methodologies")
        return data
        
    except Exception as e:
        print(f"     ❌ Error: {e}")
        return {"filename": filename, "error": str(e)}


def update_sample_data(output_dir: str):
    """Combine all JSON files into sample_data.json for the website"""
    json_dir = os.path.join(output_dir, 'json')
    all_data = []
    
    for filename in sorted(os.listdir(json_dir)):
        if filename.endswith('.json'):
            filepath = os.path.join(json_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    if 'error' not in data:
                        all_data.append(data)
                except:
                    pass
    
    sample_path = os.path.join(output_dir, 'sample_data.json')
    with open(sample_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    return len(all_data)


def main():
    parser = argparse.ArgumentParser(description='Batch process podcast transcripts')
    parser.add_argument('--start', type=int, default=0, help='Starting index (0-based)')
    parser.add_argument('--count', type=int, default=10, help='Number of transcripts to process')
    args = parser.parse_args()
    
    transcripts_dir = "/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts"
    output_dir = "/Users/yaoguanghua/Projects/Skills/insighthunt/data/extracted"
    
    files = sorted([f for f in os.listdir(transcripts_dir) if f.endswith('.txt')])
    total = len(files)
    
    end_index = min(args.start + args.count, total)
    batch_files = files[args.start:end_index]
    
    print(f"🎙️ Batch Processing: {args.start+1} to {end_index} of {total} transcripts\n")
    
    all_data = []
    errors = []
    
    for i, file in enumerate(batch_files):
        print(f"\n[{args.start + i + 1}/{total}] Processing...")
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
        
        time.sleep(1)
    
    # Update combined sample_data.json
    total_methodologies = update_sample_data(output_dir)
    
    print(f"\n{'='*50}")
    print(f"✅ Batch Complete: {len(all_data)}/{len(batch_files)} succeeded")
    print(f"❌ Errors: {len(errors)}")
    print(f"📊 Total in sample_data.json: {total_methodologies} episodes")
    print(f"\n📌 Next batch: python3 scripts/batch_pipeline.py --start {end_index} --count {args.count}")
    
    if end_index >= total:
        print(f"\n🎉 ALL TRANSCRIPTS PROCESSED!")


if __name__ == "__main__":
    main()
