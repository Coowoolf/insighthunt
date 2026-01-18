#!/usr/bin/env python3
"""
InsightHunt - Bilingual Deep Content Pipeline
Usage: python3 scripts/bilingual_pipeline.py --start 101 --count 10

Extracts methodologies in both English and Chinese in a single AI call.
This eliminates the need for a separate translation step.
"""

from anthropic import Anthropic
import json
import os
import time
import argparse
from pathlib import Path
from typing import Dict, Set

# Antigravity Proxy Configuration
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

MODEL = "gemini-3-pro-high"

# Paths
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts")
OUTPUT_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/extracted")
JSON_DIR = OUTPUT_DIR / "json"

# Load PM terminology for prompt context
DICT_FILE = Path(__file__).parent / "pm_terminology_dict.json"
PM_TERMS = {}
if DICT_FILE.exists():
    with open(DICT_FILE, 'r', encoding='utf-8') as f:
        PM_TERMS = json.load(f).get('common_terms', {})


def get_processed_guests() -> Set[str]:
    """Get set of already processed guest names (from JSON files)"""
    JSON_DIR.mkdir(parents=True, exist_ok=True)
    return {f.stem for f in JSON_DIR.glob("*.json")}


def get_unprocessed_transcripts() -> list:
    """Get list of transcript files that haven't been processed yet"""
    processed = get_processed_guests()
    all_transcripts = sorted(TRANSCRIPTS_DIR.glob("*.txt"))
    
    unprocessed = []
    for t in all_transcripts:
        guest_name = t.stem
        if guest_name not in processed:
            unprocessed.append(t)
    
    return unprocessed


def extract_bilingual_methodologies(transcript_path: Path) -> Dict:
    """
    Extract deep methodologies in both English and Chinese in a single AI call.
    """
    with open(transcript_path, 'r', encoding='utf-8') as f:
        transcript = f.read()
    
    # Truncate if too long
    if len(transcript) > 100000:
        transcript = transcript[:100000]
    
    # Key terminology examples for translation guidance
    term_examples = "\n".join([f"  - {en} → {zh}" for en, zh in list(PM_TERMS.items())[:15]])
    
    prompt = f"""You are a bilingual (English/Chinese) expert product management analyst. 
Your task is to extract actionable frameworks from this podcast AND provide professional Chinese translations simultaneously.

PODCAST TRANSCRIPT:
{transcript}

---

TRANSLATION GUIDELINES (for Chinese fields):
1. 使用中国产品经理圈内的专业术语，而非机械直译
2. 国际通用缩写保持英文（OKR, MVP, PMF, A/B Test, North Star Metric）
3. 译文应读起来像中国PM原创内容，专业且自然

Key terminology reference:
{term_examples}

---

OUTPUT FORMAT (JSON with bilingual fields):
{{
  "guest": {{
    "name": "Full name of the guest",
    "title": "Current or most notable title",
    "company": "Primary company",
    "background": "2-3 sentence bio (English)",
    "background_zh": "嘉宾背景介绍（中文，2-3句）"
  }},
  "episodeSummary": "A compelling 3-4 sentence summary (English)",
  "episodeSummary_zh": "节目精华概述（中文，3-4句）",
  "keyTakeaways": ["5-8 actionable insights in English"],
  "methodologies": [
    {{
      "name": "Memorable framework name (English)",
      "name_zh": "Framework Name（中文译名）",
      "category": "One of: product-strategy, growth-metrics, team-culture, user-research, execution, career-leadership",
      "problemItSolves": "What problem this solves (English)",
      "problemItSolves_zh": "该方法论解决的核心问题（中文）",
      "summary": "Clear 3-4 sentence explanation (English)",
      "summary_zh": "方法论概述（中文，3-4句）",
      "principles": [
        "Step 1: First principle (English)",
        "Step 2: Second principle",
        "Step 3: Third principle (3-5 total)"
      ],
      "principles_zh": [
        "原则一：中文描述",
        "原则二：中文描述",
        "原则三：中文描述（共3-5条）"
      ],
      "whenToUse": "When to apply this framework (English)",
      "whenToUse_zh": "适用场景（中文）",
      "commonMistakes": "Pitfalls to avoid (English)",
      "commonMistakes_zh": "常见误区（中文）",
      "quote": "Powerful quote from the guest (keep in English)",
      "realWorldExample": "Concrete example from podcast (English)",
      "realWorldExample_zh": "真实案例（中文）"
    }}
  ],
  "notableQuotes": [
    {{
      "text": "A powerful standalone quote",
      "context": "Brief context"
    }}
  ]
}}

QUALITY STANDARDS:
1. Extract 2-4 distinct, actionable methodologies per episode
2. Each methodology must have ALL bilingual fields (_zh versions)
3. Chinese translations should be professional PM-quality, not literal translations
4. Framework names should be memorable (English) with natural Chinese translations
5. Principles should be specific, not generic advice
6. Include real examples from the conversation

Return ONLY valid JSON. Think deeply about both content extraction AND translation quality.
"""

    response = client.messages.create(
        model=MODEL,
        max_tokens=20000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    text = response.content[0].text
    
    # Robust JSON extraction
    return extract_json_from_response(text)


def extract_json_from_response(text: str) -> Dict:
    """
    Robustly extract JSON from AI response, handling various formats:
    - Raw JSON
    - Markdown code blocks (```json ... ```)
    - Multiple code blocks (take the first complete one)
    - Extra text before/after JSON
    """
    import re
    
    # Method 1: Try direct parse first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    
    # Method 2: Extract from ```json ... ``` blocks
    json_block_pattern = r'```(?:json)?\s*\n?([\s\S]*?)\n?```'
    matches = re.findall(json_block_pattern, text)
    
    for match in matches:
        try:
            return json.loads(match.strip())
        except json.JSONDecodeError:
            continue
    
    # Method 3: Find the outermost { } pair using bracket matching
    def find_balanced_json(s: str) -> str:
        start = s.find('{')
        if start == -1:
            return None
        
        depth = 0
        in_string = False
        escape = False
        
        for i in range(start, len(s)):
            char = s[i]
            
            if escape:
                escape = False
                continue
            
            if char == '\\':
                escape = True
                continue
            
            if char == '"':
                in_string = not in_string
                continue
            
            if in_string:
                continue
            
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    return s[start:i+1]
        
        return None
    
    json_str = find_balanced_json(text)
    if json_str:
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    
    # Method 4: Last resort - find first { and last }
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end+1])
        except json.JSONDecodeError:
            pass
    
    raise ValueError("Could not parse JSON from response")




def process_single_transcript(filepath: Path) -> Dict:
    """Process a single transcript with bilingual extraction"""
    filename = filepath.stem
    
    print(f"  📝 Bilingual Extracting: {filename}")
    
    try:
        data = extract_bilingual_methodologies(filepath)
        data['filename'] = filename
        
        # Save individual JSON
        JSON_DIR.mkdir(parents=True, exist_ok=True)
        output_path = JSON_DIR / f"{filename}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        methodology_count = len(data.get('methodologies', []))
        
        # Verify bilingual fields
        if data.get('methodologies'):
            m = data['methodologies'][0]
            has_zh = all(k in m for k in ['name_zh', 'summary_zh', 'principles_zh'])
            status = "🌐 EN+ZH" if has_zh else "⚠️ EN only"
        else:
            status = "⚠️ No methodologies"
        
        print(f"     ✅ Extracted {methodology_count} methodologies {status}")
        return data
        
    except Exception as e:
        print(f"     ❌ Error: {e}")
        return {"filename": filename, "error": str(e)}


def update_sample_data():
    """Combine all JSON files into sample_data.json"""
    all_data = []
    
    for filepath in sorted(JSON_DIR.glob("*.json")):
        with open(filepath, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                if 'error' not in data:
                    all_data.append(data)
            except:
                pass
    
    sample_path = OUTPUT_DIR / 'sample_data.json'
    with open(sample_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    total_methodologies = sum(len(ep.get('methodologies', [])) for ep in all_data)
    return len(all_data), total_methodologies


def main():
    parser = argparse.ArgumentParser(description='Bilingual batch processing for InsightHunt')
    parser.add_argument('--start', type=int, default=101, help='Starting episode number (1-indexed, default: 101)')
    parser.add_argument('--count', type=int, default=10, help='Number of episodes to process')
    parser.add_argument('--force', action='store_true', help='Force reprocess even if already done')
    parser.add_argument('--list-unprocessed', action='store_true', help='List unprocessed transcripts and exit')
    args = parser.parse_args()
    
    print("🌐 InsightHunt Bilingual Pipeline (EN + ZH)")
    print("=" * 60)
    
    # Get unprocessed transcripts
    unprocessed = get_unprocessed_transcripts()
    processed_count = len(get_processed_guests())
    total_transcripts = len(list(TRANSCRIPTS_DIR.glob("*.txt")))
    
    if args.list_unprocessed:
        print(f"\n📊 Status: {processed_count} processed, {len(unprocessed)} remaining\n")
        print("Unprocessed transcripts:")
        for i, t in enumerate(unprocessed[:30], 1):
            print(f"  {i}. {t.stem}")
        if len(unprocessed) > 30:
            print(f"  ... and {len(unprocessed) - 30} more")
        return
    
    print(f"\n📊 Status: {processed_count}/{total_transcripts} processed")
    print(f"   Remaining: {len(unprocessed)} transcripts\n")
    
    if not unprocessed:
        print("🎉 All transcripts have been processed!")
        return
    
    # Calculate batch
    # For --start 101, we want the 1st unprocessed file (index 0)
    # The "episode number" is conceptual, we just process unprocessed files in order
    start_idx = max(0, args.start - processed_count - 1) if args.start > processed_count else 0
    end_idx = min(start_idx + args.count, len(unprocessed))
    batch_files = unprocessed[start_idx:end_idx]
    
    if not batch_files:
        print(f"No files to process in range. Use --list-unprocessed to see available files.")
        return
    
    print(f"🎯 Processing batch: {len(batch_files)} files\n")
    
    success = 0
    errors = []
    
    for i, filepath in enumerate(batch_files):
        print(f"\n[{processed_count + start_idx + i + 1}/{total_transcripts}] Processing...")
        
        try:
            data = process_single_transcript(filepath)
            if 'error' not in data:
                success += 1
            else:
                errors.append(data)
        except Exception as e:
            print(f"     ❌ Fatal: {e}")
            errors.append({"filename": filepath.stem, "error": str(e)})
        
        time.sleep(2)  # Rate limiting
    
    # Update combined sample_data.json
    episode_count, methodology_count = update_sample_data()
    
    print(f"\n{'='*60}")
    print(f"✅ Batch Complete: {success}/{len(batch_files)} succeeded")
    print(f"❌ Errors: {len(errors)}")
    print(f"📊 Total in sample_data.json: {episode_count} episodes, {methodology_count} methodologies")
    
    remaining = len(unprocessed) - len(batch_files)
    if remaining > 0:
        print(f"\n📌 Next batch: python3 scripts/bilingual_pipeline.py --count {args.count}")
        print(f"   Remaining: {remaining} transcripts")
    else:
        print(f"\n🎉 ALL TRANSCRIPTS PROCESSED!")


if __name__ == "__main__":
    main()
