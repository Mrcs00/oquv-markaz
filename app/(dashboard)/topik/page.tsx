import { PageHeader } from "@/components/PageHeader";
import { TopikManager } from "@/components/TopikManager";
import { getTopikApplicants } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TopikPage() {
  const applicants = await getTopikApplicants();

  return (
    <div>
      <PageHeader title="TOPIK" subtitle="Imtihonga kirgan o'quvchilar ro'yxati" />
      <div className="p-4 md:p-8">
        <TopikManager applicants={applicants} />
      </div>
    </div>
  );
}
