#!/usr/bin/env python3
"""
Retry Failed Translations - Uses only Gemini models
"""

import json
import sys
import time
import warnings
from pathlib import Path

warnings.filterwarnings("ignore", category=FutureWarning)
import google.generativeai as genai

TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")
PROGRESS_FILE = TRANSCRIPTS_DIR / "retranslation_progress.json"

genai.configure(
    api_key="sk-46809d8691dd4542add62c1516537169",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

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

def load_transcript(name):
    with open(TRANSCRIPTS_DIR / f"{name}.json", 'r', encoding='utf-8') as f:
        return json.load(f)

def save_transcript(name, data):
    with open(TRANSCRIPTS_DIR / f"{name}.json", 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def split_chunks(text, max_chars=12000):
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

def translate_episode(name, model, label):
    print(f"\n📝 {name} ({label})")
    try:
        data = load_transcript(name)
        en = data.get("en", "")
        if not en:
            print(f"    ⚠️ No English")
            return False
        
        chunks = split_chunks(en)
        print(f"    📊 {len(en):,} chars → {len(chunks)} chunks")
        
        translated = []
        for i, chunk in enumerate(chunks, 1):
            print(f"    🔄 {i}/{len(chunks)}...", end=" ", flush=True)
            
            for attempt in range(3):
                try:
                    result = model.generate_content(TRANSLATE_PROMPT.format(english_text=chunk)).text
                    translated.append(result)
                    print(f"✅ {len(result):,}")
                    break
                except Exception as e:
                    print(f"⚠️ Retry {attempt+1}: {e}")
                    time.sleep(2 ** attempt * 2)
            else:
                print("❌")
                return False
            
            if i < len(chunks): time.sleep(2)
        
        full = "\n\n".join(translated)
        data["zh"] = full
        save_transcript(name, data)
        ratio = len(full) / len(en) * 100
        print(f"    ✅ Done: {len(full):,} chars ({ratio:.1f}%)")
        return True
    except Exception as e:
        print(f"    ❌ {e}")
        return False


def main():
    if len(sys.argv) < 3:
        print("Usage: python retry_failed.py <model> <slot>")
        print("  model: gemini25 | gemini3")
        print("  slot: 0-9")
        sys.exit(1)
    
    model_type = sys.argv[1]
    slot = int(sys.argv[2])
    
    # Initialize model
    if model_type == "gemini25":
        model = genai.GenerativeModel("gemini-2.5-flash")
        label = "G2.5"
    elif model_type == "gemini3":
        model = genai.GenerativeModel("gemini-3-flash")
        label = "G3"
    else:
        print(f"Unknown model: {model_type}")
        sys.exit(1)
    
    print("="*50)
    print(f"RETRY FAILED | {label} | SLOT {slot}")
    print("="*50)
    
    # Get failed list (exclude those already in completed)
    progress = load_progress()
    completed = set(progress.get("completed", []))
    failed = progress.get("failed", [])
    to_retry = [e for e in failed if e not in completed]
    
    print(f"Failed episodes to retry: {len(to_retry)}")
    
    # Get episodes for this slot (every 10th starting from slot)
    my_episodes = [to_retry[i] for i in range(slot, len(to_retry), 10)]
    print(f"This slot ({slot}): {len(my_episodes)} episodes")
    
    if not my_episodes:
        print("No episodes assigned to this slot")
        return
    
    for i, name in enumerate(my_episodes, 1):
        # Check if already completed by another route
        progress = load_progress()
        if name in progress["completed"]:
            print(f"\n[{i}/{len(my_episodes)}] ⏭️ {name} (已完成)")
            continue
        
        print(f"\n[{i}/{len(my_episodes)}]", end="")
        success = translate_episode(name, model, label)
        
        # Update progress
        progress = load_progress()
        if success:
            if name not in progress["completed"]:
                progress["completed"].append(name)
            # Remove from failed if successful
            if name in progress["failed"]:
                progress["failed"].remove(name)
        save_progress(progress)
        
        time.sleep(3)
    
    print("\n" + "="*50)
    print(f"SLOT {slot} COMPLETE")
    print("="*50)


if __name__ == "__main__":
    main()
