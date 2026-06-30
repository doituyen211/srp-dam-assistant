"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * ProjectMembers - Table of project members
 */
export function ProjectMembers({ members = [] }) {
  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState title="No members yet" description="Members will appear when the project starts." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Members</CardTitle></CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-subdued">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Name</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Role</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Email</th>
                <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {members.map((member, i) => (
                <tr key={member.id || i} className="hover:bg-subdued/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {member.name?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-ink">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-body-muted">{member.role || "—"}</td>
                  <td className="px-4 py-3 text-body-muted">{member.email || "—"}</td>
                  <td className="px-4 py-3 text-body-muted">{member.department || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
