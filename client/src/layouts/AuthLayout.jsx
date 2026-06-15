import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.22),_transparent_24%)]" />
      <div className="absolute left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] items-center">
            <div className="space-y-8 px-4 sm:px-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-sky-200 ring-1 ring-white/10">
                TaskFlow • Project Management System
              </span>
              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  Secure access to your team, tasks, and timelines.
                </h1>
                <p className="max-w-2xl text-base text-slate-300">
                  Track progress, assign work, and stay aligned with your team from day one. Sign in or create an account to manage projects with confidence.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-sky-200">Project visibility</p>
                  <p className="mt-2 text-sm text-slate-300">Clear dashboards for milestones, deadlines, and workflow status.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-sky-200">Team coordination</p>
                  <p className="mt-2 text-sm text-slate-300">Keep every task, comment, and update in one shared workspace.</p>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md px-4 sm:px-0">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 shadow-2xl shadow-slate-950/20 backdrop-blur-sm">
                <div className="p-8 sm:p-10">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-950">TaskFlow</h1>
                    <p className="text-slate-600 mt-2">Project Management System</p>
                  </div>
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
