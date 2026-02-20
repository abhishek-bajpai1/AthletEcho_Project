"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import 'react-calendar/dist/Calendar.css';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

export default function Dashboard() {
  const [date, setDate] = useState(new Date());

  const trainingSessions = [
    { date: '2025-06-03', title: 'Speed Training' },
    { date: '2025-06-05', title: 'Endurance Practice' },
  ];

  const performanceData = [
    { name: 'Match 1', speed: 28, passes: 20 },
    { name: 'Match 2', speed: 32, passes: 22 },
    { name: 'Match 3', speed: 30, passes: 24 },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 min-h-screen bg-[var(--surface)]">
      <h1 className="text-3xl font-bold text-[var(--primary)]">AthletEcho Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface-elevated)] rounded-xl shadow p-4 border border-[var(--border)]">
          <h2 className="text-xl font-semibold mb-2 text-[var(--primary)]">Training Calendar</h2>
          <Calendar onChange={setDate} value={date} />
          <ul className="mt-4 text-sm text-[var(--text-secondary)]">
            {trainingSessions.map((session, idx) => (
              <li key={idx}>📅 {session.date} - {session.title}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[var(--surface-elevated)] rounded-xl shadow p-4 border border-[var(--border)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Performance Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="speed" fill="var(--primary)" />
              <Bar dataKey="passes" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[var(--surface-elevated)] rounded-xl shadow p-4 border border-[var(--border)]">
        <h2 className="text-xl font-semibold mb-4 text-[var(--primary)]">Leaderboard</h2>
        <ol className="list-decimal ml-6 space-y-2 text-[var(--text-secondary)]">
          <li>Player A - 1200 pts</li>
          <li>Player B - 1120 pts</li>
          <li>Player C - 980 pts</li>
        </ol>
      </div>
    </div>
  );
}
