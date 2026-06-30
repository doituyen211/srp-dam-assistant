"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DELIVERABLE_TYPES } from "@/lib/constants";

const ICON_PATHS = {
  code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  database: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
  document: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  presentation: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5h1.5v11.25c0 2.21 1.79 4 4 4h2.25m4.5-12h2.25m-2.25 0h2.25m-2.25 0v11.25c0 2.21-1.79 4-4 4h-2.25m-4.5-12h-2.25m2.25 0h2.25",
  image: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016a11.959 11.959 0 00-3.258-8.161 11.959 11.959 0 00-3.258-8.161z",
  book: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
};

/**
 * DeliverablesGrid - Grid of deliverable types with upload
 */
export function DeliverablesGrid({ deliverables = [] }) {
  const deliverableMap = {};
  deliverables.forEach((d) => {
    deliverableMap[d.type] = d;
  });

  return (
    <Card>
      <CardHeader><CardTitle>Deliverables</CardTitle></CardHeader>
      <CardContent>
        {deliverables.length === 0 ? (
          <EmptyState title="No deliverables yet" description="Upload deliverables as the project progresses." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERABLE_TYPES.map((dt) => {
              const d = deliverableMap[dt.id];
              return (
                <div
                  key={dt.id}
                  className={`rounded-lg border p-4 transition-colors ${
                    d ? "border-success/30 bg-success/5" : "border-hairline bg-canvas"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      d ? "bg-success/10 text-success" : "bg-subdued text-muted"
                    }`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d={ICON_PATHS[dt.icon] || ICON_PATHS.document} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{dt.label}</p>
                      {d ? (
                        <p className="text-xs text-success">Uploaded</p>
                      ) : (
                        <p className="text-xs text-muted">Not uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
