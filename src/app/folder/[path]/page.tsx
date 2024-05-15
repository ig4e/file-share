import "~/styles/globals.css";

import { FilesView } from "~/app/_components/files-view";
import { api } from "~/trpc/server";

async function Page({ params }: { params: { path: string } }) {
  const files = await api.file.getFolder({ path: params.path });

  return <FilesView files={files} stats={files.stats} />;
}

export default Page;
