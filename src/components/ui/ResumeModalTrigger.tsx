"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconClose,
  IconDownload,
  IconExternalLink,
  IconFileText,
  IconPrinter,
} from "@/components/ui/Icons";

interface ResumeModalTriggerProps {
  pdfUrl: string;
}

export default function ResumeModalTrigger({ pdfUrl }: ResumeModalTriggerProps) {
  const [open, setOpen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handlePrintPdf = () => {
    try {
      const frameWindow = frameRef.current?.contentWindow;
      if (frameWindow) {
        frameWindow.focus();
        frameWindow.print();
        return;
      }
    } catch {
      // Fall through to opening the PDF directly when inline frame printing is restricted.
    }

    const popup = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    popup?.addEventListener(
      "load",
      () => {
        try {
          popup.print();
        } catch {}
      },
      { once: true }
    );
  };

  return (
    <>
      <button
        type="button"
        className="btn btn--primary no-print resume-trigger-btn"
        onClick={() => setOpen(true)}
      >
        <IconFileText size={15} />
        <span>Preview, Print & Download PDF</span>
      </button>

      {open && (
        <div
          className="awrs-modal-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="resume-modal-card card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Parth Khansali Resume PDF Preview"
          >
            <div className="resume-modal-head">
              <div className="resume-modal-title-group">
                <span className="wall-modal-tag">CURRICULUM VITAE · PDF</span>
                <h2 className="resume-modal-title">Parth Khansali Resume.pdf</h2>
              </div>

              <div className="resume-modal-actions">
                <button
                  type="button"
                  className="btn btn--small"
                  onClick={handlePrintPdf}
                  title="Print resume PDF"
                >
                  <IconPrinter size={14} />
                  <span>Print</span>
                </button>

                <a
                  className="btn btn--primary btn--small"
                  href={pdfUrl}
                  download="Parth Khansali Resume.pdf"
                  type="application/pdf"
                >
                  <IconDownload size={14} />
                  <span>Download</span>
                </a>

                <a
                  className="awrs-icon-btn"
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open PDF in new tab"
                  title="Open PDF in new tab"
                >
                  <IconExternalLink size={14} />
                </a>

                <button
                  type="button"
                  className="awrs-icon-btn awrs-close-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Close resume preview"
                  title="Close (Esc)"
                >
                  <IconClose size={15} />
                </button>
              </div>
            </div>

            <div className="resume-modal-body">
              <iframe
                ref={frameRef}
                src={`${pdfUrl}#view=FitH&navpanes=0`}
                title="Parth Khansali Resume PDF"
                className="resume-modal__frame"
              />
            </div>

            <p className="resume-modal-note">
              If your mobile browser shows only the first page inline, use Open or Download above.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
