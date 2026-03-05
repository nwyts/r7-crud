import { Camera } from "lucide-react";
import { data, Link, redirect, type LoaderFunctionArgs } from "react-router";
import type { ActionFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { useFetcher } from "react-router";
import prisma from "~/lib/db";

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  return [{ title: `Edit : ${loaderData?.title}` }];
};
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

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw data("Ooopppsss Note not found!", { status: 404 });

  return data(note);
}

export default function EditPage() {
  const note = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  const loading = state === "submitting";
  return (
    <main>
      <section className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Edit</h3>
        <Link to={`/note/${note.id}`} className="btn btn-sm btn-outline">
          Back
        </Link>
      </section>
      <Form className="py-5" method="POST">
        <fieldset disabled={loading} className="flex flex-col gap-3">
          <input
            defaultValue={note.title}
            name="title"
            type="text"
            placeholder="title....."
            className="w-full py-2 px-4 border-b border-white/50 outline-none"
          />
          <textarea
            defaultValue={note.content}
            name="content"
            placeholder="write something here....."
            className="w-full h-48 resize-none p-4 border-b border-white/50 outline-none"
          />
          <div className="flex items-center justify-between">
            <button className="btn btn-sm btn-ghost" disabled>
              <Camera />
            </button>
            <button type="submit" className="btn btn-sm btn-outline">
              {loading ? <span className="loading loading-sm" /> : null}
              Submit
            </button>
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
