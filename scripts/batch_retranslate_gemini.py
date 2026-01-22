#!/usr/bin/env python3
"""
Gemini 2.5 Flash Translation Script
Uses Gemini API for faster translation alongside Claude
"""

import json
import os
import sys
import time
import warnings
from pathlib import Path

# Suppress the deprecation warning
warnings.filterwarnings("ignore", category=FutureWarning)

import google.generativeai as genai

# Configuration
TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")
RETRANSLATION_LIST = Path("/Users/yaoguanghua/.gemini/antigravity/brain/8a1164b4-dbc6-4aec-b525-694a3652747f/episodes_need_retranslation.txt")
PROGRESS_FILE = TRANSCRIPTS_DIR / "retranslation_progress.json"

# Gemini API Configuration
genai.configure(
    api_key="sk-46809d8691dd4542add62c1516537169",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)
model = genai.GenerativeModel('gemini-2.5-flash')

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
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {"completed": [], "failed": []}


def save_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)


def load_episodes_to_retranslate():
    with open(RETRANSLATION_LIST, 'r') as f:
        return [line.strip() for line in f if line.strip()]


def load_transcript(guest_name: str) -> dict:
    file_path = TRANSCRIPTS_DIR / f"{guest_name}.json"
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_transcript(guest_name: str, data: dict):
    file_path = TRANSCRIPTS_DIR / f"{guest_name}.json"
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def call_gemini_api(prompt: str, max_retries: int = 3) -> str:
    """Call Gemini API with retry logic"""
    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            wait_time = (2 ** attempt) * 2
            print(f"      ⚠️ Attempt {attempt+1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"      ⏳ Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
            else:
                raise e
    return None


def split_transcript_into_chunks(text: str, max_chars: int = 15000) -> list:
    """Split transcript into chunks - Gemini can handle larger chunks"""
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
    """Translate a single episode"""
    print(f"\n[{index}/{total}] 📝 {guest_name} (Gemini)")
    
    try:
        data = load_transcript(guest_name)
        english_text = data.get("en", "")
        
        if not english_text:
            print(f"    ⚠️ No English transcript")
            return {"guest": guest_name, "status": "no_english"}
        
        chunks = split_transcript_into_chunks(english_text)
        print(f"    📊 {len(english_text):,} EN chars → {len(chunks)} chunks")
        
        translated_chunks = []
        for i, chunk in enumerate(chunks, 1):
            print(f"    🔄 Chunk {i}/{len(chunks)} ({len(chunk):,} chars)...", end=" ", flush=True)
            
            prompt = TRANSLATE_PROMPT.format(english_text=chunk)
            translated = call_gemini_api(prompt)
            
            if translated:
                translated_chunks.append(translated)
                print(f"✅ {len(translated):,} chars")
            else:
                print(f"❌")
                return {"guest": guest_name, "status": "failed", "error": f"Chunk {i} failed"}
            
            if i < len(chunks):
                time.sleep(2)
        
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
    print("="*60)
    print("GEMINI 2.5 FLASH TRANSLATION")
    print("="*60)
    
    all_episodes = load_episodes_to_retranslate()
    progress = load_progress()
    
    remaining = [e for e in all_episodes if e not in progress["completed"]]
    
    print(f"\nTotal: {len(all_episodes)} | Completed: {len(progress['completed'])} | Remaining: {len(remaining)}")
    
    # Gemini routes: process from the END of the list (opposite to Claude)
    if len(sys.argv) > 1:
        route_num = int(sys.argv[1])  # 1 or 2
        # Route 1: last 25, Route 2: second-to-last 25
        batch_size = 25
        if route_num == 1:
            start = max(0, len(remaining) - batch_size)
            end = len(remaining)
        else:  # route 2
            start = max(0, len(remaining) - 2 * batch_size)
            end = max(0, len(remaining) - batch_size)
        remaining = remaining[start:end]
        print(f"\n⚡ Gemini Route {route_num}: processing {len(remaining)} episodes from end")
    
    if not remaining:
        print("\n✅ All episodes already translated!")
        return
    
    for i, guest_name in enumerate(remaining, 1):
        # Skip if already completed by Claude
        progress = load_progress()
        if guest_name in progress["completed"]:
            print(f"\n[{i}/{len(remaining)}] ⏭️ {guest_name} (已由Claude完成)")
            continue
            
        result = translate_episode(guest_name, i, len(remaining))
        
        progress = load_progress()  # Reload to avoid race conditions
        if result.get("status") == "success":
            if guest_name not in progress["completed"]:
                progress["completed"].append(guest_name)
        else:
            if guest_name not in progress["failed"]:
                progress["failed"].append(guest_name)
        
        save_progress(progress)
        
        if i < len(remaining):
            print(f"    ⏳ Waiting 3s...")
            time.sleep(3)
    
    print("\n" + "="*60)
    print("GEMINI ROUTE COMPLETE")
    print("="*60)


if __name__ == "__main__":
    main()
