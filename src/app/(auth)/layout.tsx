import AuthGuard from "@/Components/AuthGuard/page";
import ReduxGuard from "@/Components/ReduxGuard/page";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ReduxGuard>
        {children}
      </ReduxGuard>
    </AuthGuard>
  );
}