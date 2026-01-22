#!/usr/bin/env python3
"""
Batch Retranslation Script for Incomplete Chinese Transcripts
Uses Claude Sonnet 4.5 via direct HTTP requests (Antigravity proxy)
Sequential processing with retry logic and resume capability
"""

import json
import os
import sys
import time
import requests
from pathlib import Path

# Configuration
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")
RETRANSLATION_LIST = Path("/Users/yaoguanghua/.gemini/antigravity/brain/8a1164b4-dbc6-4aec-b525-694a3652747f/episodes_need_retranslation.txt")
PROGRESS_FILE = TRANSCRIPTS_DIR / "retranslation_progress.json"
LOG_FILE = TRANSCRIPTS_DIR / "retranslation_log.json"

# API Configuration
API_URL = "http://127.0.0.1:8045/v1/messages"
API_KEY = "sk-46809d8691dd4542add62c1516537169"
MODEL = "claude-sonnet-4-5"

HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01"
}

# Translation prompt
TRANSLATE_PROMPT = """你是一名专业的中英文翻译专家，专门翻译播客对话内容。请将以下英文播客转录完整翻译成中文。

翻译要求：
1. 保留说话人标记 (如 "Lenny (00:01:23):")
2. 保持对话的自然流畅性
3. 专业术语保留英文并附中文解释
4. 完整翻译，不要省略任何内容
5. 保持时间戳格式不变

英文转录内容：
{english_text}

请直接输出中文翻译，不需要任何额外说明："""


def load_progress():
    """Load progress from previous runs"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {"completed": [], "failed": []}


def save_progress(progress):
    """Save progress for resume capability"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)


def load_episodes_to_retranslate():
    """Load the list of episodes that need retranslation"""
    with open(RETRANSLATION_LIST, 'r') as f:
        return [line.strip() for line in f if line.strip()]


def load_transcript(guest_name: str) -> dict:
    """Load a transcript file"""
    file_path = TRANSCRIPTS_DIR / f"{guest_name}.json"
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_transcript(guest_name: str, data: dict):
    """Save updated transcript"""
    file_path = TRANSCRIPTS_DIR / f"{guest_name}.json"
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def call_claude_api(prompt: str, max_retries: int = 3) -> str:
    """Call Claude API with retry logic using direct HTTP requests"""
    payload = {
        "model": MODEL,
        "max_tokens": 16000,
        "messages": [{"role": "user", "content": prompt}]
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=180)
            
            if response.status_code == 200:
                data = response.json()
                return data["content"][0]["text"]
            else:
                raise Exception(f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            wait_time = (2 ** attempt) * 2  # 2, 4, 8 seconds
            print(f"      ⚠️ Attempt {attempt+1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"      ⏳ Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
            else:
                raise e
    return None


def split_transcript_into_chunks(text: str, max_chars: int = 12000) -> list:
    """Split transcript into chunks at paragraph boundaries"""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""
    
    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 < max_chars:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
    
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks


def translate_episode(guest_name: str, index: int, total: int) -> dict:
    """Translate a single episode with chunking and retry"""
    print(f"\n[{index}/{total}] 📝 {guest_name}")
    
    try:
        # Load transcript
        data = load_transcript(guest_name)
        english_text = data.get("en", "")
        
        if not english_text:
            print(f"    ⚠️ No English transcript found")
            return {"guest": guest_name, "status": "no_english"}
        
        # Split into chunks
        chunks = split_transcript_into_chunks(english_text)
        print(f"    📊 {len(english_text):,} EN chars → {len(chunks)} chunks")
        
        # Translate each chunk
        translated_chunks = []
        for i, chunk in enumerate(chunks, 1):
            print(f"    🔄 Chunk {i}/{len(chunks)} ({len(chunk):,} chars)...", end=" ", flush=True)
            
            prompt = TRANSLATE_PROMPT.format(english_text=chunk)
            translated = call_claude_api(prompt)
            
            if translated:
                translated_chunks.append(translated)
                print(f"✅ {len(translated):,} chars")
            else:
                print(f"❌")
                return {"guest": guest_name, "status": "failed", "error": f"Chunk {i} failed"}
            
            # Delay between chunks (3 seconds for Claude)
            if i < len(chunks):
                time.sleep(3)
        
        # Combine and save
        full_translation = "\n\n".join(translated_chunks)
        data["zh"] = full_translation
        data["chunks_count"] = len(chunks)
        save_transcript(guest_name, data)
        
        ratio = len(full_translation) / len(english_text) * 100
        print(f"    ✅ Complete: {len(full_translation):,} ZH chars ({ratio:.1f}%)")
        
        return {
            "guest": guest_name,
            "status": "success",
            "en_len": len(english_text),
            "zh_len": len(full_translation),
            "ratio": ratio
        }
        
    except Exception as e:
        print(f"    ❌ Error: {e}")
        return {"guest": guest_name, "status": "error", "error": str(e)}


def main():
    """Main - sequential processing with resume"""
    print("="*60)
    print("BATCH RETRANSLATION - Claude Sonnet 4.5")
    print("="*60)
    
    # Load episodes and progress
    all_episodes = load_episodes_to_retranslate()
    progress = load_progress()
    
    # Filter out already completed
    remaining = [e for e in all_episodes if e not in progress["completed"]]
    
    print(f"\nTotal: {len(all_episodes)} | Completed: {len(progress['completed'])} | Remaining: {len(remaining)}")
    
    # Check for batch argument
    if len(sys.argv) > 1:
        batch_num = int(sys.argv[1])
        batch_size = 25
        start = (batch_num - 1) * batch_size
        end = start + batch_size
        remaining = remaining[start:end]
        print(f"\n⚡ Running batch {batch_num}: episodes {start+1}-{min(end, len(all_episodes))}")
    
    if not remaining:
        print("\n✅ All episodes already translated!")
        return
    
    results = []
    
    for i, guest_name in enumerate(remaining, 1):
        result = translate_episode(guest_name, i, len(remaining))
        results.append(result)
        
        # Update progress
        if result.get("status") == "success":
            progress["completed"].append(guest_name)
        else:
            progress["failed"].append(guest_name)
        
        save_progress(progress)
        
        # Delay between episodes (5 seconds for Claude rate limits)
        if i < len(remaining):
            print(f"    ⏳ Waiting 5s...")
            time.sleep(5)
    
    # Save results
    with open(LOG_FILE, 'w') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    success = sum(1 for r in results if r.get("status") == "success")
    print(f"✅ Success: {success}/{len(results)}")
    print(f"❌ Failed: {len(results) - success}")
    print(f"\nProgress saved to: {PROGRESS_FILE}")


if __name__ == "__main__":
    main()
