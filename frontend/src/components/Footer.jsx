export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 pt-8 pb-4">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="SkillStack Logo" className="h-6 w-6 rounded shadow-sm opacity-50 grayscale" />
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">SkillStack</p>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <a 
            href="mailto:ashifek11@gmail.com" 
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Gmail
          </a>
          <a 
            href="tel:+919037499763" 
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Phone
          </a>
          <a 
            href="https://ashifek.in" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Portfolio
          </a>
          <a 
            href="https://linkedin.com/in/ashifek" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/ashif-ek" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://ashif-ek.github.io/docs-stack-material/" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Doc-stack
          </a>
        </div>
      </div>
    </footer>
  );
}
