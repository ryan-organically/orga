# KEYWORD PURITY SCORING SYSTEM

Score keywords to identify content opportunities that are rankable AND convert. Apply the Organic Purity formula to any keyword dataset.

## FORMULA

```
Organic Purity = (Difficulty_Score × 0.35) + (CPC_Score × 0.35) + (Volume_Score × 0.30)
```

## NORMALIZATION
Apply before weighting:

- **Difficulty_Score** = `(100 - Difficulty)` → inverted, lower difficulty = higher score
- **CPC_Score** = `(CPC / Max_CPC_in_dataset) × 100`
- **Volume_Score** = `(Volume / Max_Volume_in_dataset) × 100`

## WEIGHTS

- **Difficulty: 35%** — You can't benefit from a keyword you can't rank for
- **CPC: 35%** — High CPC means advertisers pay for these clicks, indicating buyer intent
- **Volume: 30%** — Demand matters but is a tiebreaker; high volume often correlates with high difficulty and low intent

**Note:** Traffic Potential is excluded. We score the keyword, not SERP features.

## MISSING DATA DEFAULTS

- **Difficulty blank** → Assume 15
- **CPC blank** → Assume median CPC of dataset
- **Volume blank** → Exclude keyword

## TIERING

- **Tier 1 (Pure Gold):** Purity ≥ 60 — Prioritize these
- **Tier 2 (High Purity):** Purity 45-59, Difficulty ≤ 20 — Quick wins
- **Tier 3 (Solid):** Purity 35-44, Difficulty ≤ 30 — Supporting content

## OUTPUT FORMAT

Return ranked keywords with columns:

```
Keyword | Volume | Difficulty | CPC | Purity Score
```

Group by tier and identify keyword clusters for content planning.

## INTERPRETATION

High purity = easy to rank + attracts buyers + has demand.

A low-volume, zero-difficulty, high-CPC keyword beats a high-volume, high-difficulty, low-CPC keyword. You can win the first one and it converts.
