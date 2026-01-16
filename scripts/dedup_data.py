#!/usr/bin/env python3
"""
Deduplication script for InsightHunt data.
1. Merges April Dunford episodes into one guest with all methodologies
2. Adds guest prefix to duplicate methodology names
3. Regenerates sample_data.json
"""

import json
import os
from pathlib import Path

# Paths
JSON_DIR = Path("data/extracted/json")
OUTPUT_FILE = Path("data/extracted/sample_data.json")

def load_all_episodes():
    """Load all individual JSON files"""
    episodes = []
    for json_file in sorted(JSON_DIR.glob("*.json")):
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            data['filename'] = json_file.stem
            episodes.append(data)
    return episodes

def merge_april_dunford(episodes):
    """Merge April Dunford and April Dunford 2.0 into one entry"""
    merged = []
    april_episodes = []
    
    for ep in episodes:
        guest_name = ep.get('guest', {}).get('name', ep.get('filename', ''))
        if 'April Dunford' in guest_name or 'April Dunford' in ep.get('filename', ''):
            april_episodes.append(ep)
        else:
            merged.append(ep)
    
    if april_episodes:
        # Merge all April Dunford episodes
        primary = april_episodes[0]
        all_methodologies = []
        all_takeaways = set()
        all_quotes = []
        episode_summaries = []
        
        for ep in april_episodes:
            # Collect methodologies
            for m in ep.get('methodologies', []):
                # Add episode context to methodology name if needed
                m['_source_episode'] = ep.get('filename', '')
                all_methodologies.append(m)
            
            # Collect takeaways
            for t in ep.get('keyTakeaways', []):
                all_takeaways.add(t)
            
            # Collect quotes
            for q in ep.get('notableQuotes', []):
                all_quotes.append(q)
            
            # Collect episode summaries
            if ep.get('episodeSummary'):
                episode_summaries.append(ep['episodeSummary'])
        
        # Create merged entry
        merged_entry = {
            'guest': {
                'name': 'April Dunford',
                'title': 'Author of Obviously Awesome & Sales Pitch',
                'company': 'April Dunford Consulting',
                'background': "The world's foremost authority on product positioning. She has a 25-year career as a VP of Marketing at 7 startups (6 acquired) and has consulted with over 200 tech companies including Google and Epic Games."
            },
            'episodeSummary': ' '.join(episode_summaries[:2]) if episode_summaries else None,
            'keyTakeaways': list(all_takeaways)[:8],
            'methodologies': all_methodologies,
            'notableQuotes': all_quotes,
            'filename': 'April Dunford (Combined)'
        }
        merged.append(merged_entry)
        print(f"  ✅ Merged {len(april_episodes)} April Dunford episodes: {[e.get('filename') for e in april_episodes]}")
    
    return merged

def disambiguate_methodology_names(episodes):
    """Add guest name prefix to duplicate methodology names"""
    # Count methodology names
    name_counts = {}
    for ep in episodes:
        for m in ep.get('methodologies', []):
            name = m.get('name', '')
            if name not in name_counts:
                name_counts[name] = []
            name_counts[name].append(ep.get('guest', {}).get('name', ep.get('filename', '')))
    
    # Find duplicates
    duplicates = {name: guests for name, guests in name_counts.items() if len(guests) > 1}
    
    if duplicates:
        print(f"\n  🔄 Disambiguating {len(duplicates)} duplicate methodology names:")
        for name, guests in duplicates.items():
            print(f"     • '{name}' found in: {guests}")
    
    # Rename duplicates
    for ep in episodes:
        guest_name = ep.get('guest', {}).get('name', ep.get('filename', ''))
        for m in ep.get('methodologies', []):
            name = m.get('name', '')
            if name in duplicates:
                # Add guest name as prefix/suffix
                short_guest = guest_name.split()[0] if guest_name else 'Unknown'
                m['name'] = f"{m['name']} ({short_guest}'s Approach)"
                print(f"     → Renamed to: {m['name']}")
    
    return episodes

def main():
    print("🧹 InsightHunt Data Deduplication\n")
    
    # Load all episodes
    episodes = load_all_episodes()
    print(f"📊 Loaded {len(episodes)} episodes from {JSON_DIR}\n")
    
    # Step 1: Merge April Dunford
    print("1️⃣ Merging duplicate guest entries...")
    episodes = merge_april_dunford(episodes)
    
    # Step 2: Disambiguate methodology names
    print("\n2️⃣ Checking for duplicate methodology names...")
    episodes = disambiguate_methodology_names(episodes)
    
    # Step 3: Save merged data
    print(f"\n3️⃣ Saving deduplicated data to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(episodes, f, indent=2, ensure_ascii=False)
    
    # Summary
    total_methods = sum(len(ep.get('methodologies', [])) for ep in episodes)
    print(f"\n✅ Deduplication complete!")
    print(f"   Episodes: {len(episodes)}")
    print(f"   Methodologies: {total_methods}")

if __name__ == "__main__":
    main()
