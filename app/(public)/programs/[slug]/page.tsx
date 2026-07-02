import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgramRegistration } from "@/components/features/programs/program-registration";

async function getProgram(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!program) return { program: null, userId: null, isRegistered: false };

  let isRegistered = false;
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      const { data: reg } = await supabase
        .from("program_registrations")
        .select("id")
        .eq("program_id", program.id)
        .eq("member_id", member.id)
        .maybeSingle();

      isRegistered = !!reg;
    }
  }

  return { program, userId: user?.id ?? null, isRegistered };
}

export default async function ProgramDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { program, userId, isRegistered } = await getProgram(slug);

  if (!program) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{program.title}</h1>
        <p className="text-pri-silver mt-1">{program.short_description}</p>
      </div>

      <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-6">
        <p className="text-pri-silver">{program.description}</p>

        {program.features && program.features.length > 0 && (
          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Fitur:</h3>
            <ul className="list-disc list-inside space-y-1 text-pri-silver">
              {program.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ProgramRegistration
        programId={program.id}
        registered={isRegistered}
        registrationStatus={isRegistered ? "registered" : null}
        isLoggedIn={!!userId}
      />
    </div>
  );
}
