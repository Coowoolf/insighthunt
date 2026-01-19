#!/usr/bin/env python3
"""
InsightHunt - High-Speed Concurrent Translation Pipeline
Translates podcast transcripts using 100 concurrent API calls.

Usage: python3 scripts/translate_concurrent.py
"""

import asyncio
import aiohttp
import json
import os
import time
from pathlib import Path
from typing import Dict, List, Tuple
from concurrent.futures import ThreadPoolExecutor
import threading

# Configuration
# Antigravity Proxy Configuration - Gemini
API_URL = "http://127.0.0.1:8045/v1/messages"
API_KEY = "sk-cbb33b67c7f14a208a67aa705ebf80ee"
MODEL = "gemini-3-pro-high"
MAX_CONCURRENT = 5   # Further lower for Gemini bypass 429
CHUNK_SIZE = 10000   # Characters per chunk

# Paths
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts")
OUTPUT_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")

# Thread-safe counters
lock = threading.Lock()
completed_chunks = 0
failed_chunks = 0
total_chunks = 0


def get_translation_prompt(text: str, context: str = "") -> str:
    return f"""你是一位专业的中英翻译专家，专注于产品管理和创业领域的播客内容翻译。

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


async def translate_chunk_async(session: aiohttp.ClientSession, text: str, context: str, semaphore: asyncio.Semaphore) -> str:
    """Translate a single chunk asynchronously"""
    global completed_chunks, failed_chunks
    
    async with semaphore:
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
        }
        data = {
            'model': MODEL,
            'max_tokens': 8000,
            'messages': [{'role': 'user', 'content': get_translation_prompt(text, context)}]
        }
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                async with session.post(API_URL, headers=headers, json=data, timeout=aiohttp.ClientTimeout(total=180)) as response:
                    if response.status == 200:
                        result = await response.json()
                        with lock:
                            completed_chunks += 1
                        return result['content'][0]['text'].strip()
                    elif response.status in [429, 502, 503]:
                        wait_time = (2 ** attempt) * 2
                        await asyncio.sleep(wait_time)
                    else:
                        with lock:
                            failed_chunks += 1
                        return ""
            except Exception as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(2 ** attempt)
                else:
                    with lock:
                        failed_chunks += 1
                    return ""
        
        with lock:
            failed_chunks += 1
        return ""


def split_into_chunks(text: str, chunk_size: int = CHUNK_SIZE) -> List[str]:
    """Split text into chunks at sentence boundaries"""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        if end < len(text):
            for marker in ['. ', '.\n', '? ', '!\n', '\n\n']:
                last_break = text[start:end].rfind(marker)
                if last_break > chunk_size * 0.7:
                    end = start + last_break + len(marker)
                    break
        chunks.append(text[start:end])
        start = end
    return chunks


async def translate_transcript_async(filepath: Path, session: aiohttp.ClientSession, semaphore: asyncio.Semaphore) -> Tuple[str, Dict]:
    """Translate a complete transcript file concurrently"""
    global total_chunks
    
    guest_name = filepath.stem
    
    with open(filepath, 'r', encoding='utf-8') as f:
        text_en = f.read()
    
    chunks = split_into_chunks(text_en)
    
    with lock:
        total_chunks += len(chunks)
    
    # Translate all chunks concurrently
    tasks = []
    for i, chunk in enumerate(chunks):
        context = f"嘉宾: {guest_name}, 第 {i+1}/{len(chunks)} 段"
        tasks.append(translate_chunk_async(session, chunk, context, semaphore))
    
    translated_chunks = await asyncio.gather(*tasks)
    
    text_zh = "\n\n".join([c for c in translated_chunks if c])
    
    return guest_name, {
        "guest": guest_name,
        "en": text_en,
        "zh": text_zh,
        "chunks_count": len(chunks)
    }


async def main():
    global completed_chunks, failed_chunks, total_chunks
    
    print("🚀 InsightHunt High-Speed Concurrent Translation")
    print("=" * 60)
    print(f"📊 Concurrency: {MAX_CONCURRENT} parallel requests")
    print(f"🤖 Model: {MODEL}")
    print()
    
    # Get untranslated files
    all_transcripts = sorted(TRANSCRIPTS_DIR.glob("*.txt"))
    
    processed = set()
    for f in OUTPUT_DIR.glob("*.json"):
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
                if data.get('zh') and len(data.get('zh', '')) > 100:
                    processed.add(f.stem)
        except:
            pass
    
    unprocessed = [t for t in all_transcripts if t.stem not in processed]
    
    print(f"📊 Status: {len(processed)}/{len(all_transcripts)} already translated")
    print(f"📌 Remaining: {len(unprocessed)} transcripts")
    print()
    
    if not unprocessed:
        print("🎉 All transcripts already translated!")
        return
    
    # Create semaphore and session
    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    
    start_time = time.time()
    success_count = 0
    
    async with aiohttp.ClientSession() as session:
        # Process all transcripts concurrently
        tasks = [translate_transcript_async(fp, session, semaphore) for fp in unprocessed]
        
        # Use as_completed for progress updates
        for i, coro in enumerate(asyncio.as_completed(tasks)):
            try:
                guest_name, data = await coro
                
                # Save result
                output_path = OUTPUT_DIR / f"{guest_name}.json"
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                char_en = len(data['en'])
                char_zh = len(data['zh'])
                
                elapsed = time.time() - start_time
                rate = (i + 1) / elapsed * 60  # transcripts per minute
                
                print(f"[{i+1}/{len(unprocessed)}] ✅ {guest_name}: {char_en:,} → {char_zh:,} chars")
                print(f"    📊 Chunks: {completed_chunks}/{total_chunks} | Speed: {rate:.1f}/min")
                
                if char_zh > 100:
                    success_count += 1
                    
            except Exception as e:
                print(f"[{i+1}/{len(unprocessed)}] ❌ Error: {e}")
    
    elapsed = time.time() - start_time
    print()
    print("=" * 60)
    print(f"🏁 Translation Complete!")
    print(f"✅ Success: {success_count}/{len(unprocessed)}")
    print(f"⏱️ Time: {elapsed/60:.1f} minutes")
    print(f"📊 Speed: {success_count / elapsed * 60:.1f} transcripts/minute")


if __name__ == "__main__":
    asyncio.run(main())
