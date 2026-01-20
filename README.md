# 🎯 InsightHunt

**The Product Methodology Search Engine** — Discover 689 battle-tested methodologies and 105 actionable skills from Silicon Valley's top product leaders.

[![Live Demo](https://img.shields.io/badge/Live-insighthunt.org-brightgreen?style=for-the-badge)](https://insighthunt.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ Overview

InsightHunt transforms hours of podcast content into actionable product methodologies. Using AI-powered extraction, we analyze conversations from [Lenny's Podcast](https://www.lennyspodcast.com/) and other top product podcasts to surface the most valuable frameworks, mental models, and decision-making tools.

### 🔥 Key Features

- **🎙️ 297 Podcast Episodes** — From Airbnb's Brian Chesky to Stripe's Claire Hughes Johnson
- **📚 689 Methodologies** — Searchable, categorized product frameworks
- **🎓 105 Actionable Skills** — Downloadable skill packs with templates
- **🎨 Dynamic Visualizations** — AI-selected diagrams (flowcharts, matrices, pyramids, timelines)
- **🔍 Deep Dives** — Problem solved, when to use, common mistakes, real-world examples
- **🌐 Full Bilingual** — English + Professional Chinese translations (297/297 complete)
- **⚡ Blazing Fast** — Static site generation with Next.js 16

---

## 📸 Screenshots

| Homepage | Methodology Detail | Guest Profile |
|----------|-------------------|---------------|
| Featured methodologies, trending frameworks | Dynamic visualizations, deep dive content | Guest background, all methodologies |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, SSG) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + Custom Design System |
| **AI Extraction** | Gemini 3 Pro (via Anthropic API) |
| **Deployment** | Vercel Edge Network |
| **Data** | JSON-based with AI-generated content |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Coowoolf/insighthunt.git
cd insighthunt

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

```
insighthunt/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── guests/            # Guest listing & detail pages
│   │   └── methodologies/     # Methodology detail pages
│   ├── components/
│   │   └── diagrams/          # 15+ visualization components
│   ├── data/
│   │   └── insights.ts        # Data layer & transformations
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── data/
│   └── extracted/
│       ├── json/              # Per-guest JSON files
│       └── sample_data.json   # Merged dataset
├── scripts/
│   ├── batch_pipeline.py      # AI extraction pipeline
│   ├── translate_to_chinese.py # Bilingual translation
│   └── dedup_data.py          # Data deduplication
└── public/                    # Static assets
```

---

## 🎨 Visualization Components

InsightHunt features **15+ dynamic visualization types**, each AI-selected based on methodology structure:

| Type | Use Case | Example |
|------|----------|---------|
| `StepFlow` | Sequential processes | "Curiosity Loops" |
| `Timeline` | Career/project phases | "Explore & Exploit" |
| `Matrix2x2` | Prioritization grids | "Effort/Impact Matrix" |
| `Pyramid` | Hierarchical frameworks | "Maslow's Hierarchy" |
| `Cycle` | Iterative processes | "Build-Measure-Learn" |
| `Funnel` | Conversion flows | "AARRR Metrics" |
| `MindMap` | Concept relationships | "First Principles" |
| `DosDonts` | Best practices | "Inner vs Outer Scorecard" |
| `Equation` | Formula-based thinking | "Growth = Retention × Acquisition" |

---

## 🤖 AI-Powered Pipeline

### Extraction Flow

```
Podcast Transcript
       ↓
   Gemini 3 Pro (Thinking Mode)
       ↓
   Methodology Extraction
   ├── Name, Category, Summary
   ├── Principles (3-5 actionable steps)
   ├── Problem It Solves
   ├── When To Use
   ├── Common Mistakes
   ├── Real World Example
   └── Notable Quote
       ↓
   Visualization Selection
   ├── AI analyzes structure
   └── Selects best diagram type
       ↓
   JSON Output
```

### Running Extraction

```bash
# Extract from podcast transcripts (batch of 10)
python3 scripts/batch_pipeline.py --start 1 --count 10

# Add dynamic visualizations
python3 scripts/dynamic_viz_extract.py

# Deduplicate merged guests
python3 scripts/dedup_data.py
```

---

## 🌐 Bilingual Support (Complete)

**297/297 episodes fully translated** with professional PM-quality Chinese translations:

| English | Chinese |
|---------|---------|
| Curiosity Loops | 好奇心循环 |
| Product-Market Fit | 产品市场匹配 / PMF |
| North Star Metric | 北极星指标 |
| User Research | 用户调研 |

```bash
# Run translation pipeline
python3 scripts/translate_to_chinese.py
```

---

## 📊 Current Stats

| Metric | Count |
|--------|-------|
| **Podcast Episodes** | 297 |
| **Methodologies** | 689 |
| **Actionable Skills** | 105 |
| **Full Transcripts (EN)** | 297 |
| **Full Transcripts (ZH)** | 297 |
| **Visualization Types** | 16 |
| **Categories** | 8 |

---

## 🎯 Categories

- 🎯 **Product Strategy** — Vision, positioning, roadmapping
- 📈 **Growth & Metrics** — Funnels, experimentation, analytics
- 👥 **Team & Culture** — Hiring, management, collaboration
- 🔍 **User Research** — Discovery, validation, feedback loops
- ⚡ **Execution** — Shipping, prioritization, velocity
- 🚀 **Career & Leadership** — Personal development, influence

---

## 🛠️ Development

```bash
# Type checking
npm run typescript

# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

---

## 📝 License

MIT License — feel free to use this for learning and non-commercial projects.

---

## 🙏 Acknowledgments

- **[Lenny's Podcast](https://www.lennyspodcast.com/)** — Primary content source
- **[Vercel](https://vercel.com)** — Hosting & deployment
- **[Anthropic/Gemini](https://anthropic.com)** — AI extraction

---

<p align="center">
  <strong>Built with ❤️ for the Product Community</strong>
</p>

<p align="center">
  <a href="https://insighthunt.org">🌐 Visit InsightHunt</a>
</p>
