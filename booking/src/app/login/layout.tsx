export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-300">
      {children}
    </div>
  );
}