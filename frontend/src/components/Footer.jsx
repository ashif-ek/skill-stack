export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 pt-8 pb-4">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="SkillStack Logo" className="h-6 w-6 rounded shadow-sm opacity-50 grayscale" />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">SkillStack</p>
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/ashif-ek/skill-stack" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            GitHub Repository
          </a>
          <a 
            href="https://ashif-ek.github.io/docs-stack-material/projects/github_repos/skill-stack/" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
