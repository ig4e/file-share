import { filesize } from "filesize";
import mime from "mime";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import checkDiskSpace from "check-disk-space";

const MAX_FILES = 500;

export const fileRouter = createTRPCRouter({
  getMany: publicProcedure.query(async () => {
    const filePaths = await fs.readdir("./public/files", {});
    const sysStats = await getSysStats();

    const files = await Promise.all(
      filePaths.map(async (filePath) => {
        return await readFile({ filePath });
      }),
    );

    const totalSizeInBytes = files.reduce(
      (total, current) => total + current.sizeInBytes,
      0,
    );

    return {
      stats: {
        totalFiles: files.length,
        totalSize: filesize(totalSizeInBytes),
        maxFiles: MAX_FILES,
        free: sysStats.formatted.free,
        totalSizeInBytes,
        freeInBytes: sysStats.free,
        usedSizePrecentage: Math.round(
          (totalSizeInBytes / sysStats.free) * 100,
        ),
        usedFilesPrecentage: Math.round((files.length / MAX_FILES) * 100),
      },
      files,
    };
  }),

  getFolder: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input }) => {
      const folder = await readFile({
        filePath: decodeURIComponent(input.path),
      });
      const sysStats = await getSysStats();

      const totalSizeInBytes =
        folder.children?.reduce(
          (total, current) => total + current.sizeInBytes,
          0,
        ) ?? 0;

      return {
        stats: {
          totalFiles: folder.children?.length ?? 0,
          totalSize: filesize(totalSizeInBytes),
          maxFiles: MAX_FILES,
          free: sysStats.formatted.free,
          totalSizeInBytes,
          freeInBytes: sysStats.free,
          usedSizePrecentage: Math.round(
            (totalSizeInBytes / sysStats.free) * 100,
          ),
          usedFilesPrecentage: Math.round(
            ((folder.children?.length ?? 0) / MAX_FILES) * 100,
          ),
        },
        ...folder,
      };
    }),
});

export interface SingleFileType {
  name: string;
  size: string;
  sizeInBytes: number;
  type: "file" | "folder";
  fileType: "folder" | "video" | "image" | "other";
  mimeType: string;
  extension: string;
  path: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileType extends SingleFileType {
  children?: SingleFileType[] | FileType[];
}

export async function getSysStats() {
  const { free, size } = await checkDiskSpace(
    path.join(__dirname, "./public/files/"),
  );

  return {
    formatted: { free: filesize(free), total: filesize(size) },
    free,
    size,
  };
}

export async function readFile({
  filePath,
}: {
  filePath: string;
}): Promise<FileType> {
  const fullFilePath = "./public/files/" + filePath;

  try {
    const fileStats = await fs.stat(fullFilePath);
    const isFolder = fileStats.isDirectory();
    const fileExt = filePath.split(".").pop()!;

    const dirData = {
      name: path.basename(filePath),
      size: filesize(fileStats.size),
      sizeInBytes: fileStats.size,
      type: isFolder ? "folder" : "file",
      path: encodeURIComponent(filePath),
      url: encodeURI("/files/" + filePath),
      mimeType: mime.getType(fileExt) ?? "folder",
      extension: fileExt ?? "folder",
      fileType: isFolder
        ? "folder"
        : mime.getType(fileExt)!.includes("video")
          ? "video"
          : mime.getType(fileExt)!.includes("image")
            ? "image"
            : "other",
      createdAt: fileStats.birthtime,
      updatedAt: fileStats.mtime,
    } satisfies SingleFileType;

    if (isFolder) {
      const childrenPaths = await fs.readdir(fullFilePath);

      const children = await Promise.all(
        childrenPaths.map(async (childPath) => {
          return await readFile({ filePath: filePath + "/" + childPath });
        }),
      );

      const folderSize = children.reduce(
        (total, current) => total + current.sizeInBytes,
        0,
      );

      return {
        ...dirData,
        sizeInBytes: folderSize,
        size: filesize(folderSize),
        children: children,
      };
    }

    return dirData;
  } catch (error) {
    console.error(`Error reading file ${fullFilePath}:`, error);
    throw error;
  }
}
