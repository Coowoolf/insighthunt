"""
InsightHunt - Deep Content Pipeline (Thinking Mode)
Usage: python3 scripts/batch_pipeline.py --start 0 --count 10

Uses Gemini 3 Pro High THINKING mode for deep, insightful methodology extraction.
"""

from anthropic import Anthropic
import json
import os
import time
import argparse
from typing import Dict

# Antigravity Proxy Configuration - Using THINKING model
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

# Use standard model with extended thinking for deeper analysis
MODEL = "gemini-3-pro-high"


def extract_deep_methodologies(transcript_path: str) -> Dict:
    """
    Extract deep, insightful methodologies using extended thinking.
    Produces research-hub quality content with actionable frameworks.
    """
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    # Truncate if too long but keep more context
    if len(transcript) > 100000:
        transcript = transcript[:100000]
    
    # Enhanced prompt for deep extraction
    prompt = f"""You are an expert product management analyst with deep expertise in extracting actionable frameworks from podcast conversations.

PODCAST TRANSCRIPT:
{transcript}

---

TASK: Perform a deep analysis of this podcast episode and extract structured, actionable methodologies that product managers can immediately apply.

OUTPUT FORMAT (JSON):
{{
  "guest": {{
    "name": "Full name of the guest",
    "title": "Current or most notable title",
    "company": "Primary company",
    "background": "2-3 sentence bio highlighting why this person is an authority"
  }},
  "episodeSummary": "A compelling 3-4 sentence summary of the episode's core thesis and what makes it valuable",
  "keyTakeaways": [
    "5-8 actionable insights that a PM can immediately apply, each should be specific and tactical"
  ],
  "methodologies": [
    {{
      "name": "Give the framework a memorable, branded name (e.g., 'The RICE Framework', 'Jobs-to-be-Done Canvas')",
      "category": "One of: product-strategy, growth-metrics, team-culture, user-research, execution, career-leadership",
      "problemItSolves": "What specific pain point or challenge does this framework address?",
      "summary": "A clear 3-4 sentence explanation of what this methodology is and why it works",
      "principles": [
        "Step 1: First actionable principle with specific guidance",
        "Step 2: Second principle - be concrete, not generic",
        "Step 3: Third principle with examples if possible",
        "Step 4: Additional principles as needed (3-5 total)"
      ],
      "whenToUse": "Specific situations or contexts where this framework is most valuable",
      "commonMistakes": "1-2 pitfalls to avoid when applying this methodology",
      "quote": "The most powerful, memorable quote from the guest about this topic",
      "realWorldExample": "A concrete example from the podcast of how this was applied"
    }}
  ],
  "notableQuotes": [
    {{
      "text": "A powerful standalone quote",
      "context": "Brief context for when/why they said this"
    }}
  ]
}}

QUALITY STANDARDS:
1. Each methodology should be actionable - a PM should be able to use it tomorrow
2. Principles should be specific, not generic advice like "listen to users"
3. Include real examples from the conversation when available
4. The framework names should be memorable and brandable
5. Extract 2-4 distinct methodologies per episode
6. Key takeaways should be tactical, not obvious

Return ONLY valid JSON. Think deeply about what makes each methodology unique and valuable.
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=16384,  # Extended output for deeper content
        messages=[{"role": "user", "content": prompt}]
    )
    
    text = response.content[0].text
    
    # Clean up markdown wrapper if present
    if text.startswith('```'):
        lines = text.split('\n')
        text = '\n'.join(lines[1:-1]) if lines[-1].strip().startswith('`') else '\n'.join(lines[1:])
    
    # Handle potential thinking output
    if '```json' in text:
        start = text.find('```json') + 7
        end = text.find('```', start)
        text = text[start:end].strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end > start:
            return json.loads(text[start:end])
        raise ValueError(f"Could not parse JSON from response")


def process_single_transcript(filepath: str, output_dir: str) -> Dict:
    """Process a single transcript file with deep extraction"""
    filename = os.path.basename(filepath).replace('.txt', '')
    
    print(f"  📝 Deep Extracting: {filename}")
    
    try:
        data = extract_deep_methodologies(filepath)
        data['filename'] = filename
        
        # Save individual JSON
        json_dir = os.path.join(output_dir, 'json')
        os.makedirs(json_dir, exist_ok=True)
        with open(os.path.join(json_dir, f"{filename}.json"), 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        methodology_count = len(data.get('methodologies', []))
        quote_count = len(data.get('notableQuotes', []))
        print(f"     ✅ Extracted {methodology_count} methodologies, {quote_count} notable quotes")
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
    
    # Count total methodologies
    total_methodologies = sum(len(ep.get('methodologies', [])) for ep in all_data)
    return len(all_data), total_methodologies


def main():
    parser = argparse.ArgumentParser(description='Deep batch process podcast transcripts')
    parser.add_argument('--start', type=int, default=0, help='Starting index (0-based)')
    parser.add_argument('--count', type=int, default=10, help='Number of transcripts to process')
    args = parser.parse_args()
    
    transcripts_dir = "/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts"
    output_dir = "/Users/yaoguanghua/Projects/Skills/insighthunt/data/extracted"
    
    files = sorted([f for f in os.listdir(transcripts_dir) if f.endswith('.txt')])
    total = len(files)
    
    end_index = min(args.start + args.count, total)
    batch_files = files[args.start:end_index]
    
    print(f"🎙️ Deep Batch Processing (Thinking Mode): {args.start+1} to {end_index} of {total} transcripts\n")
    print(f"📊 Using model: {MODEL}\n")
    
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
        
        # Longer delay for Thinking model
        time.sleep(2)
    
    # Update combined sample_data.json
    episode_count, methodology_count = update_sample_data(output_dir)
    
    print(f"\n{'='*60}")
    print(f"✅ Deep Batch Complete: {len(all_data)}/{len(batch_files)} succeeded")
    print(f"❌ Errors: {len(errors)}")
    print(f"📊 Total in sample_data.json: {episode_count} episodes, {methodology_count} methodologies")
    print(f"\n📌 Next batch: python3 scripts/batch_pipeline.py --start {end_index} --count {args.count}")
    
    if end_index >= total:
        print(f"\n🎉 ALL TRANSCRIPTS PROCESSED!")


if __name__ == "__main__":
    main()
