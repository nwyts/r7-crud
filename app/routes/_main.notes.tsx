import { DateTime } from "luxon";
import { useLoaderData } from "react-router";
import { data, Link } from "react-router";
import prisma from "~/lib/db";

export function meta() {
  return [{ title: "Notes" }];
}

export async function loader() {
  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });

  return data(notes);
}

export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();

  return (
    <main>
      <section className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Notes</h3>
        <Link to="/create" className="btn btn-outline btn-sm">
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
                className="w-full h-48 p-5 rounded-md bg-white/5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold text-lg mb-2">{note.title}</h4>
                  <p className="text-white/60 line-clamp-3 whitespace-pre-line">
                    {note.content}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white/20">
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
