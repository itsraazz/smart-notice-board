import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Megaphone } from 'lucide-react';
import { db, storage } from './firebase';
import { NoticeForm } from './components/NoticeForm';
import { NoticeCard } from './components/NoticeCard';

interface Notice {
  id: string;
  message: string;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  storagePath?: string;
}

function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticeData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          timestamp: data.timestamp.toDate(),
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          storagePath: data.storagePath,
        };
      });
      setNotices(noticeData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (message: string, file?: File) => {
    setIsLoading(true);
    try {
      let fileUrl = '';
      let fileName = '';
      let storagePath = '';

      if (file) {
        const storageRef = ref(storage, `files/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
        fileName = file.name;
        storagePath = storageRef.fullPath;
      }

      await addDoc(collection(db, 'notices'), {
        message,
        timestamp: Timestamp.now(),
        fileUrl,
        fileName,
        storagePath,
      });
    } catch (error) {
      console.error('Error adding notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (notice: Notice) => {
    try {
      await deleteDoc(doc(db, 'notices', notice.id));
      if (notice.storagePath) {
        const storageRef = ref(storage, notice.storagePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <Megaphone className="w-8 h-8 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Smart Notice Board</h1>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <NoticeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="max-w-2xl mx-auto grid gap-6">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              message={notice.message}
              timestamp={notice.timestamp}
              fileUrl={notice.fileUrl}
              fileName={notice.fileName}
              onDelete={() => handleDelete(notice)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;