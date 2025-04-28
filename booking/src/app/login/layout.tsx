import SessionChecker from "@/_components/serverSide/SessionChecker";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const sessionCheck = await SessionChecker({ portal: "customer" });

  if (sessionCheck) {
    redirect("/admin");
  }


  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-300">
      {children}
    </div>
  );
}