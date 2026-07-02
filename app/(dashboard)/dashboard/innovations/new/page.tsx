import { createClient } from "@/lib/supabase/server";
import { NewInnovationForm } from "./new-innovation-form";

export default async function NewInnovationPage() {
  const supabase = await createClient();
  const { data: provinces } = await supabase
    .from("provinces")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Buat Inovasi Baru</h1>
        <p className="text-pri-silver mt-1">Bagikan inovasi Anda</p>
      </div>

      <NewInnovationForm provinces={provinces ?? []} />
    </div>
  );
}
