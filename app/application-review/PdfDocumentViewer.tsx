"use client";

import React, { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type PdfDocumentViewerProps = {
  file: string;
  pageNumber: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
};

export default function PdfDocumentViewer({
  file,
  pageNumber,
  onLoadSuccess,
  onLoadError,
}: PdfDocumentViewerProps) {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  }, []);

  return (
    <Document
      file={file}
      onLoadSuccess={onLoadSuccess}
      onLoadError={onLoadError}
      loading={<div className="text-gray-500 p-8">Loading PDF...</div>}
    >
      <Page
        pageNumber={pageNumber}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        className="max-w-full"
      />
    </Document>
  );
}
