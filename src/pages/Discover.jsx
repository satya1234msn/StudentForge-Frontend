import React, { useEffect, useState } from 'react';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import { Search, Shield, Users, Calendar, Filter, Sparkles, X, Send } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Discover = () => {
  const { projects, fetchProjects, applyToProject, isLoading } = useProjectStore();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [complexity, setComplexity] = useState('');

  // Detailed Modal overlay focus states
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyingRole, setApplyingRole] = useState(null); // roleTitle
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);

  const standardDomains = ['Web Dev', 'AI/ML', 'Mobile App', 'Design UI/UX', 'Data Science', 'Social Impact', 'Research', 'Blockchain'];

  useEffect(() => {
    fetchProjects({ search, domain, complexity });
  }, [search, domain, complexity]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyingRole) return;

    const res = await applyToProject(selectedProject.id, applyingRole, note);
    if (res.success) {
      setSuccessMsg(`Successfully applied for the "${applyingRole}" role! The project owner has been notified.`);
      setApplyingRole(null);
      setNote('');
      setTimeout(() => setSuccessMsg(null), 5050);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 relative">
      {/* Background glowing orb */}
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <Sparkles className="text-teal-400" size={24} />
          Discover Projects
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Browse forming teams, inspect skill matrix vacancies, and secure your slot to build proof-of-work.
        </p>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search projects by title or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="glass-input px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer w-full sm:w-[180px]"
          >
            <option value="">All Domains</option>
            {standardDomains.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="glass-input px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer w-full sm:w-[180px]"
          >
            <option value="">All Complexities</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Success notification banner */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 p-4 rounded-xl text-sm font-semibold flex items-center gap-3">
          <Sparkles className="shrink-0" size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Project Feeds */}
      {isLoading ? (
        <div className="glass-panel p-16 rounded-2xl text-center text-slate-400">Loading active projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center text-slate-500 space-y-2">
          <p className="font-bold text-slate-350">No projects found matching the criteria.</p>
          <p className="text-xs">Try relaxing filters or adjusting search queries!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => {
            const openSlots = proj.roles?.filter((r) => !r.filled).length || 0;
            const isOwner = proj.ownerId === user?.id;

            return (
              <div key={proj.id} className="glass-panel glass-panel-hover p-7 rounded-2xl flex flex-col justify-between h-[300px] shadow-lg">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-lg font-bold text-white tracking-wide truncate">{proj.title}</h3>
                    <Badge variant={proj.complexity === 'advanced' ? 'rose' : proj.complexity === 'intermediate' ? 'indigo' : 'slate'} className="text-[9px] shrink-0 uppercase tracking-wider">
                      {proj.complexity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    Posted by: {proj.owner?.name} {proj.collegeOnly && `• ${proj.owner?.college}`}
                  </p>
                  <p className="text-xs text-slate-400 mt-3 line-clamp-4 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-850/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 items-center">
                    {proj.domainTags?.slice(0, 2).map((t) => (
                      <Badge key={t} variant="teal" className="text-[8px] tracking-wide uppercase px-2 py-0.5">
                        {t}
                      </Badge>
                    ))}
                    <Badge variant="purple" className="text-[8px] px-2 py-0.5 font-bold shrink-0">
                      {openSlots} Open Slots
                    </Badge>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedProject(proj);
                      setApplyingRole(null);
                    }}
                    variant="secondary"
                    className="text-[10px] py-1.5 px-3 uppercase tracking-wider"
                  >
                    View Project
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal Drawer Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6">
            <button
              onClick={() => {
                setSelectedProject(null);
                setApplyingRole(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <Badge variant={selectedProject.complexity === 'advanced' ? 'rose' : 'indigo'} className="text-[9px] uppercase">
                  {selectedProject.complexity} Complexity
                </Badge>
                {selectedProject.collegeOnly && (
                  <Badge variant="orange" className="text-[9px] uppercase">
                    {selectedProject.collegeName || 'University Gated'}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-2 tracking-wide">{selectedProject.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Initiated by: <span className="text-slate-200 font-semibold">{selectedProject.owner?.name}</span> • Reliability Score: {selectedProject.owner?.reliabilityScore?.toFixed(1) || '5.0'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">Project Brief</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 border border-slate-900/60 p-4 rounded-xl">
                {selectedProject.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
                <Users size={18} className="text-indigo-400" />
                <div>
                  <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wider leading-none">Team Capacity</p>
                  <p className="text-sm font-bold text-white mt-1">{selectedProject.teamSize} Members</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/40 p-3.5 rounded-xl border border-slate-850">
                <Calendar size={18} className="text-purple-400" />
                <div>
                  <p className="text-[10px] text-slate-455 uppercase font-bold tracking-wider leading-none">Expected Deadline</p>
                  <p className="text-sm font-bold text-white mt-1">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Vacancies / Role slots list */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350">Role Slots & Availability</h4>
              
              {selectedProject.roles?.length === 0 ? (
                <p className="text-slate-500 text-sm">No role slots defined for this project.</p>
              ) : (
                <div className="space-y-3">
                  {selectedProject.roles?.map((r) => {
                    const isApplyingThis = applyingRole === r.roleTitle;
                    const isOwnProject = selectedProject.ownerId === user?.id;

                    // Application and Skills constraint evaluations
                    const userApplication = selectedProject.members?.find(m => m.userId === user?.id);
                    const hasApplied = !!userApplication;
                    const isAppliedThisRole = userApplication && userApplication.role.toLowerCase() === r.roleTitle.toLowerCase();
                    
                    const requiredSkills = r.skillsRequired?.map(s => s.toLowerCase()) || [];
                    const hasMatchingProfileSkill = user?.skills?.some(s => 
                      requiredSkills.includes(s.skillName.toLowerCase())
                    );
                    const userBioLower = (user?.bio || '').toLowerCase();
                    const hasMatchingBioSkill = requiredSkills.some(s => 
                      userBioLower.includes(s)
                    );
                    const skillsMatch = requiredSkills.length === 0 || hasMatchingProfileSkill || hasMatchingBioSkill;

                    return (
                      <div key={r.id} className="bg-slate-950/25 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-sm">{r.roleTitle}</span>
                              <Badge variant={r.filled ? 'slate' : 'teal'} className="text-[8px] py-0">
                                {r.filled ? 'Filled' : 'Vacancy'}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                              Required level: <span className="text-indigo-400 uppercase font-medium">{r.levelRequired}</span> • Tech skills: {r.skillsRequired?.join(', ')}
                            </p>
                          </div>

                          {!r.filled && !isOwnProject && user && !isApplyingThis && (
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              {hasApplied ? (
                                userApplication.status === 'pending' ? (
                                  isAppliedThisRole ? (
                                    <Button disabled variant="secondary" className="text-[10px] py-1.5 px-3 uppercase opacity-60">
                                      Applied
                                    </Button>
                                  ) : (
                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Applied (Other Role)</span>
                                  )
                                ) : userApplication.status === 'active' ? (
                                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Joined Team</span>
                                ) : (
                                  // Soft-rejected previously: allow re-application if skills align
                                  <Button
                                    onClick={() => setApplyingRole(r.roleTitle)}
                                    disabled={!skillsMatch}
                                    variant="primary"
                                    className="text-[10px] py-1.5 px-3 uppercase shrink-0 disabled:opacity-40"
                                  >
                                    Re-Apply
                                  </Button>
                                )
                              ) : (
                                <Button
                                  onClick={() => setApplyingRole(r.roleTitle)}
                                  disabled={!skillsMatch}
                                  variant="primary"
                                  className="text-[10px] py-1.5 px-3 uppercase shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                  title={!skillsMatch ? "Skills mismatch with your profile/bio" : ""}
                                >
                                  Apply
                                </Button>
                              )}
                              {!skillsMatch && (!hasApplied || userApplication.status === 'rejected') && (
                                <span className="text-[8px] text-rose-500 font-bold uppercase tracking-wider">Skills Mismatch</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expandable Application text input */}
                        {isApplyingThis && (
                          <form onSubmit={handleApplySubmit} className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/20 mt-2 space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
                                Write a brief cover note (optional)
                              </label>
                              <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Explain why you are excited for this role and mention any prior projects..."
                                maxLength={200}
                                rows={2}
                                className="glass-input w-full p-3 rounded-lg text-xs resize-none"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button type="submit" variant="primary" className="py-1 px-3 text-xs">
                                <Send size={12} />
                                Submit Request
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setApplyingRole(null)}
                                variant="secondary"
                                className="py-1 px-3 text-xs bg-slate-800 text-slate-300"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
