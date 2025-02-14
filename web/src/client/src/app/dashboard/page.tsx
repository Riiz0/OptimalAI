import { DashboardGuard } from '@/components/dashboard/dashboard-guard';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <DashboardView />
    </DashboardGuard>
  );
}
