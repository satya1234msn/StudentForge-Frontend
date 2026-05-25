import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Cpu, Briefcase, Award } from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Hero Segment */}
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28 flex flex-col items-center text-center justify-center relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl leading-none">
          Forge Elite Teams.<br className="hidden md:inline" />
          <span className="text-gradient-purple-blue">Ship Outstanding Projects.</span>
        </h1>
        
        <p className="mt-8 text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl font-light">
          A platform where students form teams based on verified skill matrix gaps, distribute work fairly using <span className="text-slate-200 font-medium">AI-guided workload balancing</span>, and build a verified digital proof-of-work portfolio with every commit.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto text-base py-3 px-8 group">
              Get Started Free
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/discover" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto text-base py-3 px-8">
              Explore Projects
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Values Features Section */}
      <section className="bg-slate-950/40 border-t border-slate-900/80 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Engineered for Student Builders
            </h2>
            <p className="mt-4 text-slate-400">
              No more carrying group projects alone, and no more empty resumes at graduation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Dynamic Skill-Gap Matching</h3>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                Recruit partners by identifying coverage needs across frontend, backend, or design. Build an organic team grid before starting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-inner">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">AI Task Orchestration</h3>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                System prompts generation lists from project logs, matches work packages to strongest skills, balances load thresholds, and allocates learning goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6 shadow-inner">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">Verified Proof-of-Work</h3>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm">
                Transform shipped tasks, peer reviews, and reliability badges into a verified shareable portfolio page. Impress recruiters with real metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Stats bar */}
      <section className="border-t border-slate-900/60 py-16 px-6 md:px-12 max-w-7xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <p className="text-3xl md:text-5xl font-extrabold text-indigo-400">100%</p>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium uppercase tracking-wider">Skill Match Verified</p>
        </div>
        <div>
          <p className="text-3xl md:text-5xl font-extrabold text-purple-400">0</p>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium uppercase tracking-wider">Group Slacker Slack</p>
        </div>
        <div>
          <p className="text-3xl md:text-5xl font-extrabold text-teal-400">5.0</p>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium uppercase tracking-wider">Reliability Driven</p>
        </div>
        <div>
          <p className="text-3xl md:text-5xl font-extrabold text-rose-400">Auto</p>
          <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium uppercase tracking-wider">AI Portfolio Entry</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
