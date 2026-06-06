import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Clock,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { api, user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      change: '+12% from last month'
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: CheckSquare,
      change: '+8% from last month'
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: TrendingUp,
      change: '+23% from last month'
    },
    {
      title: 'Team Members',
      value: stats?.teamMembers || 0,
      icon: Users,
      change: '+2 from last month'
    }
  ];

  const tasksDueToday = stats?.tasksDueToday ?? stats?.upcomingDeadlines?.length ?? 0;
  const upcomingDeadlines = stats?.upcomingDeadlines || [];
  const recentActivities = stats?.recentActivities || [];
  const teamMembersList = stats?.teamMembersList || [];
  const userInitials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="panel-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar-lg grid place-items-center text-3xl">
              {userInitials || 'U'}
            </div>
            <div>
              <h1 className="heading-1">Welcome back</h1>
              <h2 className="mt-3 heading-2">{user?.name || 'Seid'}</h2>
            </div>
          </div>
          <p className="text-gray-600 dark:text-slate-300 text-base max-w-2xl">
            {tasksDueToday > 0
              ? `You have ${tasksDueToday} task${tasksDueToday === 1 ? '' : 's'} due today.`
              : 'No tasks due today — enjoy the calm and keep moving forward.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-medium text-gray-600 dark:text-slate-400">{stat.title}</p>
                <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-green-600 dark:text-emerald-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500 dark:text-slate-300" />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Everything that needs your attention next.</p>
                </div>
              </div>
              <Link to="/tasks" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats?.upcomingDeadlines?.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingDeadlines.map((task) => (
                  <div key={task._id || task.id} className="flex items-center justify-between gap-4 card-soft p-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge ${task.priority === 'urgent' ? 'badge-danger' : task.priority === 'high' ? 'badge-warning' : 'badge-primary'}`}>
                      {task.priority || 'normal'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-slate-400">No upcoming deadlines</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">No tasks due today — take a moment to plan your next move.</p>
                <Link to="/projects" className="btn btn-primary mt-4 inline-flex">
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-gray-500 dark:text-slate-300" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Latest changes from your workspace.</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            {stats?.recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div key={activity._id || activity.id} className="flex items-start gap-4 card-soft p-4">
                    <div className="avatar bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-100">
                      {activity.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white"><span className="font-medium">{activity.user?.name}</span> {activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-slate-400">No recent activities yet</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Looks like things are quiet. Add a task or invite a teammate to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {teamMembersList.length > 0 ? (
              teamMembersList.map((member) => (
                <div key={member._id || member.id} className="text-center card-soft p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-500/10 mx-auto flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
                    {member.name?.charAt(0)}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 capitalize mt-1">{member.role}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-slate-400">No team members yet</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Invite your first teammate and collaborate together.</p>
                <Link to="/team" className="inline-flex mt-4 items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all">
                  Invite a teammate
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
