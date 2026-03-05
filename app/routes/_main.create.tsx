import type { ActionFunctionArgs } from "react-router";
import { useFetcher, redirect, Link } from "react-router";
import { Camera } from "lucide-react";
import prisma from "~/lib/db";

export function meta() {
  return [{ title: "Create" }];
}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const title = String(formData.get("title"));
  const content = String(formData.get("content"));

  await prisma.note.create({
    data: {
      title,
      content,
    },
  });

  return redirect("/notes");
}
export default function CreatePage() {
  const { Form, state } = useFetcher();
  const loading = state === "submitting";

  return (
    <main>
      <section className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Create</h3>
        <Link to={"/notes"} className="btn btn-sm btn-outline">
          Home
        </Link>
      </section>
      <Form className="py-5" method="POST">
        <fieldset disabled={loading} className="flex flex-col gap-3">
          <input
            name="title"
            type="text"
            placeholder="title....."
            className="w-full py-2 px-4 border-b border-white/50 outline-none"
          />
          <textarea
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
