import React, { useState, useRef } from 'react';
import { Upload, Send, Loader2 } from 'lucide-react';

interface NoticeFormProps {
  onSubmit: (message: string, file?: File) => Promise<void>;
  isLoading: boolean;
}

export const NoticeForm: React.FC<NoticeFormProps> = ({ onSubmit, isLoading }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || file) {
      await onSubmit(message, file || undefined);
      setMessage('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your notice message here..."
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={4}
      />
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            {file ? file.name : 'Attach File'}
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || (!message.trim() && !file)}
          className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Post Notice
        </button>
      </div>
    </form>
  );
};