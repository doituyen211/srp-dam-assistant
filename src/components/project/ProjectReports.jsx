"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * ProjectReports - Table of project reports
 */
export function ProjectReports({ reports = [] }) {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState title="No reports yet" description="Reports will be added as the project progresses." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-subdued">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Title</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Submitted By</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Date</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Progress</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {reports.map((report, i) => (
                <tr key={report.id || i} className="hover:bg-subdued/50">
                  <td className="px-4 py-3 font-medium text-ink">{report.title}</td>
                  <td className="px-4 py-3 text-body-muted">{report.submittedBy || report.author || "—"}</td>
                  <td className="px-4 py-3 text-body-muted">{formatDate(report.date || report.submittedAt)}</td>
                  <td className="px-4 py-3 text-body-muted">{report.progress || "—"}</td>
                  <td className="px-4 py-3">
                    {report.downloadUrl && (
                      <a href={report.downloadUrl} className="text-xs font-medium text-primary hover:underline">
                        Download
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
