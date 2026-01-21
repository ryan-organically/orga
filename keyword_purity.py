#!/usr/bin/env python3
"""
Keyword Purity Scoring System
Processes CSV files with keyword data and ranks them by organic purity score.
"""

import csv
import sys
from typing import List, Dict

def calculate_purity(keywords: List[Dict]) -> List[Dict]:
    """Calculate purity scores for all keywords."""

    # Filter out keywords with no volume
    keywords = [k for k in keywords if k['volume'] is not None]

    if not keywords:
        return []

    # Find max values for normalization
    max_cpc = max(k['cpc'] for k in keywords)
    max_volume = max(k['volume'] for k in keywords)

    # Calculate median CPC for missing values
    cpcs = sorted([k['cpc'] for k in keywords if k['cpc'] > 0])
    median_cpc = cpcs[len(cpcs) // 2] if cpcs else 0

    # Score each keyword
    for kw in keywords:
        # Apply defaults
        difficulty = kw['difficulty'] if kw['difficulty'] is not None else 15
        cpc = kw['cpc'] if kw['cpc'] > 0 else median_cpc

        # Normalize
        difficulty_score = 100 - difficulty
        cpc_score = (cpc / max_cpc * 100) if max_cpc > 0 else 0
        volume_score = (kw['volume'] / max_volume * 100) if max_volume > 0 else 0

        # Calculate purity
        purity = (difficulty_score * 0.35) + (cpc_score * 0.35) + (volume_score * 0.30)

        kw['purity'] = round(purity, 2)
        kw['difficulty'] = difficulty
        kw['cpc'] = cpc

    # Sort by purity descending
    keywords.sort(key=lambda x: x['purity'], reverse=True)

    return keywords

def assign_tier(kw: Dict) -> str:
    """Assign tier based on purity and difficulty."""
    purity = kw['purity']
    difficulty = kw['difficulty']

    if purity >= 60:
        return "Tier 1: Pure Gold"
    elif purity >= 45 and difficulty <= 20:
        return "Tier 2: High Purity"
    elif purity >= 35 and difficulty <= 30:
        return "Tier 3: Solid"
    else:
        return "Below Threshold"

def process_csv(input_file: str, output_file: str = None):
    """Process keyword CSV and output ranked results."""

    # Read CSV
    keywords = []
    with open(input_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            try:
                keywords.append({
                    'keyword': row.get('Keyword', row.get('keyword', '')),
                    'volume': int(row.get('Volume', row.get('volume', 0))) if row.get('Volume', row.get('volume')) else None,
                    'difficulty': int(row.get('Difficulty', row.get('difficulty', ''))) if row.get('Difficulty', row.get('difficulty', '')) else None,
                    'cpc': float(row.get('CPC', row.get('cpc', 0))) if row.get('CPC', row.get('cpc')) else 0
                })
            except (ValueError, KeyError) as e:
                print(f"Skipping row due to error: {e}")
                continue

    # Calculate purity
    scored_keywords = calculate_purity(keywords)

    # Assign tiers
    for kw in scored_keywords:
        kw['tier'] = assign_tier(kw)

    # Output
    output_file = output_file or input_file.replace('.csv', '_ranked.csv')

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['tier', 'keyword', 'volume', 'difficulty', 'cpc', 'purity']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scored_keywords)

    # Print summary
    print(f"\nProcessed {len(scored_keywords)} keywords")
    print(f"Results saved to: {output_file}\n")

    tiers = {}
    for kw in scored_keywords:
        tier = kw['tier']
        tiers[tier] = tiers.get(tier, 0) + 1

    print("TIER BREAKDOWN:")
    for tier in ["Tier 1: Pure Gold", "Tier 2: High Purity", "Tier 3: Solid", "Below Threshold"]:
        count = tiers.get(tier, 0)
        if count > 0:
            print(f"  {tier}: {count} keywords")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python keyword_purity.py input.csv [output.csv]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    process_csv(input_file, output_file)
