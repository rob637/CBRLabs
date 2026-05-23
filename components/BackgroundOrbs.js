export default function BackgroundOrbs() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark" />
      <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-sky-400/40 to-indigo-500/40 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-fuchsia-400/30 to-violet-600/30 blur-3xl animate-float-slower" />
      <div className="absolute bottom-[-10rem] left-1/4 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-cyan-300/30 to-blue-500/30 blur-3xl animate-float-slow" />
    </div>
  );
}
