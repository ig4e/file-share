"use client";
import { ChevronRight, Download } from "lucide-react";
import type { FileType } from "~/server/api/routers/files";
import "~/styles/globals.css";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FileSideBar from "~/app/_components/file-sidebar";
import { cn } from "~/lib/utils";

export function FilesView({
  files,
  stats,
}: {
  stats: {
    totalFiles: number;
    totalSize: string;
    maxFiles: number;
    free: string;
    totalSizeInBytes: number;
    freeInBytes: number;
    usedSizePrecentage: number;
    usedFilesPrecentage: number;
  };
  files: FileType | FileType[];
}) {
  const filesArray = useMemo(
    () => (Array.isArray(files) ? files : files.children) ?? [],
    [files],
  );
  const [filter, setFilter] = useState<"all" | "video" | "image" | "other">(
    "all",
  );
  const [selectedFile, setSelectedFile] = useState<FileType>();
  const [pagination, setPagination] = useState<{
    selectedIndex: number;
    isNextAvailable: boolean;
    isPrevAvailable: boolean;
  }>({
    selectedIndex: 0,
    isNextAvailable: true,
    isPrevAvailable: false,
  });

  const filterdFilesArray = useMemo(
    () =>
      filter === "all"
        ? filesArray
        : filesArray.filter((file) => file.fileType === filter),
    [filter, filesArray],
  );

  useEffect(() => {
    if (Array.isArray(files)) {
      setSelectedFile(files[pagination.selectedIndex]);
    } else {
      if (files.type === "folder") {
        setSelectedFile(files.children?.[pagination.selectedIndex]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  function nextFile() {
    const nextItem = filesArray?.[pagination.selectedIndex + 1];
    const isThereNext = filesArray?.[pagination.selectedIndex + 2];

    if (nextItem) {
      setPagination((prev) => ({
        ...prev,
        selectedIndex: prev.selectedIndex + 1,
        isPrevAvailable: true,
        isNextAvailable: !!isThereNext,
      }));
      setSelectedFile(nextItem);
    }
  }

  function prevFile() {
    const prevItem = filesArray?.[pagination.selectedIndex - 1];
    const isTherePrevious = filesArray?.[pagination.selectedIndex - 2];

    if (prevItem) {
      setPagination((prev) => ({
        ...prev,
        selectedIndex: prev.selectedIndex - 1,
        isPrevAvailable: !!isTherePrevious,
        isNextAvailable: true,
      }));
      setSelectedFile(prevItem);
    }
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Your Files</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Introducing Our Dynamic Files Dashboard for Seamless Management
                and Insightful Analysis.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Files</CardDescription>
              <CardTitle className="text-4xl">{stats.totalFiles}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Out of {stats.maxFiles}
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={stats.usedFilesPrecentage}
                aria-label={`%${stats.usedFilesPrecentage}`}
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Size</CardDescription>
              <CardTitle className="text-4xl">{stats.totalSize}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Out of {stats.free}
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={stats.usedSizePrecentage}
                aria-label={`%${stats.usedSizePrecentage}`}
              />
            </CardFooter>
          </Card>
        </div>

        <Tabs
          defaultValue="all"
          onValueChange={(value) => setFilter(value as never)}
        >
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </div>
          <Card className="mt-4">
            <CardHeader className="px-7">
              <CardTitle>Files</CardTitle>
              <CardDescription>All of your files</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Mime Type
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      UpdatedAt
                    </TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterdFilesArray?.map((file) => {
                    return (
                      <TableRow
                        key={file.path}
                        onClick={() => setSelectedFile(file)}
                        className={cn({
                          "bg-accent": selectedFile?.path === file.path,
                        })}
                      >
                        <TableCell>
                          <div className="max-w-64 overflow-hidden text-ellipsis font-medium">
                            {file.name}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {file.extension}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className="text-xs uppercase"
                            variant="secondary"
                          >
                            {file.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className="overflow-hidden text-ellipsis text-nowrap text-xs uppercase"
                            variant="secondary"
                          >
                            {file.mimeType}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {file.updatedAt.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {file.size}
                        </TableCell>
                        <TableCell className="text-right">
                          {file.type === "folder" ? (
                            <Link href={"/folder/" + file.path}>
                              <Button size="icon">
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                            </Link>
                          ) : (
                            <Link
                              download={file.name}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              rel="noreferrer"
                              href={file.url}
                            >
                              <Button size="icon">
                                <Download className="h-5 w-5" />
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <div>
        <FileSideBar
          selectedFile={selectedFile}
          pagination={{
            isNextAvailable: pagination.isNextAvailable,
            isPrevAvailable: pagination.isPrevAvailable,
            next: nextFile,
            prev: prevFile,
          }}
        />
      </div>
    </main>
  );
}
