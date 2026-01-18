#!/usr/bin/env python3
"""
InsightHunt - Category Normalization Script
Consolidates 90+ long-tail categories into 6 core categories
"""

import json
from pathlib import Path
from collections import Counter

DATA_FILE = Path("data/extracted/sample_data.json")
OUTPUT_FILE = Path("data/extracted/sample_data.json")

# Category mapping: long-tail -> core category
CATEGORY_MAP = {
    # 产品战略 (product-strategy)
    "product-strategy": "product-strategy",
    "Product Strategy": "product-strategy",
    "Platform Strategy": "product-strategy",
    "Product Philosophy": "product-strategy",
    "Product Vision & Design": "product-strategy",
    "Product Design": "product-strategy",
    "Product Design / Onboarding": "product-strategy",
    "Product Management": "product-strategy",
    "Product Management / Culture": "product-strategy",
    "Product Discovery & Decision Making": "product-strategy",
    "Product Discovery / Execution": "product-strategy",
    "Product Lifecycle Management": "product-strategy",
    "Product Strategy & AI": "product-strategy",
    "Product Strategy & Portfolio Management": "product-strategy",
    "Product Development": "product-strategy",
    "Product Development / AI Strategy": "product-strategy",
    "Strategic Framework": "product-strategy",
    "Strategic Planning": "product-strategy",
    "Strategic Planning / Innovation": "product-strategy",
    "Strategic Positioning": "product-strategy",
    "Strategic Alignment": "product-strategy",
    "Strategy": "product-strategy",
    "Strategy & Leadership": "product-strategy",
    "Strategy & Operations": "product-strategy",
    "Strategy / Founder Psychology": "product-strategy",
    "Strategy / Market Analysis": "product-strategy",
    "Market Strategy": "product-strategy",
    "Positioning": "product-strategy",
    "Brand Strategy": "product-strategy",
    "Brand Personality": "product-strategy",
    "Naming Strategy": "product-strategy",
    "Framework": "product-strategy",
    
    # 增长指标 (growth-metrics)
    "growth-metrics": "growth-metrics",
    "Growth Strategy": "growth-metrics",
    "Growth Strategy / Metrics": "growth-metrics",
    "Growth & User Acquisition": "growth-metrics",
    "Monetization Strategy": "growth-metrics",
    "Metrics & Analytics": "growth-metrics",
    "Metrics & Evaluation": "growth-metrics",
    "Economic Metrics": "growth-metrics",
    "Evaluation / Economics": "growth-metrics",
    "Sales & Marketing": "growth-metrics",
    "Sales & Messaging": "growth-metrics",
    "Sales Enablement": "growth-metrics",
    "Marketing/Brand": "growth-metrics",
    "Content Strategy": "growth-metrics",
    "Investment Strategy": "growth-metrics",
    "Early-Stage Strategy": "growth-metrics",
    "Experimental Design / Analytics": "growth-metrics",
    
    # 执行交付 (execution)
    "execution": "execution",
    "Execution/Process": "execution",
    "Process/Philosophy": "execution",
    "Development Methodology": "execution",
    "Workflow Automation": "execution",
    "Project Management": "execution",
    "Design Process": "execution",
    "Operational Strategy": "execution",
    "Productivity & Operations": "execution",
    "Technical Architecture": "execution",
    "Technology Strategy": "execution",
    "Data Architecture": "execution",
    "Engineering Strategy": "execution",
    "AI Safety & Engineering": "execution",
    "AI Alignment / Safety": "execution",
    "Risk Management": "execution",
    "SEQUENTIAL/PROCESS": "execution",
    "HIERARCHICAL/STRUCTURAL": "execution",
    "FORMULA/EVALUATION": "execution",
    "COMPARATIVE/EVALUATIVE": "execution",
    
    # 团队文化 (team-culture)
    "team-culture": "team-culture",
    "Team Building": "team-culture",
    "Team Process": "team-culture",
    "Team Alignment": "team-culture",
    "Hiring & Culture": "team-culture",
    "Hiring & Decision Making": "team-culture",
    "Remote Work Culture": "team-culture",
    "Organizational Structure": "team-culture",
    "Organizational Strategy": "team-culture",
    "Organizational Dynamics": "team-culture",
    "Talent & Leadership": "team-culture",
    "Management & Communication": "team-culture",
    "Communication Strategy": "team-culture",
    
    # 领导力 (career-leadership)
    "career-leadership": "career-leadership",
    "Career Strategy": "career-leadership",
    "Career Strategy / Future of Work": "career-leadership",
    "Decision Making": "career-leadership",
    "decision-making": "career-leadership",
    "Leadership / Decision Making": "career-leadership",
    "Personal Development": "career-leadership",
    "Personal Productivity / Mindset": "career-leadership",
    "Mindset & Resilience": "career-leadership",
    "Mental Models": "career-leadership",
    "Role Evolution": "career-leadership",
    "Strategy & Soft Skills": "career-leadership",
    "Evolutionary Framework": "career-leadership",
    
    # 用户研究 (user-research)
    "user-research": "user-research",
    "User Psychology & UX Strategy": "user-research",
    "Retention & Engagement": "user-research",
    "Community / Product Design": "user-research",
    "Research Method": "user-research",
}

def normalize_category(category: str) -> str:
    """Normalize a category to one of 6 core categories"""
    if category in CATEGORY_MAP:
        return CATEGORY_MAP[category]
    
    # Fuzzy matching for unmapped categories
    category_lower = category.lower()
    if any(k in category_lower for k in ['product', 'strateg', 'platform', 'vision']):
        return "product-strategy"
    elif any(k in category_lower for k in ['growth', 'metric', 'sales', 'market', 'monetiz']):
        return "growth-metrics"
    elif any(k in category_lower for k in ['execut', 'process', 'workflow', 'engineer', 'tech']):
        return "execution"
    elif any(k in category_lower for k in ['team', 'culture', 'hiring', 'organiz', 'remote']):
        return "team-culture"
    elif any(k in category_lower for k in ['career', 'leader', 'decision', 'personal', 'mindset']):
        return "career-leadership"
    elif any(k in category_lower for k in ['user', 'research', 'ux', 'retention']):
        return "user-research"
    
    # Default fallback
    return "product-strategy"

def main():
    print("🔄 InsightHunt Category Normalization")
    print("=" * 50)
    
    # Load data
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Count before
    before_categories = Counter()
    for ep in data:
        for m in ep.get('methodologies', []):
            before_categories[m.get('category', 'unknown')] += 1
    
    print(f"\n📊 Before: {len(before_categories)} unique categories")
    
    # Normalize
    changes = 0
    for ep in data:
        for m in ep.get('methodologies', []):
            old_cat = m.get('category', '')
            new_cat = normalize_category(old_cat)
            if old_cat != new_cat:
                m['category'] = new_cat
                changes += 1
    
    # Count after
    after_categories = Counter()
    for ep in data:
        for m in ep.get('methodologies', []):
            after_categories[m.get('category', 'unknown')] += 1
    
    print(f"📊 After: {len(after_categories)} unique categories")
    print(f"✏️ Changes made: {changes}")
    
    print("\n📂 New category distribution:")
    for cat, count in after_categories.most_common():
        pct = count * 100 // sum(after_categories.values())
        print(f"  - {cat}: {count} ({pct}%)")
    
    # Save
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
