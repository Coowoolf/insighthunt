#!/usr/bin/env python3
"""
Gemini 3 Flash Translation Script
"""

import json
import sys
import time
import warnings
from pathlib import Path

warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai

TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")
RETRANSLATION_LIST = Path("/Users/yaoguanghua/.gemini/antigravity/brain/8a1164b4-dbc6-4aec-b525-694a3652747f/episodes_need_retranslation.txt")
PROGRESS_FILE = TRANSCRIPTS_DIR / "retranslation_progress.json"

genai.configure(
    api_key="sk-46809d8691dd4542add62c1516537169",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)
model = genai.GenerativeModel('gemini-3-flash')

TRANSLATE_PROMPT = """你是一名专业的中英文翻译专家，专门翻译播客对话内容。请将以下英文播客转录完整翻译成中文。

翻译要求：
1. 保留说话人标记 (如 "Lenny (00:01:23):")
2. 保持对话的自然流畅性
3. 专业术语保留英文并附中文解释
4. 完整翻译，不要省略任何内容
5. 保持时间戳格式不变

英文转录内容：
{english_text}

请直接输出中文翻译："""


def load_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {"completed": [], "failed": []}

def save_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def load_episodes():
    with open(RETRANSLATION_LIST, 'r') as f:
        return [line.strip() for line in f if line.strip()]

def load_transcript(name):
    with open(TRANSCRIPTS_DIR / f"{name}.json", 'r', encoding='utf-8') as f:
        return json.load(f)

def save_transcript(name, data):
    with open(TRANSCRIPTS_DIR / f"{name}.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def call_api(prompt, retries=3):
    for i in range(retries):
        try:
            return model.generate_content(prompt).text
        except Exception as e:
            print(f"      ⚠️ Retry {i+1}: {e}")
            time.sleep(2 ** i * 2)
    return None

def split_chunks(text, max_chars=15000):
    paragraphs = text.split('\n\n')
    chunks, current = [], ""
    for p in paragraphs:
        if len(current) + len(p) < max_chars:
            current += p + "\n\n"
        else:
            if current: chunks.append(current.strip())
            current = p + "\n\n"
    if current.strip(): chunks.append(current.strip())
    return chunks

def translate_episode(name, idx, total):
    print(f"\n[{idx}/{total}] 📝 {name} (G3-Flash)")
    try:
        data = load_transcript(name)
        en = data.get("en", "")
        if not en: return {"guest": name, "status": "no_english"}
        
        chunks = split_chunks(en)
        print(f"    📊 {len(en):,} chars → {len(chunks)} chunks")
        
        translated = []
        for i, chunk in enumerate(chunks, 1):
            print(f"    🔄 Chunk {i}/{len(chunks)}...", end=" ", flush=True)
            result = call_api(TRANSLATE_PROMPT.format(english_text=chunk))
            if result:
                translated.append(result)
                print(f"✅ {len(result):,}")
            else:
                print("❌")
                return {"guest": name, "status": "failed"}
            if i < len(chunks): time.sleep(2)
        
        full = "\n\n".join(translated)
        data["zh"] = full
        save_transcript(name, data)
        print(f"    ✅ Done: {len(full):,} chars ({len(full)/len(en)*100:.1f}%)")
        return {"guest": name, "status": "success"}
    except Exception as e:
        print(f"    ❌ {e}")
        return {"guest": name, "status": "error", "error": str(e)}

def main():
    print("="*50)
    print("GEMINI 3 FLASH TRANSLATION")
    print("="*50)
    
    all_eps = load_episodes()
    progress = load_progress()
    remaining = [e for e in all_eps if e not in progress["completed"]]
    
    print(f"\nRemaining: {len(remaining)}")
    
    # G3 routes process from middle
    if len(sys.argv) > 1:
        route = int(sys.argv[1])
        mid = len(remaining) // 2
        size = 25
        if route == 1:
            remaining = remaining[mid:mid+size]
        else:
            remaining = remaining[mid-size:mid] if mid >= size else remaining[:mid]
        print(f"⚡ G3 Route {route}: {len(remaining)} episodes from middle")
    
    for i, name in enumerate(remaining, 1):
        progress = load_progress()
        if name in progress["completed"]:
            print(f"\n[{i}] ⏭️ {name} (已完成)")
            continue
        
        result = translate_episode(name, i, len(remaining))
        progress = load_progress()
        if result.get("status") == "success":
            if name not in progress["completed"]:
                progress["completed"].append(name)
        else:
            if name not in progress["failed"]:
                progress["failed"].append(name)
        save_progress(progress)
        if i < len(remaining): time.sleep(3)
    
    print("\n" + "="*50 + "\nDONE\n" + "="*50)

if __name__ == "__main__":
    main()
