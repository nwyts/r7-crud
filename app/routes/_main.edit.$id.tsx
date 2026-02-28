import { Camera, PencilIcon, Trash } from "lucide-react";
import { DateTime } from "luxon";
import type { MetaFunction } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { isRouteErrorResponse, redirect, useLoaderData } from "react-router";
import { data } from "react-router";
import { Link } from "react-router";
import prisma from "~/lib/db";
import type { Route } from "../+types/root";
import { useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [{ title: `Edit : ${loaderData?.title}` }];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw data("Note not found!", { status: 404 });
  return note;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { id } = params;

  const title = String(formData.get("title"));
  const content = String(formData.get("content"));

  await prisma.note.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return redirect(`/note/${id}`);
}

export default function EditPage() {
  const note = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  const loading = state === "submitting";
  return (
    <main>
      <section className="flex items-center justify-between">
        <h3 className="font-bold text-2xl">Edit</h3>
        <Link to={`/note/${note.id}`} className="btn btn-sm btn-outline">
          Back
        </Link>
      </section>
      <Form method="POST" className="py-5">
        <fieldset disabled={loading} className="flex flex-col gap-3">
          <input
            required
            type="text"
            name="title"
            placeholder="title...."
            defaultValue={note.title}
            className="w-full py-2 px-4 border-b border-white/50 outline-none"
          />
          <textarea
            required
            name="content"
            defaultValue={note.content}
            placeholder="write something here....."
            className="w-full h-40 p-4 border-b border-white/50 resize-none outline-none"
          />
          <div className="flex items-center justify-between">
            <button className="btn btn-sm btn-ghost text-white/50 hover:text-white/85">
              <Camera />
            </button>
            <button className="btn btn-sm btn-outline">
              {loading ? <span className="loading loading-sm" /> : null} Submit
            </button>
          </div>
        </fieldset>
      </Form>
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
