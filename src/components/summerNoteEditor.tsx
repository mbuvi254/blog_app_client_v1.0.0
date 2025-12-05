// src/components/SummernoteEditor.tsx
import { useEffect, useRef } from "react";
import $ from "jquery";
import "summernote/dist/summernote-lite.min.js";
import "summernote/dist/summernote-lite.min.css";

// Extend jQuery interface to include summernote
declare global {
  interface JQuery {
    summernote(options?: any): JQuery;
    summernote(command: string, ...args: any[]): any;
  }
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  uploadImage?: (file: File) => Promise<string>; // returns URL
  disabled?: boolean;
  onInit?: () => void;
}

export default function SummernoteEditor({
  value = "",
  onChange,
  placeholder = "Write your content...",
  height = 300,
  uploadImage,
  disabled = false,
  onInit,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const $el = $(rootRef.current!);

    $el.summernote({
      placeholder,
      height,
      tabsize: 2,
      toolbar: [
        // customize toolbar to your taste
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "strikethrough", "clear"]],
        ["fontname", ["fontname"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["link", "picture", "video", "table"]],
        ["view", ["fullscreen", "codeview"]],
      ],
      callbacks: {
        onChange: function (contents: string) {
          onChange(contents);
        },
        onImageUpload: function (files: File[]) {
          if (!uploadImage) {
            // default: insert local image as dataURL (not recommended for production)
            const reader = new FileReader();
            reader.onload = (e) => {
              $el.summernote("insertImage", e.target?.result as string);
            };
            reader.readAsDataURL(files[0]);
            return;
          }

          // upload to server and insert returned URL
          (async () => {
            try {
              const url = await uploadImage(files[0]);
              $el.summernote("insertImage", url);
            } catch (err) {
              console.error("Upload failed", err);
            }
          })();
        },
      },
    });

    // set initial value
    $el.summernote("code", value || "");

    // call onInit callback if provided
    if (onInit) {
      onInit();
    }

    return () => {
      $el.summernote("destroy");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep value in sync if parent changes it
  useEffect(() => {
    const $el = $(rootRef.current!);
    const currentCode = $el.summernote("code");
    if (currentCode !== value) {
      $el.summernote("code", value || "");
    }
  }, [value]);

  // handle disabled state
  useEffect(() => {
    const $el = $(rootRef.current!);
    if ($el.summernote) {
      $el.summernote(disabled ? "disable" : "enable");
    }
  }, [disabled]);

  return <div ref={rootRef} />;
}
