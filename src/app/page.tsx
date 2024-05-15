import "~/styles/globals.css";

import { api } from "~/trpc/server";
import { FilesView } from "./_components/files-view";

export default async function Home() {
  const { files, stats } = await api.file.getMany();

  return <FilesView files={files} stats={stats} />;
}
