import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import { Shield, Users, Calendar, Sparkles, Cpu, CheckCircle2, ChevronRight, Terminal, BarChart2, Layers, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    currentProject,
    tasks,
    matchLogs,
    memberLoads,
    isLoading,
    fetchProjectById,
    fetchProjectTasks,
    generateProjectTasks,
    distributeProjectTasks,
    updateTaskStatus
  } = useProjectStore();

  const [generatedPreview, setGeneratedPreview] = useState(null); // tasks preview
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [activeTab, setActiveTab] = useState('board'); // board, matrix, logs

  useEffect(() => {
    fetchProjectById(id);
    fetchProjectTasks(id);
  }, [id]);

  const handleTriggerAI = async () => {
    setIsGenerating(true);
    const res = await generateProjectTasks(id);
    if (res.success) {
      setGeneratedPreview(res.tasks);
    } else {
      alert(res.error);
    }
    setIsGenerating(false);
  };

  const handleLockDistribution = async () => {
    if (!generatedPreview) return;
    setIsLocking(true);
    const res = await distributeProjectTasks(id, generatedPreview);
    if (res.success) {
      setGeneratedPreview(null);
      setActiveTab('board');
    } else {
      alert(res.error);
    }
    setIsLocking(false);
  };

  const handleShiftTask = async (taskId, nextStatus) => {
    await updateTaskStatus(taskId, nextStatus);
  };

  if (isLoading && !currentProject) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <span className="h-8 w-8 border-4 border-emerald-500/20 border-t-emerald-450 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center text-slate-400">
        Project board not found.
      </div>
    );
  }

  const isOwner = currentProject.ownerId === user?.id;
  const isMember = currentProject.members?.some((m) => m.userId === user?.id);

  // Skill matrix calculation categories
  const skillCategories = ['frontend', 'backend', 'design', 'testing'];
  const levelWeights = { advanced: 3, intermediate: 2, beginner: 1 };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 font-mono text-xs uppercase tracking-wider relative">
      {/* Background glowing orb */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse-slow"></div>

      {/* Project Header details */}
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none -z-10"></div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={currentProject.complexity === 'advanced' ? 'rose' : 'indigo'}>
            {currentProject.complexity} Complexity
          </Badge>
          <Badge variant="teal">{currentProject.status} Mode</Badge>
          {currentProject.collegeOnly && (
            <Badge variant="orange">{currentProject.collegeName || 'Gated College'}</Badge>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-4 font-sans tracking-tight leading-none lowercase first-letter:uppercase">
          {currentProject.title}
        </h1>
        <p className="text-slate-400 text-xs mt-3 leading-relaxed normal-case first-letter:uppercase max-w-4xl">
          {currentProject.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 mt-6 border-t border-slate-850/60 text-slate-350">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-450" />
            <div>
              <p className="text-[10px] text-slate-500 leading-none">TEAM SIZE</p>
              <p className="text-xs font-bold text-slate-200 mt-1 font-mono">{currentProject.members?.length} / {currentProject.teamSize} members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-500 leading-none">TARGET DEADLINE</p>
              <p className="text-xs font-bold text-slate-200 mt-1 font-mono">{new Date(currentProject.deadline).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield size={16} className="text-cyan-400" />
            <div>
              <p className="text-[10px] text-slate-500 leading-none">PROJECT LEADER</p>
              <p className="text-xs font-bold text-slate-200 mt-1 font-mono">{currentProject.owner?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-500 leading-none">OPEN Vacancies</p>
              <p className="text-xs font-bold text-slate-200 mt-1 font-mono">{currentProject.roles?.filter(r => !r.filled).length} slots</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-850 gap-4">
        <button
          onClick={() => setActiveTab('board')}
          className={`pb-3.5 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer relative ${
            activeTab === 'board' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-550 hover:text-slate-300'
          }`}
        >
          [ 01. TASK BOARD ]
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3.5 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer relative ${
            activeTab === 'matrix' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-550 hover:text-slate-300'
          }`}
        >
          [ 02. TEAM MATRIX ]
        </button>
        {matchLogs.length > 0 && (
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3.5 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer relative ${
              activeTab === 'logs' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-550 hover:text-slate-300'
            }`}
          >
            [ 03. AI ALLOCATION LOGS ]
          </button>
        )}
      </div>

      {/* Content panes */}
      <div className="space-y-10">
        {activeTab === 'board' && (
          <>
            {/* If project status is Forming, show leader trigger panel */}
            {currentProject.status === 'forming' ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-6 max-w-2xl mx-auto border-dashed border-emerald-500/25">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                  <Cpu size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">AI Task Orchestration Engine Offline</h3>
                  <p className="text-xs text-slate-400 lowercase normal-case max-w-md mx-auto leading-relaxed">
                    This project is currently recruiting. Once your team members join, the group leader can prompt the AI generator to instantly balance workloads and distribute stretch tasks.
                  </p>
                </div>

                {isOwner && (
                  <div className="pt-4 space-y-4">
                    {currentProject.members?.length < 2 ? (
                      <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-[10px]">
                        <AlertCircle size={14} />
                        WAITING FOR AT LEAST 2 TEAM MEMBERS TO JOIN
                      </div>
                    ) : (
                      <Button
                        onClick={handleTriggerAI}
                        isLoading={isGenerating}
                        variant="primary"
                        className="py-3 px-8 mx-auto shadow-lg shadow-emerald-500/10"
                      >
                        Run AI Task Generation Simulation
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {/* AI Task Preview & Lock controls */}
            {generatedPreview && (
              <div className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Terminal size={18} className="text-cyan-400" />
                      AI Generated Tasks Preview
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">Review simulated tasks before allocating them to students.</p>
                  </div>
                  <Button
                    onClick={handleLockDistribution}
                    isLoading={isLocking}
                    variant="primary"
                    className="py-2.5 px-6 shadow-md shadow-emerald-500/10"
                  >
                    Lock & Distribute Workloads
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedPreview.map((t, idx) => (
                    <div key={t.id || idx} className="bg-slate-950/40 border border-slate-850 p-5 rounded-xl flex flex-col justify-between h-[155px]">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-slate-200 text-[13px] truncate">{t.title}</h4>
                          <Badge variant={t.priority === 'critical' ? 'rose' : t.priority === 'high' ? 'orange' : 'slate'} className="text-[8px] px-2 py-0">
                            {t.priority}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-2 line-clamp-3 leading-relaxed normal-case first-letter:uppercase">
                          {t.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-850/60 flex justify-between items-center text-[10px]">
                        <span className="text-cyan-400 uppercase font-mono font-bold">Category: {t.category}</span>
                        <span className="text-slate-400 font-bold">{t.estimatedHours} Hours</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kanban Active board view */}
            {currentProject.status === 'active' && tasks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {['todo', 'in_progress', 'review', 'done'].map((col) => {
                  const colTasks = tasks.filter((t) => t.status === col);
                  const colLabels = {
                    todo: 'To Do',
                    in_progress: 'In Progress',
                    review: 'Under Review',
                    done: 'Shipped'
                  };
                  const colBorders = {
                    todo: 'border-slate-850',
                    in_progress: 'border-indigo-500/20',
                    review: 'border-cyan-500/20',
                    done: 'border-emerald-500/20'
                  };

                  return (
                    <div key={col} className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <span className="text-xs font-bold text-slate-350">{colLabels[col]}</span>
                        <Badge variant={col === 'done' ? 'emerald' : col === 'review' ? 'cyan' : 'slate'} className="text-[9px] px-2 py-0">
                          {colTasks.length}
                        </Badge>
                      </div>

                      <div className={`space-y-4 min-h-[500px] border-t-2 ${colBorders[col]} pt-3`}>
                        {colTasks.map((task, idx) => {
                          const isAssignee = task.assignedTo === user?.id;

                          return (
                            <div key={task.id} className={`glass-panel p-5 rounded-xl flex flex-col justify-between min-h-[160px] relative overflow-hidden transition-all duration-300 hover:border-emerald-500/30 animate-slide-up kanban-card-delay-${Math.min(idx + 1, 5)}`}>
                              <div>
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className="font-bold text-slate-150 text-xs tracking-wide line-clamp-1 truncate">{task.title}</h4>
                                  <Badge variant={task.priority === 'critical' ? 'rose' : task.priority === 'high' ? 'orange' : 'slate'} className="text-[7px] px-1.5 py-0 shrink-0">
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 line-clamp-3 leading-relaxed normal-case first-letter:uppercase">
                                  {task.description}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-slate-850/60 space-y-3">
                                {task.isLearningTask && (
                                  <div className="flex items-center gap-1 text-cyan-400 text-[8px] font-bold">
                                    <Sparkles size={10} />
                                    LEARNING STRETCH
                                  </div>
                                )}

                                <div className="flex justify-between items-center text-[9px] text-slate-400">
                                  <div className="flex items-center gap-1.5">
                                    <div className="h-6 w-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 text-[9px] uppercase font-bold shadow-inner">
                                      {task.assignee?.name?.charAt(0)}
                                    </div>
                                    <span className="font-bold truncate max-w-[80px]">{task.assignee?.name}</span>
                                  </div>
                                  <span className="font-bold shrink-0">{task.estimatedHours}h</span>
                                </div>

                                {/* Shift mutator controls */}
                                {isAssignee && (
                                  <div className="flex gap-1 pt-1.5">
                                    {col === 'todo' && (
                                      <Button
                                        onClick={() => handleShiftTask(task.id, 'in_progress')}
                                        variant="secondary"
                                        className="w-full text-[8px] py-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500"
                                      >
                                        Start
                                        <ChevronRight size={10} />
                                      </Button>
                                    )}
                                    {col === 'in_progress' && (
                                      <Button
                                        onClick={() => handleShiftTask(task.id, 'review')}
                                        variant="secondary"
                                        className="w-full text-[8px] py-1 border-cyan-500/30 text-cyan-455 hover:bg-cyan-500/5 hover:border-cyan-500"
                                      >
                                        Submit Review
                                        <ChevronRight size={10} />
                                      </Button>
                                    )}
                                    {col === 'review' && isOwner && (
                                      <div className="flex gap-1 w-full">
                                        <Button
                                          onClick={() => handleShiftTask(task.id, 'done')}
                                          variant="secondary"
                                          className="w-1/2 text-[7px] py-1 border-emerald-500/30 text-emerald-450"
                                        >
                                          Approve
                                        </Button>
                                        <Button
                                          onClick={() => handleShiftTask(task.id, 'in_progress')}
                                          variant="secondary"
                                          className="w-1/2 text-[7px] py-1 border-rose-500/30 text-rose-450"
                                        >
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Team Matrix */}
        {activeTab === 'matrix' && (
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 size={18} className="text-emerald-455" />
                Team Skills Coverage Matrix
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase">Displays technical experience levels mapping across core project domains.</p>
            </div>

            <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950/20">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 bg-slate-950/50 text-[10px] font-bold">
                    <th className="p-4 uppercase tracking-wider font-mono">Student Name</th>
                    {skillCategories.map(cat => (
                      <th key={cat} className="p-4 uppercase tracking-wider font-mono">{cat}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {currentProject.members?.map(member => {
                    const memberSkills = member.user?.skills || [];
                    
                    return (
                      <tr key={member.id} className="hover:bg-slate-900/30">
                        <td className="p-4 font-bold text-slate-200 uppercase tracking-wide">
                          {member.user?.name}
                          {member.userId === currentProject.ownerId && (
                            <span className="text-[9px] text-indigo-400 bg-indigo-500/5 px-1.5 py-0.2 rounded border border-indigo-500/10 ml-2 font-bold font-mono">LEADER</span>
                          )}
                        </td>
                        
                        {skillCategories.map(cat => {
                          // Find member's strongest skill in this category
                          const matched = memberSkills.filter(s => s.category.toLowerCase() === cat.toLowerCase());
                          matched.sort((a, b) => (levelWeights[b.level] || 0) - (levelWeights[a.level] || 0));
                          const topSkill = matched[0];

                          return (
                            <td key={cat} className="p-4 font-mono">
                              {topSkill ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-300">{topSkill.skillName}</span>
                                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                                    topSkill.level === 'advanced' 
                                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' 
                                      : topSkill.level === 'intermediate'
                                      ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-400'
                                      : 'bg-slate-500/5 border-slate-500/20 text-slate-400'
                                  }`}>
                                    {topSkill.level}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-600 font-light font-mono">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Gaps flag analysis logs */}
            <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                <AlertCircle size={15} className="text-indigo-400" />
                Skill Coverage Gap logs
              </h4>
              <ul className="space-y-2.5 text-[11px] text-slate-400 lowercase normal-case leading-relaxed">
                {/* Dynamic logic to calculate gaps for project role requirements */}
                {currentProject.roles?.map(role => {
                  const isFilled = currentProject.members?.some(m => m.role.toLowerCase() === role.roleTitle.toLowerCase());
                  return (
                    <li key={role.id} className="flex items-start gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full mt-1.5 ${isFilled ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                      <span>
                        Role Slot vacancy **"{role.roleTitle}"** requires skill levels **[{role.skillsRequired.join(', ')}] ({role.levelRequired})**
                        {isFilled ? (
                          <span className="text-emerald-450 ml-1.5 font-bold uppercase text-[9px] font-mono">[Coverage Verified]</span>
                        ) : (
                          <span className="text-rose-450 ml-1.5 font-bold uppercase text-[9px] font-mono">[Vacancy Unfilled - Recruit Candidate]</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: AI Matching logs */}
        {activeTab === 'logs' && matchLogs.length > 0 && (
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-emerald-400" />
                AI Task Allocation Scoring Logs
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase">Rolling execution print logs detailing weighted scoring indexes from the matching service.</p>
            </div>

            <div className="bg-slate-950 border border-emerald-500/10 p-6 rounded-xl font-mono text-[10px] text-emerald-400 space-y-6 max-h-[500px] overflow-y-auto shadow-inner select-text">
              <div className="text-slate-500 pb-2 border-b border-slate-900 font-bold">
                $ exec studentforge-engine --run-balancer --verbose
              </div>
              
              {matchLogs.map((log, idx) => (
                <div key={idx} className="space-y-2 border-l border-emerald-500/20 pl-4">
                  <p className="font-bold text-cyan-400">
                    &gt; TASK ALLOCATION: "{log.taskTitle}"
                  </p>
                  <p className="text-slate-350">
                    &gt; matched to: <span className="font-bold text-white uppercase">{log.assignedTo}</span> (score weight: {log.score})
                  </p>
                  <div className="space-y-1 pl-4 mt-2">
                    <p className="text-slate-500 font-bold uppercase text-[8px] tracking-wide">Candidate Scores Breakdown:</p>
                    {log.logs?.map((candidate, cidx) => (
                      <p key={cidx} className="text-slate-400 leading-normal">
                        - {candidate.memberName.padEnd(20)} | skills: {candidate.scores.skill} | availability: {candidate.scores.availability} | reliability: {candidate.scores.reliability} | learning: {candidate.scores.learning} | total: {candidate.scores.total}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="text-slate-500 pt-4 border-t border-slate-900 font-bold">
                $ studentforge-engine completed with status code 0 (success).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
