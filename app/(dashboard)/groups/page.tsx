import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GroupsList } from "@/components/GroupsList";
import { getGroups } from "@/lib/data";

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <div>
      <PageHeader
        title="Guruhlar"
        action={
          <Link href="/groups/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Yangi guruh
          </Link>
        }
      />
      <div className="p-4 md:p-8">
        <GroupsList groups={groups} />
      </div>
    </div>
  );
}
