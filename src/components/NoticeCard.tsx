import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Paperclip, X } from 'lucide-react';

interface NoticeCardProps {
  message: string;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  onDelete?: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({
  message,
  timestamp,
  fileUrl,
  fileName,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-blue-500 mr-2" />
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{message}</p>
      
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Paperclip className="w-4 h-4 mr-2" />
          {fileName || 'Attached File'}
        </a>
      )}
    </div>
  );
};