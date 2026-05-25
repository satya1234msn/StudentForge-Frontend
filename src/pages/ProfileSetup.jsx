import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowRight, ArrowLeft, Check, Plus, Trash2, Cpu, Sparkles, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const ProfileSetup = () => {
  const { user, updateProfile, updateSkills, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1: Basic Profile state
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [behanceUrl, setBehanceUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [availabilityHours, setAvailabilityHours] = useState('10');
  const [workStyle, setWorkStyle] = useState('both');
  const [stepError, setStepError] = useState(null);

  // Step 2: Skills state
  const [skills, setSkills] = useState([
    { skillName: 'React', category: 'frontend', level: 'intermediate' },
    { skillName: 'Figma', category: 'design', level: 'beginner' }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('frontend');
  const [newSkillLevel, setNewSkillLevel] = useState('beginner');

  // Step 3: Learning goals state
  const [learningGoals, setLearningGoals] = useState([]);

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    if (skills.some((s) => s.skillName.toLowerCase() === newSkillName.toLowerCase().trim())) {
      setNewSkillName('');
      return;
    }
    setSkills([
      ...skills,
      {
        skillName: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel
      }
    ]);
    setNewSkillName('');
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const toggleLearningGoal = (goal) => {
    if (learningGoals.includes(goal)) {
      setLearningGoals(learningGoals.filter((g) => g !== goal));
    } else {
      setLearningGoals([...learningGoals, goal]);
    }
  };

  const handleNext = () => {
    setStepError(null);

    // Strict validation for Step 1
    if (step === 1) {
      if (!bio.trim()) {
        setStepError('Bio is required. Please tell potential teammates about yourself.');
        return;
      }
      if (!githubUrl.trim()) {
        setStepError('GitHub URL is required for coding skill verifications.');
        return;
      }
      if (!linkedinUrl.trim()) {
        setStepError('LinkedIn URL is required for professional validation.');
        return;
      }
      if (!availabilityHours || parseInt(availabilityHours, 10) <= 0) {
        setStepError('Availability hours per week must be a valid positive number.');
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    // 1. Save profile details
    const profileResult = await updateProfile({
      bio,
      githubUrl,
      behanceUrl,
      linkedinUrl,
      portfolioUrl,
      availabilityHours: parseInt(availabilityHours, 10),
      workStyle
    });

    if (!profileResult.success) {
      setStepError(profileResult.error);
      return;
    }

    // 2. Save skills list
    const skillsResult = await updateSkills(skills);

    if (skillsResult.success) {
      navigate('/dashboard');
    } else {
      setStepError(skillsResult.error);
    }
  };

  const categories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'design', label: 'Design' },
    { value: 'content', label: 'Content' },
    { value: 'research', label: 'Research' },
    { value: 'testing', label: 'Testing & QA' },
    { value: 'data', label: 'Data Science' },
    { value: 'other', label: 'Other' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] max-w-3xl mx-auto px-6 py-12">
      {/* Step Indicator */}
      <div className="mb-10 flex items-center justify-between">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1 flex items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold border transition-all duration-350 font-mono text-sm ${
              step >= num 
                ? 'bg-emerald-650 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              {step > num ? <Check size={18} /> : `0${num}`}
            </div>
            {num < 3 && (
              <div className={`flex-1 h-[1px] mx-4 rounded ${
                step > num ? 'bg-emerald-500' : 'bg-slate-800'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-xl relative">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none -z-10"></div>

        {/* Dynamic validation error display banner */}
        {stepError && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/35 text-rose-400 p-4 rounded-xl text-xs font-semibold font-mono flex items-center gap-3 animate-shake">
            <AlertTriangle className="shrink-0" size={16} />
            <span>{stepError}</span>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-emerald-400" size={24} />
                Set Up Your Profile
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Tell us about your background, profiles, and weekly availability. (Items marked as optional can be skipped)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Short Bio <span className="text-emerald-450 text-[10px] lowercase">(required)</span>
                </label>
                <textarea
                  placeholder="Describe your development focus, key stacks, and tech interests..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="glass-input w-full p-4 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    GitHub Profile URL <span className="text-emerald-450 text-[10px] lowercase">(required)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    LinkedIn Profile URL <span className="text-emerald-450 text-[10px] lowercase">(required)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Behance URL <span className="text-cyan-400 text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://behance.net/username"
                    value={behanceUrl}
                    onChange={(e) => setBehanceUrl(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Personal Portfolio URL <span className="text-cyan-400 text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://myportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850/50 pt-4">
                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Weekly Availability (Hours) <span className="text-emerald-450 text-[10px] lowercase">(required)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={availabilityHours}
                    onChange={(e) => setAvailabilityHours(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Preferred Work Style
                  </label>
                  <select
                    value={workStyle}
                    onChange={(e) => setWorkStyle(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="both">Both (Async & Sync)</option>
                    <option value="async">Mainly Async</option>
                    <option value="sync">Mainly Sync</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Skill Declaration */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="text-cyan-400" size={24} />
                Declare Your Skills
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Add skills and set experience levels so AI matching can recommend you for optimal tasks.
              </p>
            </div>

            {/* Current skill stack */}
            <div className="bg-slate-950/40 border border-emerald-500/10 p-5 rounded-2xl min-h-[120px] flex flex-wrap gap-2.5 items-start">
              {skills.length === 0 ? (
                <p className="text-slate-500 text-sm w-full text-center py-6 font-mono">No skills declared yet. Add skills below!</p>
              ) : (
                skills.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 font-mono">
                    <span>{s.skillName}</span>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase">
                      {s.level}
                    </span>
                    <button 
                      onClick={() => removeSkill(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Skill adder form */}
            <div className="bg-slate-900/30 border border-slate-850 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-350">Add Skill</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="React, Figma, Python..."
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="glass-input px-4 py-2.5 rounded-xl text-sm"
                />
                
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="glass-input px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>

                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="glass-input px-4 py-2.5 rounded-xl text-sm appearance-none cursor-pointer"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>

              <Button onClick={addSkill} variant="secondary" className="w-full text-xs py-2 bg-slate-800/20 flex items-center justify-center gap-1.5 border border-slate-750">
                <Plus size={16} />
                Add Skill to Profile
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Learning Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-emerald-400" size={24} />
                Select Learning Goals
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Choose the tools or tech you want to practice in your next project. We'll leverage these to assign learning "stretch" tasks.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Docker', 'Tailwind', 'Next.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Python', 'Machine Learning', 'UI/UX Wireframing', 'TypeScript', 'Jest Testing', 'Storybook'].map((goal) => {
                const isSelected = learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleLearningGoal(goal)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold font-mono tracking-wide text-center transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md' 
                        : 'bg-slate-900/60 border-slate-800/70 text-slate-400 hover:border-slate-750 hover:bg-slate-900'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Action controls */}
        <div className="mt-10 pt-6 border-t border-slate-850 flex justify-between items-center">
          {step > 1 ? (
            <Button onClick={handleBack} variant="secondary" className="px-5">
              <ArrowLeft size={16} />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button onClick={handleNext} variant="primary" className="px-5">
              Next Step
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              variant="primary"
              className="px-6 shadow-lg shadow-emerald-500/10"
              isLoading={isLoading}
            >
              Complete Setup
              <Check size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
