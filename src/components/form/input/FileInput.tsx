'use client';

import React, { useRef, FC } from 'react';
import { UI } from '@/lib/user-messages';

interface FileInputProps {
  className?: string;
  accept?: string;
  multiple?: boolean;
  fileName?: string | null;
  fileNames?: string[];
  chooseLabel?: string;
  emptyLabel?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({
  className,
  accept,
  multiple = false,
  fileName,
  fileNames,
  chooseLabel = UI.chooseFile,
  emptyLabel = UI.noFile,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayName =
    fileNames && fileNames.length > 0
      ? fileNames.length === 1
        ? fileNames[0]
        : `${fileNames.length} archivos`
      : fileName || emptyLabel;

  return (
    <div
      className={`flex h-11 w-full min-w-0 items-center overflow-hidden rounded-lg border border-gray-300 bg-transparent shadow-theme-xs focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-500/10 dark:border-gray-700 ${className ?? ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-full shrink-0 border-r border-gray-200 bg-gray-50 px-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.06]"
      >
        {chooseLabel}
      </button>
      <span className="min-w-0 flex-1 truncate px-3 text-sm text-gray-500 dark:text-gray-400">
        {displayName}
      </span>
    </div>
  );
};

export default FileInput;
