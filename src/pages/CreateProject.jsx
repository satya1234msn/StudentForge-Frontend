import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import { PlusCircle, Trash2, Shield, Calendar, Users, HelpCircle, Layers } from 'lucide-react';
import Button from '../components/common/Button';

const CreateProject = () => {
  const { user } = useAuthStore();
  const { createProject, isLoading } = useProjectStore();
  const navigate = useNavigate();

  // Project Details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domainTags, setDomainTags] = useState([]);
  const [complexity, setComplexity] = useState('intermediate');
  const [teamSize, setTeamSize] = useState('4');
  const [deadline, setDeadline] = useState('');
  const [collegeOnly, setCollegeOnly] = useState(false);
  const [isOpenContribution, setIsOpenContribution] = useState(false);

  // Custom Domain tag list
  const standardDomains = ['Web Dev', 'AI/ML', 'Mobile App', 'Design UI/UX', 'Data Science', 'Social Impact', 'Research', 'Blockchain'];

  // Role Slots
  const [roles, setRoles] = useState([
    { roleTitle: 'Frontend Developer', skillsRequired: ['React', 'CSS'], levelRequired: 'intermediate' },
    { roleTitle: 'Backend Developer', skillsRequired: ['Node.js', 'PostgreSQL'], levelRequired: 'intermediate' }
  ]);

  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleSkills, setNewRoleSkills] = useState('');
  const [newRoleLevel, setNewRoleLevel] = useState('intermediate');

  const handleToggleTag = (tag) => {
    if (domainTags.includes(tag)) {
      setDomainTags(domainTags.filter((t) => t !== tag));
    } else {
      setDomainTags([...domainTags, tag]);
    }
  };

  const handleAddRole = () => {
    if (!newRoleTitle.trim()) return;
    const skillsArray = newRoleSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setRoles([
      ...roles,
      {
        roleTitle: newRoleTitle.trim(),
        skillsRequired: skillsArray,
        levelRequired: newRoleLevel
      }
    ]);
    setNewRoleTitle('');
    setNewRoleSkills('');
  };

  const handleRemoveRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !teamSize || !deadline) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const payload = {
      title,
      description,
      domainTags,
      complexity,
      teamSize: parseInt(teamSize, 10),
      deadline,
      collegeOnly,
      collegeName: collegeOnly ? user?.college : null,
      isOpenContribution,
      roles
    };

    const res = await createProject(payload);
    if (res.success) {
      navigate('/dashboard');
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Glow effect */}
      <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gradient-purple-blue">
          Create New Project
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Lay down the blueprint for your idea, define role vacancies, and recruit verified student engineers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Project Metadata */}
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-850/60 pb-3">
            <Layers size={18} className="text-indigo-400" />
            Project Basic Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                Project Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Campus Navigation System"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-2">
                Project Description (AI feeds off this, make it thorough)
              </label>
              <textarea
                required
                placeholder="Describe the problem, key features, target users, and engineering stack..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="glass-input w-full p-4 rounded-xl text-sm resize-none"
              />
            </div>

            {/* Domain tag selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-3">
                Domain Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {standardDomains.map((tag) => {
                  const isSelected = domainTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500 text-indigo-450'
                          : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complexity, Size, Deadline grids */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-455 mb-2 flex items-center gap-1.5">
                  <Shield size={14} />
                  Complexity Level
                </label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                >
                  <option value="beginner">Beginner (1-2 Weeks)</option>
                  <option value="intermediate">Intermediate (3-6 Weeks)</option>
                  <option value="advanced">Advanced (6+ Weeks)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-455 mb-2 flex items-center gap-1.5">
                  <Users size={14} />
                  Target Team Size
                </label>
                <input
                  type="number"
                  required
                  min="2"
                  max="12"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-455 mb-2 flex items-center gap-1.5">
                  <Calendar size={14} />
                  Project Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm cursor-pointer"
                />
              </div>
            </div>

            {/* University & Contribution gates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-850/50">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="collegeOnly"
                  checked={collegeOnly}
                  onChange={(e) => setCollegeOnly(e.target.checked)}
                  className="h-4 w-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="collegeOnly" className="text-xs font-semibold text-slate-350 cursor-pointer select-none">
                  University Gate? <span className="text-slate-400 font-light">(Limit applicants to: {user?.college || 'My College'})</span>
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isOpenContribution"
                  checked={isOpenContribution}
                  onChange={(e) => setIsOpenContribution(e.target.checked)}
                  className="h-4 w-4 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isOpenContribution" className="text-xs font-semibold text-slate-350 cursor-pointer select-none">
                  Open Contribution? <span className="text-slate-400 font-light">(Let students join role slots automatically)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Role Slot Builders */}
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-slate-850/60 pb-3">
            <Users size={18} className="text-purple-400" />
            Define Vacancy Role Slots
          </h2>

          {/* Current slot rosters */}
          <div className="space-y-3">
            {roles.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No roles defined. Add at least one vacancy slot below!</p>
            ) : (
              roles.map((r, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950/20 border border-slate-850 p-4 rounded-xl">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{r.roleTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Level: <span className="text-indigo-400 font-medium capitalize">{r.levelRequired}</span> • Required: {r.skillsRequired.join(', ')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(idx)}
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Role adder subform */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Add Vacancy Slot</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="UI/UX Designer, QA Tester..."
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Skills Needed (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Redux, Sass..."
                  value={newRoleSkills}
                  onChange={(e) => setNewRoleSkills(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Experience Expected</label>
                <select
                  value={newRoleLevel}
                  onChange={(e) => setNewRoleLevel(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddRole}
              variant="secondary"
              className="w-full text-xs py-2 bg-slate-800/80 border border-slate-750 flex items-center justify-center gap-1.5"
            >
              <PlusCircle size={15} />
              Add Vacancy Slot to Project
            </Button>
          </div>
        </div>

        {/* Submit action */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-3 text-base shadow-lg shadow-indigo-500/20"
            isLoading={isLoading}
          >
            Create Project & Launch Recruitment
          </Button>
          <Button
            type="button"
            onClick={() => navigate('/dashboard')}
            variant="secondary"
            className="py-3 px-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
