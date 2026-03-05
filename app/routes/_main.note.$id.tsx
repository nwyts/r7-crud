import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import {
  Link,
  useFetcher,
  useLoaderData,
  data,
  redirect,
  isRouteErrorResponse,
} from "react-router";
import { DateTime } from "luxon";
import prisma from "~/lib/db";
import type { Route } from "../+types/root";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [{ title: loaderData?.title }];
};

export async function action({ params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw data("Ooopppsss Note not found!", { status: 404 });

  await prisma.note.delete({ where: { id } });
  return redirect("/notes");
}
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw data("Ooopppsss Note not found!", { status: 404 });

  return note;
}

export default function NotePage() {
  const note = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  const loading = state === "submitting";
  return (
    <main>
      <section className="flex items-center justify-between">
        <Link to="/notes" className="btn btn-sm btn-outline">
          Home
        </Link>
        <div className="flex items-center justify-center">
          <Link to={`/edit/${note.id}`} className="btn btn-sm btn-outline">
            Edit
          </Link>
          <Form method="POST">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-sm btn-outline btn-error"
            >
              {loading ? <span className="loading loading-sm" /> : null}
              Delete
            </button>
          </Form>
        </div>
      </section>
      <section className="py-5">
        <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
        <p className="text-white/60">{note.content}</p>
        <div className="mt-5 text-right">
          <span className="text-white/25 text-sm">
            created at {DateTime.fromJSDate(note.createdAt).toRelative()}
          </span>
        </div>
      </section>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-center space-y-3">
        <h1 className="font-bold text-5xl">{error.status} 😥</h1>
        <p>{error.data}</p>
        <Link to={"/notes"} className="btn btn-outline btn-error">
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
