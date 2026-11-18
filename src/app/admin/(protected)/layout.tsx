import { logoutAdmin } from '../actions';
import { requireAdmin } from '@/lib/adminAuth';
import AdminNav from './_components/AdminNav';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireAdmin();

  return (
    <main className="min-h-dvh bg-main-white text-shadow-black">
      <AdminNav logoutAction={logoutAdmin} />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </main>
  );
};

export default AdminLayout;
