import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/api';
import { PlusCircle, Compass, Users, Layout, Award, Settings, Check, X, Bell } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [myProjects, setMyProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [applicants, setApplicants] = useState({}); // { projectId: [applicants] }
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects and notifications
  const fetchDashboardData = async () => {
    try {
      setIsLoadingProjects(true);
      // Fetch all projects and filter locally for ownership or membership
      const projectsRes = await api.get('/projects');
      const allProjects = projectsRes.data;
      const userProjects = allProjects.filter(
        (p) => p.ownerId === user.id || p.members.some((m) => m.userId === user.id)
      );
      setMyProjects(userProjects);

      // Fetch applications made by this user
      const appsRes = await api.get('/projects/my-applications').catch(() => ({ data: [] }));
      setApplications(appsRes.data);

      // Fetch notifications
      const notifRes = await api.get('/notifications').catch(() => ({ data: [] }));
      setNotifications(notifRes.data);

      // For owned projects in 'forming' stage, fetch applicants
      const ownedForming = userProjects.filter((p) => p.ownerId === user.id && p.status === 'forming');
      const applicantsMap = {};
      for (const proj of ownedForming) {
        const appRes = await api.get(`/projects/${proj.id}/applicants`);
        applicantsMap[proj.id] = appRes.data;
      }
      setApplicants(applicantsMap);
    } catch (e) {
      console.error('Error fetching dashboard details:', e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleAccept = async (projectId, userId) => {
    try {
      await api.post(`/projects/${projectId}/accept/${userId}`);
      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to accept applicant.');
    }
  };

  const handleReject = async (projectId, userId) => {
    const reason = prompt("Enter a brief reason why you are rejecting this applicant:");
    if (reason === null) return; // user cancelled!

    try {
      await api.post(`/projects/${projectId}/reject/${userId}`, {
        reason: reason || 'Not selected for this role.'
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject applicant.');
    }
  };

  const pendingApps = applications.filter((app) => app.status === 'pending');
  const rejectedApps = applications.filter((app) => app.status === 'rejected');
  const activeMemberApplications = applications.filter((app) => app.status === 'active');

  const activeProjectsMap = {};
  myProjects.forEach((p) => {
    activeProjectsMap[p.id] = {
      ...p,
      joinedRole: p.members?.find((m) => m.userId === user?.id)?.role || (p.ownerId === user?.id ? 'Project Owner' : 'Member')
    };
  });
  activeMemberApplications.forEach((app) => {
    if (app.project) {
      activeProjectsMap[app.project.id] = {
        ...app.project,
        joinedRole: app.role
      };
    }
  });
  const activeProjects = Object.values(activeProjectsMap);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      {/* Welcome header cards */}
      <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow"></div>

        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-gradient-purple-blue">{user?.name}</span>!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {user?.college} • {user?.course} (Year {user?.year})
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link to="/projects/create">
            <Button variant="primary" className="text-sm py-2 bg-gradient-to-r from-indigo-600 to-purple-600">
              <PlusCircle size={16} />
              Create Project
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="secondary" className="text-sm py-2">
              <Compass size={16} />
              Discover Teams
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-405 font-bold uppercase tracking-wider">Reliability Score</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{user?.reliabilityScore?.toFixed(1) || '5.0'}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layout size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-405 font-bold uppercase tracking-wider">Availability</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{user?.availabilityHours || 10} hrs/wk</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-405 font-bold uppercase tracking-wider">Projects Completed</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{user?.projectsCompleted || 0}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Settings size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-405 font-bold uppercase tracking-wider">Work Style</p>
            <p className="text-lg font-extrabold text-white mt-1 capitalize">{user?.workStyle || 'both'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Projects & Applications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Your Projects Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-200">Your Shipped & Active Projects</h2>
            
            {isLoadingProjects ? (
              <div className="glass-panel p-10 rounded-2xl text-center text-slate-450 text-sm">
                Loading projects...
              </div>
            ) : activeProjects.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl text-center space-y-4">
                <p className="text-slate-400 text-sm">You haven't created or joined any projects yet.</p>
                <Link to="/discover" className="inline-block">
                  <Button variant="secondary" className="text-sm py-2">
                    Browse Projects to Join
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activeProjects.map((proj) => {
                  const isOwner = proj.ownerId === user?.id;
                  const activeApplicants = applicants[proj.id] || [];

                  return (
                    <div key={proj.id} className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-[210px]">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-lg font-bold text-white tracking-wide truncate">{proj.title}</h3>
                          <Badge variant={isOwner ? 'indigo' : 'purple'} className="shrink-0 text-[10px]">
                            {isOwner ? 'Owner' : proj.joinedRole || 'Member'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-850/60 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="teal" className="text-[9px] uppercase tracking-wider">
                            {proj.status}
                          </Badge>
                          {isOwner && activeApplicants.length > 0 && (
                            <Badge variant="rose" className="text-[9px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                              <Bell size={10} />
                              {activeApplicants.length} applicants
                            </Badge>
                          )}
                        </div>

                        <Link to={`/projects/${proj.id}`} className="text-xs font-bold text-emerald-400 hover:text-cyan-400 transition-colors">
                          View details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Applications Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-extrabold text-slate-200">Applied Projects (Pending Approval)</h2>
            {pendingApps.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-slate-450 text-xs">
                No pending applications. All caught up!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pendingApps.map((app) => (
                  <div key={app.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-[160px] border-l-2 border-slate-400">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-white tracking-wide truncate">{app.project?.title}</h3>
                        <Badge variant="indigo" className="text-[8px] py-0">{app.role}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {app.project?.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>Owner: {app.project?.owner?.name}</span>
                      <span className="text-amber-500 font-bold uppercase">Pending Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rejected Applications Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-extrabold text-slate-200">Rejected Applications</h2>
            {rejectedApps.length === 0 ? (
              <div className="glass-panel p-6 rounded-2xl text-center text-slate-450 text-xs">
                No rejected applications. All clear!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rejectedApps.map((app) => (
                  <div key={app.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-[180px] border-l-2 border-rose-500">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-white tracking-wide truncate">{app.project?.title}</h3>
                        <Badge variant="rose" className="text-[8px] py-0">{app.role}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {app.project?.description}
                      </p>
                      <p className="text-[10px] text-rose-500 mt-2 leading-relaxed italic font-bold tracking-wide normal-case first-letter:uppercase">
                        Feedback: "{app.contributionSummary || 'Not selected.'}"
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-850/60 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>Owner: {app.project?.owner?.name}</span>
                      <span className="text-rose-500 font-bold uppercase">Rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Applications Section */}
          {Object.entries(applicants).some(([_, apps]) => apps.length > 0) && (
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-200">Incoming Role Applications</h2>
              <div className="space-y-4">
                {Object.entries(applicants).map(([projId, apps]) => {
                  const proj = activeProjects.find((p) => p.id === projId);
                  if (!proj || apps.length === 0) return null;

                  return (
                    <div key={projId} className="glass-panel p-6 rounded-2xl space-y-4 border-l-2 border-indigo-500">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Applications for: <span className="text-indigo-400">{proj.title}</span>
                      </h4>

                      <div className="divide-y divide-slate-850/60 space-y-4">
                        {apps.map((app) => (
                          <div key={app.user.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-white text-sm">{app.user.name}</span>
                                <Badge variant="slate" className="text-[9px]">
                                  Score: {app.user.reliabilityScore?.toFixed(1) || '5.0'}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-450 mt-1">
                                Applied for: <span className="text-slate-250 font-semibold">{app.role}</span> • {app.user.college}
                              </p>
                              {app.user.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {app.user.skills.slice(0, 3).map((sk) => (
                                    <Badge key={sk.id} variant="purple" className="text-[8px] px-2 py-0.5">
                                      {sk.skillName} ({sk.level})
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto shrink-0">
                              <Button
                                onClick={() => handleAccept(proj.id, app.user.id)}
                                variant="primary"
                                className="py-1 px-3 text-xs w-1/2 sm:w-auto bg-indigo-600/90"
                              >
                                <Check size={14} />
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleReject(proj.id, app.user.id)}
                                variant="secondary"
                                className="py-1 px-3 text-xs w-1/2 sm:w-auto bg-slate-800 text-slate-300 border border-slate-700/80"
                              >
                                <X size={14} />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Skills Stack and Alerts */}
        <div className="space-y-8">
          {/* Skill Matrix Summary */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-200">Your Declared Skills</h3>
              <Link to="/setup" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Setup Wizard
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {user?.skills?.length === 0 ? (
                <p className="text-slate-500 text-sm">No skills added yet.</p>
              ) : (
                user?.skills?.map((sk) => (
                  <div
                    key={sk.id}
                    className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-850 px-3 py-1 rounded-xl text-xs font-semibold text-slate-350"
                  >
                    <span>{sk.skillName}</span>
                    <span className="text-[9px] text-indigo-400 uppercase font-bold bg-indigo-500/5 px-1 py-0.2 rounded border border-indigo-500/10">
                      {sk.level}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Notifications Center */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-200 flex items-center gap-2">
              <Bell size={18} className="text-indigo-400 animate-pulse" />
              Notifications Center
            </h3>

            {notifications.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No new updates or tasks. All clear!</p>
            ) : (
              <div className="space-y-3.5 divide-y divide-slate-850/40">
                {notifications.map((notif) => (
                  <div key={notif.id} className="pt-3 first:pt-0">
                    <p className="text-xs font-bold text-slate-200">{notif.title}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
