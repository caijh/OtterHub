"use client";

import { useEffect } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { FileGallery } from "@/components/FileGallery";
import { BatchOperationsBar } from "@/components/batch-operations/BatchOperationsBar";
import { EmptyState } from "@/components/EmptyState";
import {
  useActiveItems,
  useFileDataStore,
  useFileUIStore,
  useHasAnySelection,
} from "@/stores/file";
import { ViewMode } from "@/lib/types";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FloatingActionButton } from "@/components/FloatingActionButton";

export default function OtterHubPage() {
  const activeItems = useActiveItems();
  const hasAnySelection = useHasAnySelection();

  const { fetchNextPage } = useFileDataStore();
  const { viewMode } = useFileUIStore();

  const isListOrGrid = [ViewMode.Grid, ViewMode.List].includes(viewMode);

  const showBatchBar = hasAnySelection && isListOrGrid;

  const isEmpty = activeItems.length === 0;
  
  useEffect(() => {
    fetchNextPage().catch((error) => {
      console.error("[OtterHubPage] fetch files failed:", error);
    });
  }, [fetchNextPage]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        <main className="flex-1 p-6 md:p-8">
          <FileUploadZone />

          {isEmpty ? <EmptyState /> : <FileGallery />}
        </main>

        {showBatchBar && <BatchOperationsBar />}

        <FloatingActionButton />

        <Footer />
      </div>
    </div>
  );
}
