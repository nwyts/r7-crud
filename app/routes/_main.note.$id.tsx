import { PencilIcon, Trash } from "lucide-react";
import { DateTime } from "luxon";
import type { MetaFunction } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isRouteErrorResponse, useLoaderData } from "react-router";
import { data } from "react-router";
import { Link } from "react-router";
import prisma from "~/lib/db";
import type { Route } from "../+types/root";
import { useFetcher } from "react-router";
import { redirect } from "react-router";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [{ title: loaderData?.title }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw data("Note not found!", { status: 404 });
  return note;
}

export async function action({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw data("Note not found!", { status: 404 });

  await prisma.note.delete({ where: { id } });

  return redirect("/notes");
}

export default function NoteIdPage() {
  const note = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  const loading = state === "submitting";
  return (
    <main>
      <section className="flex items-center justify-between mb-10">
        <Link to="/notes" className="btn btn-sm btn-outline">
          Home
        </Link>
        <div className="flex items-center justify-center">
          <Link to={`/edit/${note.id}`} className="btn btn-sm btn-outline">
            <PencilIcon size={15} /> Edit
          </Link>
          <Form method="POST">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-sm btn-outline btn-error"
            >
              <Trash size={15} />
              {loading ? <span className="loading loading-sm" /> : null}
              Delete
            </button>
          </Form>
        </div>
      </section>
      <section className="p-5 bg-white/10">
        <h3 className="text-xl font-bold mb-2">{note.title}</h3>
        <p className="text-white/50 whitespace-pre-line">{note.content}</p>
        <div className="text-right mt-5">
          <span className="text-white/25">
            {DateTime.fromJSDate(note.createdAt).toRelative()}
          </span>
        </div>
      </section>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="flex items-center gap-5">
          <span className="text-6xl">😥</span>
          <h4 className="font-bold text-5xl">{error.status}</h4>
        </div>

        <div>
          <p className="font-bold text-2xl">{error.data}</p>
        </div>
        <Link to="/notes" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
