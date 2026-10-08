import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Paperclip, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Private bucket; objects live at <projectId>/<file>. Storage RLS limits them
// to the project's client and admins.
const BUCKET = "project-files";
const MAX_BYTES = 25 * 1024 * 1024;

export function ProjectFiles({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<{ name: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const load = () =>
    supabase.storage
      .from(BUCKET)
      .list(projectId, { sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => setFiles(data ?? []));

  useEffect(() => {
    void load();
  }, [projectId]);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_BYTES) { toast.error("Files can be up to 25 MB."); return; }
    setBusy(true);
    // Timestamp prefix keeps same-named uploads from colliding.
    const path = `${projectId}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    setBusy(false);
    if (input.current) input.current.value = "";
    if (error) { toast.error(error.message); return; }
    load();
  };

  const open = async (name: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(`${projectId}/${name}`, 60);
    if (error) { toast.error(error.message); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  return (
    <div className="mt-4 border-t border-border/60 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Files</p>
        <button onClick={() => input.current?.click()} disabled={busy} className="inline-flex items-center gap-1.5 text-sm text-primary disabled:opacity-60">
          <Upload className="size-3.5" /> {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={input} type="file" hidden onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      <div className="mt-3 space-y-2">
        {files.length === 0 && <p className="text-sm text-muted-foreground">No files yet.</p>}
        {files.map((f) => (
          <button key={f.name} onClick={() => open(f.name)} className="flex w-full items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-left text-sm hover:text-primary">
            <Paperclip className="size-3.5 shrink-0" />
            <span className="truncate">{f.name.replace(/^\d+-/, "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
