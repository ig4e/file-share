"use client";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import type { FileType } from "~/server/api/routers/files";
import "~/styles/globals.css";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import { Separator } from "~/components/ui/separator";

function FileSideBar({
  selectedFile,
  pagination,
}: {
  selectedFile?: FileType;
  pagination: {
    isNextAvailable: boolean;
    isPrevAvailable: boolean;
    next: () => void;
    prev: () => void;
  };
}) {
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {selectedFile?.type === "file" ? "File" : "Folder"}{" "}
            {selectedFile?.name}
          </CardTitle>
          <CardDescription>
            Created {selectedFile?.createdAt.toLocaleString()}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Download</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">File Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Path</span>
              <span>{decodeURIComponent(selectedFile?.path ?? "")}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Size</span>
              <span>{selectedFile?.size}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{selectedFile?.type}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <div className="font-semibold">File Type</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Extension</span>
              <span>.{selectedFile?.extension}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Media Type</span>
              <span>{selectedFile?.fileType}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Mime Type</span>
              <span>{selectedFile?.mimeType}</span>
            </li>
          </ul>

          <Separator className="my-2" />

          <div className="font-semibold">More Details</div>

          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Size in bytes</span>
              <span>{selectedFile?.sizeInBytes}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Hash</span>
              <span>{selectedFile?.fileType}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated {selectedFile?.updatedAt.toLocaleString()}
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                onClick={() => pagination.prev()}
                disabled={!pagination.isPrevAvailable}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous File</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6"
                disabled={!pagination.isNextAvailable}
                onClick={() => pagination.next()}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next File</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

export default FileSideBar;
