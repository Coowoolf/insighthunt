#!/usr/bin/env python3
"""
InsightHunt Chinese Translation Script
Translates methodology content to professional PM-quality Chinese
"""

import os
import json
import time
import re
from pathlib import Path
from anthropic import Anthropic

# Configuration
DATA_DIR = Path("data/extracted/json")
DICT_FILE = Path("scripts/pm_terminology_dict.json")

# Use local Anthropic proxy (same as batch_pipeline.py)
client = Anthropic(
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee",
    base_url="http://127.0.0.1:8045",
)
MODEL = "gemini-3-pro-high"

# Load PM terminology dictionary
with open(DICT_FILE, 'r', encoding='utf-8') as f:
    PM_DICT = json.load(f)

def create_translation_prompt(content_type: str, content: str, methodology_name: str) -> str:
    """Create a high-quality PM translation prompt"""
    
    terminology_examples = "\n".join([
        f"  - {en} → {zh}" 
        for en, zh in list(PM_DICT['common_terms'].items())[:20]
    ])
    
    return f"""你是一位资深产品经理兼专业技术翻译，拥有 10 年以上硅谷和中国互联网公司的产品经验。

## 任务
将以下产品方法论内容翻译成专业级中文。这是 "{methodology_name}" 方法论的 {content_type}。

## 翻译原则
1. **专业术语**：使用中国产品经理圈子内的标准表达，而非机械直译
2. **自然表达**：译文读起来像是中国产品经理原创的内容，而非翻译腔
3. **保留缩写**：国际通用术语保持英文（如 OKR, MVP, PMF, A/B Test）
4. **上下文理解**：根据语境选择最恰当的译法
5. **简洁专业**：避免冗长，使用精炼的专业表达

## 术语对照表（必须遵循）
{terminology_examples}

## 待翻译内容
{content}

## 输出要求
- 只输出翻译后的中文，不要任何解释或注释
- 如果是数组格式，保持相同的格式（每行一条）
- 保持原文的结构和逻辑
"""

def translate_text(text: str, content_type: str, methodology_name: str) -> str:
    """Call AI API to translate text"""
    if not text or not text.strip():
        return ""
    
    prompt = create_translation_prompt(content_type, text, methodology_name)
    
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=4000,
            thinking={
                "type": "enabled",
                "budget_tokens": 2000
            },
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        # Extract text from response (handling thinking blocks)
        for block in response.content:
            if block.type == "text":
                return block.text.strip()
        return ""
    except Exception as e:
        print(f"    ⚠️ Translation error: {e}")
        return ""

def translate_principles(principles: list, methodology_name: str) -> list:
    """Translate a list of principles"""
    if not principles:
        return []
    
    # Combine principles for batch translation
    combined = "\n".join([f"{i+1}. {p}" for i, p in enumerate(principles)])
    translated = translate_text(combined, "核心原则列表", methodology_name)
    
    # Parse back to list
    if translated:
        lines = [line.strip() for line in translated.split('\n') if line.strip()]
        # Remove numbering if present
        result = []
        for line in lines:
            cleaned = re.sub(r'^[\d]+[\.\)]\s*', '', line)
            if cleaned:
                result.append(cleaned)
        return result if result else principles
    return []

def translate_methodology(methodology: dict) -> dict:
    """Translate a single methodology's content to Chinese"""
    name = methodology.get('name', 'Unknown')
    
    # Translate each field
    fields_to_translate = [
        ('summary', '方法论概述'),
        ('problemItSolves', '解决的问题'),
        ('whenToUse', '适用场景'),
        ('commonMistakes', '常见错误'),
        ('realWorldExample', '真实案例'),
    ]
    
    for field, desc in fields_to_translate:
        if methodology.get(field):
            translated = translate_text(methodology[field], desc, name)
            if translated:
                methodology[f'{field}_zh'] = translated
                time.sleep(0.5)  # Rate limiting
    
    # Translate principles (array)
    if methodology.get('principles'):
        principles_zh = translate_principles(methodology['principles'], name)
        if principles_zh:
            methodology['principles_zh'] = principles_zh
    
    # Translate name (keep English + add Chinese)
    if name:
        name_zh = translate_text(name, "方法论名称", name)
        if name_zh:
            methodology['name_zh'] = f"{name}（{name_zh}）"
    
    # Quote: Keep English original, optionally add Chinese note
    # (Based on user preference to keep quotes in English)
    
    return methodology

def translate_episode(filepath: Path) -> None:
    """Translate an entire episode JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    guest_name = data.get('guest', {}).get('name', 'Unknown')
    methodologies = data.get('methodologies', [])
    
    # Check if already translated
    if methodologies and methodologies[0].get('name_zh'):
        print(f"  ⏭️ Already translated, skipping")
        return
    
    print(f"  📝 Translating {len(methodologies)} methodologies...")
    
    for i, m in enumerate(methodologies):
        method_name = m.get('name', 'Unknown')
        print(f"    [{i+1}/{len(methodologies)}] {method_name}")
        translate_methodology(m)
        time.sleep(1)  # Rate limiting between methodologies
    
    # Translate guest background and episode summary
    if data.get('guest', {}).get('background'):
        bg_zh = translate_text(data['guest']['background'], "嘉宾背景", guest_name)
        if bg_zh:
            data['guest']['background_zh'] = bg_zh
    
    if data.get('episodeSummary'):
        summary_zh = translate_text(data['episodeSummary'], "节目概述", guest_name)
        if summary_zh:
            data['episodeSummary_zh'] = summary_zh
    
    # Save translated data back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  ✅ Translation complete")

def is_fully_translated(filepath: Path) -> bool:
    """Check if an episode is fully translated (all methodologies have summary_zh)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    methodologies = data.get('methodologies', [])
    if not methodologies:
        return True
    
    # Check if ALL methodologies have summary_zh (the most important field)
    return all(m.get('summary_zh') for m in methodologies)

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Translate InsightHunt episodes to Chinese')
    parser.add_argument('--start', type=int, default=1, help='Starting episode number (1-indexed)')
    parser.add_argument('--count', type=int, default=5, help='Number of episodes to process')
    parser.add_argument('--force', action='store_true', help='Force re-translation even if already done')
    args = parser.parse_args()
    
    print("🌐 InsightHunt Chinese Translation")
    print("=" * 50)
    
    # Get all episode files
    files = sorted(DATA_DIR.glob("*.json"))
    total = len(files)
    
    # Calculate batch range
    start_idx = args.start - 1  # 0-indexed
    end_idx = min(start_idx + args.count, total)
    batch_files = files[start_idx:end_idx]
    
    print(f"\n📊 Processing episodes {args.start} to {start_idx + len(batch_files)} of {total}")
    print(f"   Batch size: {len(batch_files)}\n")
    
    translated = 0
    skipped = 0
    
    for i, filepath in enumerate(batch_files):
        guest_name = filepath.stem
        episode_num = start_idx + i + 1
        print(f"[{episode_num}/{total}] Processing: {guest_name}")
        
        # Skip if already translated (unless --force)
        if not args.force and is_fully_translated(filepath):
            print(f"  ⏭️ Already fully translated, skipping")
            skipped += 1
            continue
        
        try:
            translate_episode(filepath)
            translated += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
        
        time.sleep(2)  # Rate limiting between episodes
    
    print("\n" + "=" * 50)
    print(f"✅ Batch complete!")
    print(f"   Translated: {translated}")
    print(f"   Skipped: {skipped}")
    print(f"\n💡 Next batch: python3 scripts/translate_to_chinese.py --start {end_idx + 1} --count {args.count}")

if __name__ == "__main__":
    main()
