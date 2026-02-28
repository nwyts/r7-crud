import { Camera } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { useFetcher } from "react-router";
import { Link } from "react-router";
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
        <h3 className="font-bold text-2xl">Create</h3>
        <Link to={"/notes"} className="btn btn-sm btn-outline">
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
            className="w-full py-2 px-4 border-b border-white/50 outline-none"
          />
          <textarea
            required
            name="content"
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
