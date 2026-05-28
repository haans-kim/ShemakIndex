"use client";

import { cn } from "@/lib/utils";
import { COLUMNS, SECTIONS } from "@/data/shemak-data";
import type { CellData, ColumnData, SectionData } from "@/data/shemak-data";
import { BULLET_TARGETS } from "@/data/bullet-targets";

type SectionStyle = {
  header: string;
  dot: string;
  cardBorder: string;
  bullet: string;
};

const SECTION_STYLE: Record<string, SectionStyle> = {
  optic: {
    header: "border-violet-400 bg-violet-50",
    dot: "bg-violet-500",
    cardBorder: "border-violet-400 hover:border-violet-600 hover:bg-violet-50",
    bullet: "bg-violet-500",
  },
  agents: {
    header: "border-emerald-400 bg-emerald-50",
    dot: "bg-emerald-500",
    cardBorder: "border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50",
    bullet: "bg-emerald-500",
  },
  pan: {
    header: "border-blue-400 bg-blue-50",
    dot: "bg-blue-500",
    cardBorder: "border-blue-400 hover:border-blue-600 hover:bg-blue-50",
    bullet: "bg-blue-500",
  },
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
  return { total, active, wip: total - active };
}

function ColumnHeader({ col }: { col: ColumnData }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-2 text-center">
      <div className="text-[15px] font-semibold text-slate-800">{col.label}</div>
      <div className="text-[12px] text-slate-500 leading-tight break-keep">
        {col.subLabel}
      </div>
    </div>
  );
}

function SectionHeader({ section }: { section: SectionData }) {
  const style = SECTION_STYLE[section.id];
  return (
    <div
      className={cn(
        "col-span-full flex items-center gap-2 px-4 py-2 mb-1.5 rounded-lg border",
        style.header
      )}
    >
      <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
      <span className="text-base font-bold text-slate-800">{section.label}</span>
    </div>
  );
}

function ModuleCard({
  cell,
  style,
  rowId,
  colId,
}: {
  cell: CellData;
  style: SectionStyle;
  rowId: string;
  colId: string;
}) {
  if (!cell.active) {
    return (
      <div className="relative h-full min-h-[88px] rounded-lg border-[1.5px] border-slate-300 bg-slate-100 p-2.5">
        <span className="absolute top-1.5 right-1.5 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-200">
          개발 중
        </span>
        <ul className="space-y-1 pr-12">
          {cell.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-1.5 text-[14px] leading-snug font-medium text-slate-400"
            >
              <span className="mt-[5px] h-1 w-1 rounded-full bg-slate-300 shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-full min-h-[88px] rounded-lg border-[1.5px] bg-white p-2.5 transition-colors duration-200",
        style.cardBorder
      )}
    >
      <ul className="space-y-1">
        {cell.bullets.map((b, i) => {
          const target = BULLET_TARGETS[`${rowId}|${colId}|${i}`];
          const liClass =
            "flex gap-1.5 text-[14px] leading-snug font-medium text-slate-800";
          if (!target) {
            return (
              <li key={i} className={liClass}>
                <span
                  className={cn(
                    "mt-[5px] h-1 w-1 rounded-full shrink-0",
                    style.bullet
                  )}
                />
                <span>{b}</span>
              </li>
            );
          }
          return (
            <li key={i}>
              <a
                href={`/${target.file}.html${
                  target.anchor ? `#${target.anchor}` : ""
                }`}
                className={cn(liClass, "hover:underline")}
              >
                <span
                  className={cn(
                    "mt-[5px] h-1 w-1 rounded-full shrink-0",
                    style.bullet
                  )}
                />
                <span>{b}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ShemakIndex() {
  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Shemak
              </h1>
            </div>

            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3 rounded-sm border border-slate-300 bg-white" />
                <span className="text-slate-500">
                  이용 가능{" "}
                  <span className="font-bold text-slate-900">{stats.active}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3 rounded-sm border border-dashed border-slate-300 bg-slate-100" />
                <span className="text-slate-500">
                  개발 중{" "}
                  <span className="font-bold text-slate-900">{stats.wip}</span>
                </span>
              </div>
              <div className="text-slate-300">|</div>
              <span className="text-slate-400">
                전체{" "}
                <span className="font-semibold text-slate-600">{stats.total}</span>{" "}
                기능
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Matrix */}
      <main className="max-w-[1600px] mx-auto px-6 py-5">
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[1500px]">
            {/* Column headers */}
            <div className="grid grid-cols-[200px_repeat(6,1fr)] gap-2.5 mb-1.5">
              <div />
              {COLUMNS.map((col) => (
                <ColumnHeader key={col.id} col={col} />
              ))}
            </div>

            {/* Sections */}
            {SECTIONS.map((section) => {
              const style = SECTION_STYLE[section.id];
              return (
                <div key={section.id} className="mb-5">
                  <SectionHeader section={section} />

                  {section.rows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[200px_repeat(6,1fr)] gap-2.5 mb-2.5 items-stretch"
                    >
                      {/* Row label */}
                      <div className="flex items-center pl-16 pr-2">
                        <span className="text-[15px] leading-snug break-keep">
                          <span className="font-bold text-slate-900">
                            {row.code}
                          </span>
                          {row.label && (
                            <span className="font-medium text-slate-600">
                              {" "}
                              {row.label}
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Cards */}
                      {COLUMNS.map((col) => {
                        const cell = row.cells[col.id];
                        if (!cell) return <div key={col.id} />;
                        return (
                          <ModuleCard
                            key={`${row.id}-${col.id}`}
                            cell={cell}
                            style={style}
                            rowId={row.id}
                            colId={col.id}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-4 border-t border-slate-200 flex items-center justify-between text-[12px] text-slate-400">
          <p>Insight Group · Shemak Framework</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2.5 rounded border border-slate-300 bg-white" />
              이용 가능
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-2.5 rounded border border-dashed border-slate-300 bg-slate-100" />
              개발 중
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
