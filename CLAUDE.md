# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShemakIndex (쉐막 기능도) is a design reference and planning repository for an HR/workforce management module. It is not yet a codebase — it contains reference materials that define the product vision and UI standards.

## Reference Materials

- **index1.png** — Shemak functionality taxonomy matrix (1/2): rows are analytical modules (Optic 의식예측, M0 적정인력예측, M1 거시법인, Pan 인력규모조직적정성, M3 직무Skill, M4 직무법규), columns are HR domains (조직운영, 직급/승진, 성과관리, 보상, 확보/개발, 조직개발)
- **index2.png** — Shemak functionality taxonomy matrix (2/2): agent-based views (경영진 Agent, HR팀 Agent, 팀장 Agent, 팀원 Agent, 조직 Agent) mapped to the same HR domains
- **ui-design-guidelines.md** — Complete UI design system for the workforce management module

## Target Tech Stack (from UI guidelines)

- Next.js with Geist Sans font
- shadcn/ui (Card, Badge, Alert, Progress, Table, Button, Select, Input, Popover, Calendar)
- Magic UI (MagicCard, NeonGradientCard, NumberTicker, AnimatedCircularProgressBar, BentoGrid)
- Recharts (ScatterChart, BarChart)
- Lucide React icons
- Tailwind CSS

## Key Design Rules

- No emoji — use Lucide icons for functionality, Unicode symbols (▲●▼) for status
- Three-tier color system: red (상위/high risk), green (중위/normal), blue (하위/low activity)
- Gradient backgrounds: `from-[color]-50 to-white`
- All interactive elements need `transition-all` and hover effects
- Numbers always include units (%, h, 명, 건)
- Page max width: `max-w-7xl mx-auto`
