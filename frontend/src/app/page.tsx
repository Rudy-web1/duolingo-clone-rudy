"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import PathView from "@/components/path/PathView";

import { api } from "@/lib/api";
import type { PathResponse } from "@/lib/types";

export default function HomePage() {
  const [data, setData] = useState<PathResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPath()
      .then(setData)
      .catch((e) => {
        setError(String(e?.message || e));
      });
  }, []);

  if (error) {
    return (
      <AppShell>
        <div className="home-error">
          <div className="home-error-icon">😵</div>

          <h2>Couldn't reach the API</h2>

          <p>
            Make sure the backend is running.
          </p>

          <code>{error}</code>
        </div>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell>
        <div className="home-loading">
          <div className="home-spinner" />
          <p>Loading your learning path...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PathView course={data.course} />
    </AppShell>
  );
}