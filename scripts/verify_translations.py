import json
import os
from pathlib import Path
from collections import defaultdict

TRANSCRIPTS_DIR = Path("/Users/yaoguanghua/Downloads/Lenny_Podcast_Transcripts")
OUTPUT_DIR = Path("/Users/yaoguanghua/Projects/Skills/insighthunt/data/transcripts")

def verify_translations():
    print("🔍 Starting Translation Verification...")
    print("=" * 60)

    # 1. Get Source Files
    source_files = {f.stem for f in TRANSCRIPTS_DIR.glob("*.txt")}
    print(f"📄 Source Transcripts: {len(source_files)}")

    # 2. Get Output Files
    output_files = list(OUTPUT_DIR.glob("*.json"))
    print(f"📂 Output JSON Files: {len(output_files)}")

    # 3. Check for Missing Translations
    translated_stems = {f.stem for f in output_files}
    missing = source_files - translated_stems
    if missing:
        print(f"❌ Missing {len(missing)} translations:")
        for m in sorted(missing):
            print(f"  - {m}")
    else:
        print("✅ No missing files (Count matches)")

    # 4. Check Content Quality & Duplicates
    errors = []
    short_content = []
    content_hashes = defaultdict(list)
    
    total_valid = 0

    for f in output_files:
        try:
            with open(f, 'r', encoding='utf-8') as fp:
                data = json.load(fp)
                
            zh_content = data.get('zh', '').strip()
            en_content = data.get('en', '').strip()
            
            # Check for empty or very short translation
            if not zh_content:
                errors.append(f"{f.name}: Empty 'zh' content")
            elif len(zh_content) < 500: # Threshold for "is this actually translated?"
                short_content.append(f"{f.name}: Short 'zh' content ({len(zh_content)} chars)")
            
            # Check for duplicates based on English content (source of truth)
            # Using first 1000 chars as a rough signature to avoid memory issues with huge texts
            signature = en_content[:1000]
            if signature:
                content_hashes[signature].append(f.name)

            total_valid += 1

        except json.JSONDecodeError:
            errors.append(f"{f.name}: Invalid JSON format")
        except Exception as e:
            errors.append(f"{f.name}: Error reading file - {str(e)}")

    # Report Errors
    if errors:
        print(f"\n❌ Found {len(errors)} Critical Errors:")
        for e in errors:
            print(f"  - {e}")
    else:
        print("\n✅ No Critical Errors found.")

    # Report Short Content (Warnings)
    if short_content:
        print(f"\n⚠️ Found {len(short_content)} Potential Issues (Short Content < 500 chars):")
        for s in short_content:
            print(f"  - {s}")

    # Report Duplicates
    duplicates = {k: v for k, v in content_hashes.items() if len(v) > 1}
    if duplicates:
        print(f"\n⚠️ Found {len(duplicates)} Potential Duplicates (Same English Start):")
        for sig, files in duplicates.items():
            print(f"  - {files}")
    else:
        print("\n✅ No Duplicates found (based on content check).")

    print("\n" + "=" * 60)
    print(f"📊 Final Summary:")
    print(f"  Total Valid: {total_valid}/{len(source_files)}")
    print(f"  Success Rate: {total_valid / len(source_files) * 100:.1f}%")

if __name__ == "__main__":
    verify_translations()
