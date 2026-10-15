import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  Search,
  Sparkles,
  Calendar,
  X,
  Send,
  Flame,
  Star,
  CheckCircle2,
  Layers,
  ChevronRight,
  Code2,
  GraduationCap,
  LayoutGrid,
  List,
  Bookmark,
  Share2,
  Check,
  ArrowUpRight
} from 'lucide-react';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const LandingPage = () => {
  const { projects, fetchProjects, applyToProject, isLoading } = useProjectStore();
  const { user, isAuthenticated } = useAuthStore();

  // Project discovery and filtering states
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [onlyVacancies, setOnlyVacancies] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'vacancies' | 'teamSize'

  // Interactive Saved / Bookmark State
  const [savedProjectIds, setSavedProjectIds] = useState(() => {
    try {
      const raw = localStorage.getItem('studentforge_saved_projects');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Copied link feedback state
  const [copiedId, setCopiedId] = useState(null);

  // Modal and application states
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyingRole, setApplyingRole] = useState(null);
  const [note, setNote] = useState('');
  const [applySuccessMsg, setApplySuccessMsg] = useState(null);

  const domains = ['All', 'Web Dev', 'AI/ML', 'Mobile App', 'Design UI/UX', 'Data Science', 'Blockchain'];

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toggleSaveProject = (id, e) => {
    e.stopPropagation();
    setSavedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('studentforge_saved_projects', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const handleCopyLink = (id, e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/discover?project=${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Client-side quick filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = proj.title?.toLowerCase().includes(q);
        const matchDesc = proj.description?.toLowerCase().includes(q);
        const matchDomain = proj.domainTags?.some((d) => d.toLowerCase().includes(q));
        const matchRole = proj.roles?.some(
          (r) =>
            r.roleTitle?.toLowerCase().includes(q) ||
            r.skillsRequired?.some((s) => s.toLowerCase().includes(q))
        );
        const matchCollege =
          proj.collegeName?.toLowerCase().includes(q) ||
          proj.owner?.college?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchDomain && !matchRole && !matchCollege) return false;
      }

      if (selectedDomain !== 'All') {
        if (!proj.domainTags?.includes(selectedDomain)) return false;
      }

      if (selectedComplexity !== 'All') {
        if (proj.complexity?.toLowerCase() !== selectedComplexity.toLowerCase()) return false;
      }

      if (onlyVacancies) {
        const hasOpenSlot = proj.roles?.some((r) => !r.filled);
        if (!hasOpenSlot) return false;
      }

      return true;
    });
  }, [projects, search, selectedDomain, selectedComplexity, onlyVacancies]);

  // Client-side sorting
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    if (sortBy === 'vacancies') {
      return list.sort((a, b) => {
        const aOpen = a.roles?.filter((r) => !r.filled).length || 0;
        const bOpen = b.roles?.filter((r) => !r.filled).length || 0;
        return bOpen - aOpen;
      });
    }
    if (sortBy === 'teamSize') {
      return list.sort((a, b) => (b.teamSize || 0) - (a.teamSize || 0));
    }
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [filteredProjects, sortBy]);

  // Count total vacancies across all projects
  const totalVacancies = useMemo(() => {
    return projects.reduce((acc, p) => {
      const openCount = p.roles?.filter((r) => !r.filled).length || 0;
      return acc + openCount;
    }, 0);
  }, [projects]);

  // Count filled roles strictly from loaded projects
  const filledRolesCount = useMemo(() => {
    return projects.reduce((acc, p) => {
      const filled = p.roles?.filter((r) => r.filled).length || 0;
      return acc + filled;
    }, 0);
  }, [projects]);

  // Count unique colleges strictly from loaded projects
  const uniqueCollegesCount = useMemo(() => {
    const colleges = new Set(
      projects.map((p) => p.collegeName || p.owner?.college).filter(Boolean)
    );
    return colleges.size;
  }, [projects]);

  // Dynamically derive in-demand skills strictly from loaded projects
  const realHotSkills = useMemo(() => {
    const counts = {};
    projects.forEach((proj) => {
      proj.roles?.forEach((role) => {
        if (!role.filled && Array.isArray(role.skillsRequired)) {
          role.skillsRequired.forEach((skill) => {
            const cleanSkill = skill.trim();
            if (cleanSkill) {
              counts[cleanSkill] = (counts[cleanSkill] || 0) + 1;
            }
          });
        }
      });
    });
    return Object.entries(counts)
      .map(([skill, vacancies]) => ({ skill, vacancies }))
      .sort((a, b) => b.vacancies - a.vacancies)
      .slice(0, 10);
  }, [projects]);

  const handleSkillClick = (skillName) => {
    setSearch(skillName);
    setSelectedDomain('All');
    const el = document.getElementById('available-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRolePillClick = (proj, roleTitle, e) => {
    e.stopPropagation();
    setSelectedProject(proj);
    setApplyingRole(roleTitle);
  };

  const handleTagClick = (tag, e) => {
    e.stopPropagation();
    setSelectedDomain(tag);
    const el = document.getElementById('available-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyingRole || !selectedProject) return;

    const res = await applyToProject(selectedProject.id, applyingRole, note);
    if (res.success) {
      setApplySuccessMsg(res.message || `Application sent for "${applyingRole}"!`);
      setApplyingRole(null);
      setNote('');
      setTimeout(() => setApplySuccessMsg(null), 5000);
    } else {
      alert(res.error || 'Failed to submit application.');
    }
  };

  const scrollToProjects = () => {
    const el = document.getElementById('available-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasActiveFilters = search || selectedDomain !== 'All' || selectedComplexity !== 'All' || onlyVacancies;

  const resetFilters = () => {
    setSearch('');
    setSelectedDomain('All');
    setSelectedComplexity('All');
    setOnlyVacancies(false);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)] space-y-16 pb-20">
      {/* 1. HERO SECTION (JITTER / DRIBBBLE PASTEL AESTHETIC) */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-12 md:pt-20 flex flex-col items-center text-center justify-center relative">
        {/* Soft pastel live ticker pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 text-xs font-semibold text-slate-700 mb-6 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{totalVacancies > 0 ? `${totalVacancies} Open Role Vacancies` : 'Student Project Hub'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">Verified Proof-of-Work</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight text-slate-900">
          Assemble Elite Teams.<br className="hidden md:inline" />{' '}
          <span className="text-gradient-purple-blue">Ship Outstanding Projects.</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          The collaborative hub where student builders connect based on real skill gaps, balance sprint workloads, and turn shipped projects into verifiable proof-of-work.
        </p>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm">
          {isAuthenticated ? (
            <Link to="/projects/create" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-xs py-2.5 px-6 font-semibold rounded-full shadow-xs group">
                Post a Project
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-xs py-2.5 px-6 font-semibold rounded-full shadow-xs group">
                Sign In
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          )}

          <Button
            onClick={scrollToProjects}
            variant="secondary"
            className="w-full sm:w-auto text-xs py-2.5 px-6 font-semibold rounded-full shadow-2xs"
          >
            Explore Projects ({projects.length})
          </Button>
        </div>

        {/* Bento Metric Cards (Soft Pastel Tints) */}
        <div className="mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Projects: Soft Lavender */}
          <div
            onClick={scrollToProjects}
            className="glass-panel p-4 rounded-2xl text-center cursor-pointer hover:border-indigo-200 hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100/90 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Layers size={16} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{projects.length}</p>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Active Projects</p>
          </div>

          {/* Vacancies: Soft Mint */}
          <div
            onClick={() => {
              setOnlyVacancies(true);
              scrollToProjects();
            }}
            className="glass-panel p-4 rounded-2xl text-center cursor-pointer hover:border-emerald-200 hover:shadow-xs transition-all group"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100/90 text-emerald-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Users size={16} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalVacancies}</p>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Open Role Slots</p>
          </div>

          {/* Filled: Soft Lilac */}
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-100/90 text-purple-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={16} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{filledRolesCount}</p>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Filled Roles</p>
          </div>

          {/* Campuses: Soft Peach */}
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-100/90 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <GraduationCap size={16} />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{uniqueCollegesCount}</p>
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Campuses</p>
          </div>
        </div>
      </section>

      {/* 2. AVAILABLE PROJECTS EXPLORER (PASTEL BENTO DIRECTORY) */}
      <section id="available-projects" className="max-w-6xl mx-auto px-6 md:px-10 w-full space-y-6 scroll-mt-20">
        {/* Section Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles size={14} />
              <span>Project Directory</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Available Projects & Open Vacancies
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Inspect team goals, click on open roles to apply, and start building proof-of-work.
            </p>
          </div>

          <Link to="/discover">
            <Button variant="secondary" className="text-xs py-2 px-3.5 whitespace-nowrap rounded-full">
              Full Directory ({projects.length})
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Interactive Controls & Filters Bar */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3.5 shadow-2xs">
          {/* Top Row: Search + Layout Toggle + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input with quick clear button */}
            <div className="relative w-full sm:flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Search by title, skill (React, Python), or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full pl-9 pr-8 py-2 rounded-xl text-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Sort Control */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input px-3 py-1.5 rounded-xl text-xs appearance-none cursor-pointer bg-white"
              >
                <option value="newest">Sort: Newest</option>
                <option value="vacancies">Sort: Most Vacancies</option>
                <option value="teamSize">Sort: Team Size</option>
              </select>

              {/* Grid vs List Toggle */}
              <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Pills + Complexity + Open Slots Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
            {/* Domain Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    selectedDomain === d
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Complexity Filter */}
              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="glass-input px-2.5 py-1 rounded-full text-xs appearance-none cursor-pointer bg-white"
              >
                <option value="All">All Complexities</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {/* Vacancies Only Toggle */}
              <button
                onClick={() => setOnlyVacancies(!onlyVacancies)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                  onlyVacancies
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${onlyVacancies ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <span>Open Slots Only</span>
              </button>
            </div>
          </div>

          {/* Active Filter Helper */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Active filters:</span>
                {selectedDomain !== 'All' && (
                  <Badge variant="indigo" className="text-[10px] py-0 px-2">
                    {selectedDomain}
                  </Badge>
                )}
                {selectedComplexity !== 'All' && (
                  <Badge variant="slate" className="text-[10px] py-0 px-2 uppercase">
                    {selectedComplexity}
                  </Badge>
                )}
                {onlyVacancies && (
                  <Badge variant="emerald" className="text-[10px] py-0 px-2">
                    Open Slots Only
                  </Badge>
                )}
                {search && (
                  <span className="text-slate-800 font-mono text-[11px]">"{search}"</span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-700 underline cursor-pointer font-medium"
              >
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* Application Success Banner */}
        {applySuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="shrink-0 text-emerald-600" size={16} />
              <span>{applySuccessMsg}</span>
            </div>
            <button onClick={() => setApplySuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Project Cards (Grid vs List Layout) */}
        {isLoading && projects.length === 0 ? (
          <div className="glass-panel p-14 rounded-2xl text-center text-slate-500">
            <span className="h-5 w-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin inline-block mr-2"></span>
            Loading active projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-14 rounded-2xl text-center text-slate-500 space-y-3.5">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">No Projects Available Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                There are currently no active projects forming. Be the first to start a project team!
              </p>
            </div>
            {isAuthenticated ? (
              <Link to="/projects/create">
                <Button variant="primary" className="text-xs py-2 px-5 mx-auto rounded-full">
                  Post the First Project
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="primary" className="text-xs py-2 px-5 mx-auto rounded-full">
                  Sign In to Post a Project
                </Button>
              </Link>
            )}
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className="glass-panel p-14 rounded-2xl text-center text-slate-500 space-y-3">
            <p className="text-sm font-bold text-slate-900">No projects match the selected filters.</p>
            <p className="text-xs text-slate-500">Try clearing your search query or switching categories.</p>
            <Button
              onClick={resetFilters}
              variant="secondary"
              className="text-xs py-1.5 px-4 mx-auto rounded-full"
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProjects.map((proj) => {
              const openSlots = proj.roles?.filter((r) => !r.filled).length || 0;
              const openRoles = proj.roles?.filter((r) => !r.filled) || [];
              const isSaved = savedProjectIds.has(proj.id);
              const isCopied = copiedId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProject(proj);
                    setApplyingRole(null);
                    setNote('');
                  }}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer group relative"
                >
                  <div className="space-y-3.5">
                    {/* Header Row: Complexity + Status + Interactive Bookmark */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={
                            proj.complexity === 'advanced'
                              ? 'rose'
                              : proj.complexity === 'intermediate'
                              ? 'indigo'
                              : 'slate'
                          }
                          className="text-[10px] uppercase font-bold"
                        >
                          {proj.complexity}
                        </Badge>
                        {proj.collegeOnly && (
                          <Badge variant="peach" className="text-[10px] uppercase">
                            Campus
                          </Badge>
                        )}
                        <Badge variant="emerald" className="text-[10px]">
                          {openSlots} {openSlots === 1 ? 'vacancy' : 'vacancies'}
                        </Badge>
                      </div>

                      {/* Interactive Bookmark Button */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleCopyLink(proj.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Copy project link"
                        >
                          {isCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                        </button>
                        <button
                          onClick={(e) => toggleSaveProject(proj.id, e)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isSaved
                              ? 'text-indigo-600 bg-indigo-50'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={isSaved ? 'Saved to bookmarks' : 'Save project'}
                        >
                          <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {proj.title}
                      </h3>
                      {/* Creator & College */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700">
                          {proj.owner?.name || 'Student Builder'}
                        </span>
                        {proj.owner?.college && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="truncate text-slate-500 text-[11px] max-w-[140px]">
                              {proj.owner.college}
                            </span>
                          </>
                        )}
                        {proj.owner?.reliabilityScore != null && (
                          <span className="ml-auto text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                            <Star size={11} fill="currentColor" />
                            {proj.owner.reliabilityScore.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    {/* Domain Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.domainTags?.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => handleTagClick(tag, e)}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/80 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Interactive Role Vacancies Preview */}
                    <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Role Slots</span>
                        <span className={openSlots > 0 ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}>
                          {openSlots} Open
                        </span>
                      </div>

                      {openRoles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {openRoles.slice(0, 2).map((role) => (
                            <button
                              key={role.id || role.roleTitle}
                              onClick={(e) => handleRolePillClick(proj, role.roleTitle, e)}
                              className="text-[10px] bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-2 py-0.5 rounded-md border border-slate-200 hover:border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              <span className="truncate max-w-[130px]">{role.roleTitle}</span>
                            </button>
                          ))}
                          {openRoles.length > 2 && (
                            <span className="text-[10px] text-slate-400 px-1 py-0.5">
                              +{openRoles.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">All roles filled</p>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Footer Meta + Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Users size={13} className="text-slate-400" />
                      <span>{proj.teamSize} Members</span>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(proj);
                        setApplyingRole(null);
                        setNote('');
                      }}
                      variant="primary"
                      className="text-[11px] py-1 px-3 rounded-full"
                    >
                      View & Apply
                      <ArrowUpRight size={13} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="space-y-2.5">
            {sortedProjects.map((proj) => {
              const openSlots = proj.roles?.filter((r) => !r.filled).length || 0;
              const isSaved = savedProjectIds.has(proj.id);
              const isCopied = copiedId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProject(proj);
                    setApplyingRole(null);
                    setNote('');
                  }}
                  className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {proj.title}
                      </h3>
                      <Badge
                        variant={
                          proj.complexity === 'advanced'
                            ? 'rose'
                            : proj.complexity === 'intermediate'
                            ? 'indigo'
                            : 'slate'
                        }
                        className="text-[9px] uppercase font-bold"
                      >
                        {proj.complexity}
                      </Badge>
                      <Badge variant="emerald" className="text-[9px]">
                        {openSlots} Open
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {proj.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Owner: <strong className="text-slate-700 font-medium">{proj.owner?.name}</strong></span>
                      {proj.owner?.college && <span>• {proj.owner.college}</span>}
                      <span>• {proj.teamSize} Target Members</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyLink(proj.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                      </button>
                      <button
                        onClick={(e) => toggleSaveProject(proj.id, e)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(proj);
                      }}
                      variant="primary"
                      className="text-xs py-1.5 px-3.5 rounded-full"
                    >
                      View & Apply
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. IN-DEMAND SKILLSETS MATRIX (PASTEL BENTO SECTION) */}
      {realHotSkills.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 w-full">
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-indigo-50/30 via-purple-50/25 to-pink-50/30 border border-slate-200/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-xs uppercase tracking-wider mb-1">
                  <Flame size={15} />
                  <span>In-Demand Skillsets</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Skills Teams Need Right Now
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-lg">
                  Click any skill badge to instantly filter available vacancies matching your expertise.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 max-w-xl">
                {realHotSkills.map((item) => (
                  <button
                    key={item.skill}
                    onClick={() => handleSkillClick(item.skill)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 transition-all text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs group"
                  >
                    <Code2 size={13} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span>{item.skill}</span>
                    <span className="bg-emerald-50 text-[10px] text-emerald-700 font-mono px-1.5 py-0.5 rounded-full border border-emerald-100">
                      {item.vacancies} open
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HOW STUDENTFORGE WORKS (PASTEL BENTO STEPS) */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 w-full space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Built for Builders, Not Slackers
          </h2>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm">
            How StudentForge organizes student teams to build real products:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1: Lavender */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-indigo-200 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold font-mono text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Dynamic Skill-Gap Matching</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Define the roles your project needs. Teammates apply by matching required skills, eliminating guesswork.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
              ✓ Clear vacancy requirements
            </div>
          </div>

          {/* Step 2: Lilac */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-purple-200 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 font-bold font-mono text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Sprint Workload Orchestration</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Break milestones into structured packages, balancing tasks according to skill strengths and hour commitments.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
              ✓ Balanced sprint distribution
            </div>
          </div>

          {/* Step 3: Mint */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-200 transition-all">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold font-mono text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Verified Proof-of-Work</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Shipped milestones, tasks, and peer validations compile into a public proof-of-work link recruiters can verify.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
              ✓ Cryptographic portfolio record
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 w-full">
        <div className="glass-panel p-8 md:p-12 rounded-3xl text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/90 shadow-2xs">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ready to Build Something Real?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Form your squad or find an active team looking for your tech stack. Your next project starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/login">
                <Button variant="primary" className="w-full sm:w-auto py-2.5 px-6 text-xs font-semibold rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="secondary" className="w-full sm:w-auto py-2.5 px-6 text-xs font-semibold rounded-full">
                  Explore All Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROJECT DETAILS & APPLY MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl p-6 md:p-7 rounded-2xl shadow-xl relative max-h-[90vh] overflow-y-auto space-y-5 animate-scale-up">
            {/* Modal Close Button */}
            <button
              onClick={() => {
                setSelectedProject(null);
                setApplyingRole(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex flex-wrap gap-1.5 items-center">
                <Badge
                  variant={selectedProject.complexity === 'advanced' ? 'rose' : 'indigo'}
                  className="text-[9px] uppercase font-bold"
                >
                  {selectedProject.complexity}
                </Badge>
                {selectedProject.collegeOnly && (
                  <Badge variant="peach" className="text-[9px] uppercase">
                    {selectedProject.collegeName || 'Campus Only'}
                  </Badge>
                )}
                <Badge variant="teal" className="text-[9px] uppercase">
                  {selectedProject.status || 'Forming'}
                </Badge>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2.5 tracking-tight">
                {selectedProject.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Initiated by:{' '}
                <span className="text-slate-800 font-semibold">{selectedProject.owner?.name || 'Project Lead'}</span>
                {selectedProject.owner?.college && <span> • {selectedProject.owner.college}</span>}
                {selectedProject.owner?.reliabilityScore != null && (
                  <span>
                    {' '}• Reliability:{' '}
                    <span className="text-amber-600 font-bold">
                      {selectedProject.owner.reliabilityScore.toFixed(1)} ★
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Project Scope Description */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Project Vision & Scope
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                {selectedProject.description}
              </p>
            </div>

            {/* Team Meta Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Users size={16} className="text-indigo-600" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">
                    Team Size
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedProject.teamSize} Members Target
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Calendar size={16} className="text-purple-600" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider leading-none">
                    Milestone Target
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {new Date(selectedProject.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Role Slots Breakdown */}
            <div className="space-y-3 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Role Slots & Skill Requirements
              </h4>

              {selectedProject.roles?.length === 0 ? (
                <p className="text-slate-400 text-xs">No role vacancies declared for this project.</p>
              ) : (
                <div className="space-y-2.5">
                  {selectedProject.roles?.map((r) => {
                    const isApplyingThis = applyingRole === r.roleTitle;
                    const isOwnProject = selectedProject.ownerId === user?.id;

                    const userApplication = selectedProject.members?.find((m) => m.userId === user?.id);
                    const hasApplied = !!userApplication;
                    const isAppliedThisRole =
                      userApplication && userApplication.role?.toLowerCase() === r.roleTitle?.toLowerCase();

                    return (
                      <div
                        key={r.id || r.roleTitle}
                        className={`bg-slate-50/70 border p-3.5 rounded-xl flex flex-col justify-between gap-2.5 transition-colors ${
                          isApplyingThis
                            ? 'border-indigo-400 bg-indigo-50/30'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">{r.roleTitle}</span>
                              <Badge variant={r.filled ? 'slate' : 'emerald'} className="text-[8px] py-0 px-1.5">
                                {r.filled ? 'Filled' : 'Open'}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              Level:{' '}
                              <span className="text-indigo-600 uppercase font-medium">
                                {r.levelRequired}
                              </span>{' '}
                              • Required Skills: {r.skillsRequired?.join(', ') || 'Flexible'}
                            </p>
                          </div>

                          {/* Action Button */}
                          {!r.filled && !isOwnProject && (
                            <div className="shrink-0">
                              {isAuthenticated ? (
                                hasApplied ? (
                                  <Button disabled variant="secondary" className="text-[10px] py-1 px-2.5 opacity-60 rounded-full">
                                    {isAppliedThisRole ? 'Applied' : 'Applied (Other)'}
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => setApplyingRole(isApplyingThis ? null : r.roleTitle)}
                                    variant={isApplyingThis ? 'secondary' : 'primary'}
                                    className="text-[10px] py-1 px-3 rounded-full"
                                  >
                                    {isApplyingThis ? 'Cancel' : 'Apply'}
                                  </Button>
                                )
                              ) : (
                                <Link to="/login">
                                  <Button variant="primary" className="text-[10px] py-1 px-2.5 rounded-full">
                                    Sign In
                                  </Button>
                                </Link>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Apply Form Expansion */}
                        {isApplyingThis && (
                          <form
                            onSubmit={handleApplySubmit}
                            className="bg-white p-3 rounded-xl border border-indigo-200 mt-1 space-y-2.5 animate-fade-in shadow-2xs"
                          >
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                Brief Note or Portfolio Link (Optional)
                              </label>
                              <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Highlight your relevant experience, GitHub repo, or why you want to build this..."
                                maxLength={250}
                                rows={2}
                                className="glass-input w-full p-2.5 rounded-xl text-xs resize-none"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button type="submit" variant="primary" className="py-1 px-3 text-xs rounded-full">
                                <Send size={12} />
                                Submit Application
                              </Button>
                              <Button
                                type="button"
                                onClick={() => setApplyingRole(null)}
                                variant="secondary"
                                className="py-1 px-3 text-xs rounded-full"
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

export default LandingPage;
