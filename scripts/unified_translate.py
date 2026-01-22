#!/usr/bin/env python3
"""
Unified Translation Script - Supports Claude, Gemini 2.5, Gemini 3
Each route gets assigned a SLOT (0-14) and processes every 15th episode
This ensures NO overlap between any routes
"""

import json
import sys
import time
import warnings
import requests
from pathlib import Path

warnings.filterwarnings("ignore", category=FutureWarning)

TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")
RETRANSLATION_LIST = Path("/Users/yaoguanghua/.gemini/antigravity/brain/8a1164b4-dbc6-4aec-b525-694a3652747f/episodes_need_retranslation.txt")
PROGRESS_FILE = TRANSCRIPTS_DIR / "retranslation_progress.json"

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


class ClaudeTranslator:
    """Claude Sonnet 4.5 via direct HTTP"""
    def __init__(self):
        self.url = "http://127.0.0.1:8045/v1/messages"
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": "sk-46809d8691dd4542add62c1516537169",
            "anthropic-version": "2023-06-01"
        }
    
    def translate(self, prompt, retries=3):
        for i in range(retries):
            try:
                resp = requests.post(self.url, headers=self.headers, json={
                    "model": "claude-sonnet-4-5",
                    "max_tokens": 16000,
                    "messages": [{"role": "user", "content": prompt}]
                }, timeout=180)
                if resp.status_code == 200:
                    return resp.json()["content"][0]["text"]
                raise Exception(f"HTTP {resp.status_code}")
            except Exception as e:
                print(f"      ⚠️ Retry {i+1}: {e}")
                time.sleep(2 ** i * 2)
        return None


class GeminiTranslator:
    """Gemini via google.generativeai"""
    def __init__(self, model_name):
        import google.generativeai as genai
        genai.configure(
            api_key="sk-46809d8691dd4542add62c1516537169",
            transport='rest',
            client_options={'api_endpoint': 'http://127.0.0.1:8045'}
        )
        self.model = genai.GenerativeModel(model_name)
        self.model_name = model_name
    
    def translate(self, prompt, retries=3):
        for i in range(retries):
            try:
                return self.model.generate_content(prompt).text
            except Exception as e:
                print(f"      ⚠️ Retry {i+1}: {e}")
                time.sleep(2 ** i * 2)
        return None


def translate_episode(name, translator, model_label):
    print(f"\n📝 {name} ({model_label})")
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
            result = translator.translate(TRANSLATE_PROMPT.format(english_text=chunk))
            if result:
                translated.append(result)
                print(f"✅ {len(result):,}")
            else:
                print("❌")
                return False
            if i < len(chunks): time.sleep(2)
        
        full = "\n\n".join(translated)
        data["zh"] = full
        save_transcript(name, data)
        print(f"    ✅ Done: {len(full):,} chars ({len(full)/len(en)*100:.1f}%)")
        return True
    except Exception as e:
        print(f"    ❌ {e}")
        return False


def main():
    if len(sys.argv) < 3:
        print("Usage: python unified_translate.py <model> <slot>")
        print("  model: claude | gemini25 | gemini3")
        print("  slot: 0-14 (each slot processes every 15th episode)")
        sys.exit(1)
    
    model_type = sys.argv[1]
    slot = int(sys.argv[2])
    
    # Initialize translator
    if model_type == "claude":
        translator = ClaudeTranslator()
        label = "Claude"
    elif model_type == "gemini25":
        translator = GeminiTranslator("gemini-2.5-flash")
        label = "G2.5"
    elif model_type == "gemini3":
        translator = GeminiTranslator("gemini-3-flash")
        label = "G3"
    else:
        print(f"Unknown model: {model_type}")
        sys.exit(1)
    
    print("="*50)
    print(f"TRANSLATOR: {label} | SLOT: {slot}/15")
    print("="*50)
    
    all_eps = load_episodes()
    
    # Get episodes for this slot: every 15th episode starting from slot
    my_episodes = [all_eps[i] for i in range(slot, len(all_eps), 15)]
    print(f"Assigned {len(my_episodes)} episodes for slot {slot}")
    
    for i, name in enumerate(my_episodes, 1):
        # Check if already completed
        progress = load_progress()
        if name in progress["completed"]:
            print(f"\n[{i}/{len(my_episodes)}] ⏭️ {name} (已完成)")
            continue
        
        print(f"\n[{i}/{len(my_episodes)}]", end="")
        success = translate_episode(name, translator, label)
        
        # Update progress
        progress = load_progress()
        if success:
            if name not in progress["completed"]:
                progress["completed"].append(name)
        else:
            if name not in progress["failed"]:
                progress["failed"].append(name)
        save_progress(progress)
        
        time.sleep(3)
    
    print("\n" + "="*50)
    print(f"SLOT {slot} COMPLETE")
    print("="*50)


if __name__ == "__main__":
    main()
