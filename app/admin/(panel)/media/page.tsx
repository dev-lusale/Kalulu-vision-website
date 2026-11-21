import { MediaLibrary } from "@/components/cms/media";
import { hasDatabase } from "@/lib/server/pool";

export const metadata = { title: "Media library" };

export default function MediaPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold">Media library</h1>
      <p className="mt-1 text-sm text-slate-600">Upload real photos and interface screenshots once, then use them in projects, products, articles and the website photo slots.</p>
      <div className="mt-6">
        {hasDatabase() ? <MediaLibrary /> : <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">A database is needed to store uploaded images. Set DATABASE_URL.</p>}
      </div>
    </div>
  );
}
