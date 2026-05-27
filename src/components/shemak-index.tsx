"use client";

import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Target,
  Wallet,
  UserPlus,
  Lightbulb,
  Eye,
  BarChart3,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card";
import { COLUMNS, SECTIONS } from "@/data/shemak-data";
import type { ColumnData, SectionData } from "@/data/shemak-data";

const COLUMN_ICONS: Record<string, React.ReactNode> = {
  orgOps: <Building2 className="w-4 h-4" />,
  promotion: <TrendingUp className="w-4 h-4" />,
  performance: <Target className="w-4 h-4" />,
  compensation: <Wallet className="w-4 h-4" />,
  development: <UserPlus className="w-4 h-4" />,
  orgDev: <Lightbulb className="w-4 h-4" />,
};

const SECTION_ICONS: Record<string, React.ReactNode> = {
  optic: <Eye className="w-3.5 h-3.5 text-white" />,
  pan: <BarChart3 className="w-3.5 h-3.5 text-white" />,
  agents: <Users className="w-3.5 h-3.5 text-white" />,
};

const SECTION_STRIP: Record<string, string> = {
  optic: "bg-gradient-to-r from-violet-100/80 to-violet-50/20 border-l-violet-500",
  pan: "bg-gradient-to-r from-blue-100/80 to-blue-50/20 border-l-blue-500",
  agents: "bg-gradient-to-r from-emerald-100/80 to-emerald-50/20 border-l-emerald-500",
};

function getStats() {
  let total = 0;
  let active = 0;
  for (const section of SECTIONS) {
    for (const row of section.rows) {
      for (const col of COLUMNS) {
        const cell = row.cells[col.id];
        if (cell) {
          total++;
          if (cell.active) active++;
        }
      }
    }
  }
  return { total, active, upcoming: total - active };
}

function ColumnHeader({ col }: { col: ColumnData }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 py-2">
      <div className="text-gray-400">{COLUMN_ICONS[col.id]}</div>
      <div className="text-xs font-semibold text-gray-700">{col.label}</div>
      <div className="text-[10px] text-gray-400 leading-tight text-center">
        {col.subLabel}
      </div>
    </div>
  );
}

function SectionHeader({ section }: { section: SectionData }) {
  return (
    <div
      className={cn(
        "col-span-full flex items-center gap-2.5 px-4 py-2 rounded-lg border-l-4 mb-1",
        SECTION_STRIP[section.id]
      )}
    >
      <div
        className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br shrink-0",
          section.iconBg
        )}
      >
        {SECTION_ICONS[section.id]}
      </div>
      <span className="text-sm font-bold text-gray-800">{section.label}</span>
      <span className="text-sm font-semibold text-gray-600">{section.description}</span>
    </div>
  );
}

export function ShemakIndex() {
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Shemak
              </h1>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-gray-500">
                  이용 가능{" "}
                  <span className="font-bold text-gray-900">
                    {stats.active}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-dashed border-gray-300" />
                <span className="text-gray-500">
                  개발 예정{" "}
                  <span className="font-bold text-gray-900">
                    {stats.upcoming}
                  </span>
                </span>
              </div>
              <div className="text-gray-300">|</div>
              <span className="text-gray-400">
                전체{" "}
                <span className="font-semibold text-gray-600">
                  {stats.total}
                </span>{" "}
                모듈
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Matrix */}
      <main className="max-w-[1600px] mx-auto px-6 py-5">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[1400px]">
            {/* Column headers */}
            <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-2.5 mb-1">
              <div />
              {COLUMNS.map((col) => (
                <ColumnHeader key={col.id} col={col} />
              ))}
            </div>

            {/* Sections */}
            {SECTIONS.map((section, sIdx) => (
              <motion.div
                key={section.id}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.12, duration: 0.4 }}
              >
                <SectionHeader section={section} />

                {section.rows.map((row, rIdx) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[160px_repeat(6,1fr)] gap-2.5 mb-2"
                  >
                    {/* Row label */}
                    <div className="flex flex-col justify-center pl-14 pr-2">
                      <span className="text-[13px] font-bold text-gray-700 tracking-wide">
                        {row.code}
                      </span>
                      <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
                        {row.label}
                      </span>
                    </div>

                    {/* Cards */}
                    {COLUMNS.map((col, cIdx) => {
                      const cell = row.cells[col.id];
                      if (!cell) return <div key={col.id} />;

                      const globalIdx =
                        sIdx * 30 + rIdx * COLUMNS.length + cIdx;

                      return (
                        <motion.div
                          key={`${row.id}-${col.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.05 + globalIdx * 0.012,
                            duration: 0.3,
                          }}
                        >
                          <MagicCard
                            disabled={!cell.active}
                            gradientColor={section.gradientColor}
                            gradientOpacity={0.2}
                            className={cn(
                              "h-full",
                              cell.active && [
                                "border-l-[3px]",
                                section.accentBorder,
                                "bg-gradient-to-br",
                                section.cardBg,
                              ]
                            )}
                          >
                            <div className="p-2.5">
                              <h3
                                className={cn(
                                  "text-[12px] font-semibold mb-0.5 leading-tight",
                                  cell.active
                                    ? "text-gray-900"
                                    : "text-gray-400"
                                )}
                              >
                                {cell.title}
                              </h3>
                              <p
                                className={cn(
                                  "text-[10px] leading-relaxed line-clamp-2",
                                  cell.active
                                    ? "text-gray-500"
                                    : "text-gray-300"
                                )}
                              >
                                {cell.description}
                              </p>
                            </div>
                          </MagicCard>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
          <p>Insight Group -- Shemak Framework v1.0</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2.5 rounded border border-gray-200 bg-white shadow-sm" />
              이용 가능
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2.5 rounded border border-dashed border-gray-200 bg-gray-50/60" />
              개발 예정
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
