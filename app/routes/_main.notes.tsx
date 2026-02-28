import { useLoaderData } from "react-router";
import { Link } from "react-router";
import { DateTime } from "luxon";
import prisma from "~/lib/db";

export function meta() {
  return [{ title: "Notes" }];
}

export async function loader() {
  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });

  return notes;
}

export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();
  return (
    <main>
      <section className="flex items-center justify-between">
        <h3 className="font-bold text-2xl">Notes</h3>
        <Link to={"/create"} className="btn btn-sm btn-outline">
          Create
        </Link>
      </section>
      <section className="py-5">
        {notes.length > 0 ? (
          <div className="flex flex-col gap-5">
            {notes.map((note) => (
              <Link
                to={`/note/${note.id}`}
                key={note.id}
                className="w-full h-48 bg-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-lg mb-2">{note.title}</h4>
                  <p className="line-clamp-3 whitespace-pre-line text-white/50">
                    {note.content}
                  </p>
                </div>
                <div className="flex justify-end">
                  <span className="text-white/25 text-sm">
                    {DateTime.fromJSDate(note.createdAt).toRelative()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <i>you don't have any notes yet!</i>
        )}
      </section>
    </main>
  );
}
