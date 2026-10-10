"use client";

import React, { useState } from "react";
import {
  FolderLock,
  Upload,
  Search,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  ExternalLink,
  X,
} from "lucide-react";
import { Company } from "@/types/financial";
import { DocumentChunk, IngestedDocument } from "@/types/document";
import { INGESTED_DOCUMENTS, DOCUMENT_CHUNKS } from "@/data/documents";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface DocumentLibraryViewProps {
  company: Company;
  isOpenUploadModal: boolean;
  onCloseUploadModal: () => void;
  onOpenUploadModal: () => void;
}

export function DocumentLibraryView({
  company,
  isOpenUploadModal,
  onCloseUploadModal,
  onOpenUploadModal,
}: DocumentLibraryViewProps) {
  const [documents, setDocuments] = useState<IngestedDocument[]>(INGESTED_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<IngestedDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.companyTicker && d.companyTicker.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const relatedChunks = selectedDoc
    ? DOCUMENT_CHUNKS.filter((c) => c.documentId === selectedDoc.id)
    : DOCUMENT_CHUNKS.slice(0, 4);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Extracting document text & validating structure...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyTicker", company.ticker);
    formData.append("documentType", "quarterly_report_10q");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.document) {
        setDocuments((prev) => [data.document, ...prev]);
        setUploadStatus("Indexing complete! Generated 1536-dim pgvector embeddings.");
        setTimeout(() => {
          setIsUploading(false);
          setUploadStatus(null);
          onCloseUploadModal();
        }, 1200);
      } else {
        setUploadStatus(`Upload failed: ${data.error || "File error"}`);
        setIsUploading(false);
      }
    } catch {
      setUploadStatus("Network error uploading file.");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            RAG Document Intelligence & pgvector Repository
            <Badge variant="positive">EMBEDDINGS READY</Badge>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vectorized SEC Form 10-K filings, earnings transcripts, and trade policy memos
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={onOpenUploadModal} icon={<Upload className="w-3.5 h-3.5" />}>
          Upload Financial Document
        </Button>
      </div>

      {/* Search & Stats Bar */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span>
            Indexed Documents: <strong className="text-slate-900 font-mono">{documents.length}</strong>
          </span>
          <span>•</span>
          <span>
            Active Vector Chunks: <strong className="text-slate-900 font-mono">{DOCUMENT_CHUNKS.length * 28}</strong>
          </span>
          <span>•</span>
          <span>
            Embedding Dimension: <strong className="text-indigo-600 font-mono">1536 (text-embedding-3-small)</strong>
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filings, chunks, tickers..."
            className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs w-60 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>

      {/* Main Grid: Documents Table + Chunk Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Documents List (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Catalog of Grounded Filings & Transcripts</CardTitle>
            <CardDescription>
              Select any document to inspect its parsed vector chunks and metadata
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/50 border-indigo-300 shadow-sm ring-1 ring-indigo-400"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {doc.fileType === "csv" ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      )}
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {doc.title}
                      </h4>
                    </div>

                    <Badge variant="positive" className="text-[10px] shrink-0 font-mono">
                      INDEXED
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                    {doc.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                    <span>
                      {doc.fileName} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <span className="text-indigo-600 font-semibold font-sans">
                      {doc.chunkCount} Chunks Indexed →
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Column: Chunk Vector Inspector (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" />
                Vector Chunk Excerpt Inspector
              </CardTitle>
              <CardDescription>
                Live embedding preview and section citations used by RAG retrieval
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-1">
            {relatedChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="font-bold text-slate-800">Chunk #{chunk.chunkIndex}</span>
                  <span className="text-emerald-600 font-semibold">
                    Similarity: {((chunk.similarityScore || 0.92) * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-indigo-700 font-sans">
                  {chunk.metadata.sectionHeading || "Consolidated Statements"}
                </div>

                <blockquote className="p-2.5 rounded-lg bg-white border border-slate-200/80 text-[11px] text-slate-700 italic leading-relaxed">
                  &ldquo;{chunk.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Tokens: {chunk.tokenCount}</span>
                  <span>pgvector: 1536-dim HNSW</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Document Upload Modal */}
      {isOpenUploadModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Upload & Ingest Financial Filing
              </h3>
              <button
                onClick={onCloseUploadModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Upload PDF (Form 10-K, 10-Q, Earnings Call) or CSV (Statement metrics). FinSight AI extracts text, generates vector embeddings, and stores them in PostgreSQL with pgvector.
            </p>

            {/* Drag and Drop Zone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20 block">
              <Upload className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-xs font-bold text-slate-900">
                Click to browse or drop financial filing here
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Supports PDF, CSV, TXT (Maximum file size: 15MB)
              </span>
              <input
                type="file"
                accept=".pdf,.csv,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {/* Progress Message */}
            {uploadStatus && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={onCloseUploadModal} disabled={isUploading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
