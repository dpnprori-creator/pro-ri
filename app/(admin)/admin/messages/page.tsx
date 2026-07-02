import { createClient } from "@/lib/supabase/server";
import { MessagesManager } from "./messages-manager";

async function getMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pesan Masuk</h1>
        <p className="text-pri-silver mt-1">Total {messages.length} pesan</p>
      </div>

      <MessagesManager messages={messages} />
    </div>
  );
}
