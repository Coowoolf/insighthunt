#!/usr/bin/env python3
"""
InsightHunt - Transcript Translation Pipeline
Translates 297 podcast transcripts from English to Chinese.

Usage: python3 scripts/translate_transcripts.py --count 10
"""

from anthropic import Anthropic
import json
import os
import time
import argparse
from pathlib import Path
from typing import Dict

# Antigravity Proxy Configuration
client = Anthropic(
    base_url="http://127.0.0.1:8045",
    api_key="sk-cbb33b67c7f14a208a67aa705ebf80ee"
)

MODEL = "gemini-3-pro-high"

# Paths
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts")
OUTPUT_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")


def translate_chunk(text: str, context: str = "") -> str:
    """Translate a chunk of transcript text to Chinese"""
    
    prompt = f"""你是一位专业的中英翻译专家，专注于产品管理和创业领域的播客内容翻译。

请将以下播客转录文本翻译成中文。

翻译原则：
1. 保持对话的自然流畅，像中文原生对话一样
2. 专业术语保留英文缩写（如 PMF, OKR, MVP, A/B Test）
3. 人名和公司名保持英文
4. 保留说话人的语气和风格
5. 适当处理口语化表达，使其更符合中文习惯

{f"上下文背景: {context}" if context else ""}

原文:
{text}

请直接输出翻译后的中文，不需要额外解释。"""

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"    ⚠️ Translation error: {e}")
        return ""


def translate_transcript(filepath: Path) -> Dict:
    """Translate a complete transcript file"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        text_en = f.read()
    
    # Get guest name from filename
    guest_name = filepath.stem
    
    # Split into chunks of ~3000 characters for translation
    # This ensures we stay within token limits while maintaining context
    chunk_size = 3000
    overlap = 200  # Overlap for context continuity
    
    chunks = []
    start = 0
    while start < len(text_en):
        end = min(start + chunk_size, len(text_en))
        # Try to end at a sentence boundary
        if end < len(text_en):
            for marker in ['. ', '.\n', '? ', '?\n', '! ', '!\n']:
                last_period = text_en[start:end].rfind(marker)
                if last_period > chunk_size * 0.7:
                    end = start + last_period + len(marker)
                    break
        chunks.append(text_en[start:end])
        start = end - overlap if end < len(text_en) else end
    
    print(f"    📄 {len(chunks)} chunks to translate")
    
    translated_chunks = []
    for i, chunk in enumerate(chunks):
        context = f"嘉宾: {guest_name}, 第 {i+1}/{len(chunks)} 段"
        print(f"    🔄 Translating chunk {i+1}/{len(chunks)}...")
        translated = translate_chunk(chunk, context)
        if translated:
            translated_chunks.append(translated)
        time.sleep(1)  # Rate limiting
    
    text_zh = "\n\n".join(translated_chunks)
    
    return {
        "guest": guest_name,
        "en": text_en,
        "zh": text_zh,
        "chunks_count": len(chunks)
    }


def get_processed_transcripts() -> set:
    """Get set of already translated transcripts"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    return {f.stem for f in OUTPUT_DIR.glob("*.json")}


def main():
    parser = argparse.ArgumentParser(description='Translate podcast transcripts to Chinese')
    parser.add_argument('--count', type=int, default=10, help='Number to process')
    parser.add_argument('--list', action='store_true', help='List unprocessed and exit')
    args = parser.parse_args()
    
    print("🌐 InsightHunt Transcript Translation")
    print("=" * 50)
    
    # Get all transcripts
    all_transcripts = sorted(TRANSCRIPTS_DIR.glob("*.txt"))
    processed = get_processed_transcripts()
    unprocessed = [t for t in all_transcripts if t.stem not in processed]
    
    print(f"\n📊 Status: {len(processed)}/{len(all_transcripts)} translated")
    print(f"   Remaining: {len(unprocessed)}")
    
    if args.list:
        print("\nUnprocessed transcripts:")
        for i, t in enumerate(unprocessed[:20], 1):
            print(f"  {i}. {t.stem}")
        if len(unprocessed) > 20:
            print(f"  ... and {len(unprocessed) - 20} more")
        return
    
    if not unprocessed:
        print("🎉 All transcripts translated!")
        return
    
    batch = unprocessed[:args.count]
    print(f"\n🎯 Processing {len(batch)} transcripts\n")
    
    success = 0
    for i, filepath in enumerate(batch):
        print(f"\n[{len(processed) + i + 1}/{len(all_transcripts)}] {filepath.stem}")
        
        try:
            data = translate_transcript(filepath)
            
            # Save
            output_path = OUTPUT_DIR / f"{filepath.stem}.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            char_count_en = len(data['en'])
            char_count_zh = len(data['zh'])
            print(f"    ✅ Done: {char_count_en:,} → {char_count_zh:,} chars")
            success += 1
            
        except Exception as e:
            print(f"    ❌ Error: {e}")
        
        time.sleep(2)
    
    print(f"\n{'='*50}")
    print(f"✅ Batch Complete: {success}/{len(batch)}")
    print(f"📌 Next: python3 scripts/translate_transcripts.py --count {args.count}")


if __name__ == "__main__":
    main()
