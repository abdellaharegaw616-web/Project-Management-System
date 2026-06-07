import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus,
  Folder,
  Download,
  Share,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Upload,
  Grid,
  List,
  Star,
  Clock,
  Image,
  Archive,
  User
} from 'lucide-react';
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import toast from 'react-hot-toast';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // grid, list
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, date, size
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renameModal, setRenameModal] = useState({ isOpen: false, docId: null, newName: '' });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const { api } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Documents will be fetched from real API endpoints
      // For now, initialize with empty arrays
      setDocuments([]);
      setFolders([]);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getFileIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (['pdf', 'txt'].includes(t)) return <FileText className="h-8 w-8 text-primary-600" />;
    if (['doc', 'docx'].includes(t)) return <FileText className="h-8 w-8 text-primary-600" />;
    if (['xls', 'xlsx'].includes(t)) return <FileText className="h-8 w-8 text-emerald-600" />;
    if (['ppt', 'pptx'].includes(t)) return <FileText className="h-8 w-8 text-amber-600" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(t)) return <Image className="h-8 w-8 text-indigo-500" />;
    if (['zip', 'rar'].includes(t)) return <Archive className="h-8 w-8 text-gray-500" />;
    return <FileText className="h-8 w-8 text-gray-400" />;
  };

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
    
    const file = files[0];
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      // Simulate upload completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const newDoc = {
          _id: documents.length + 1,
          name: file.name,
          type: file.name.split('.').pop() || 'file',
          size: file.size,
          updatedAt: new Date().toISOString(),
          updatedBy: { name: 'Abushe', email: 'abushe@25gmail.com' }
        };
        
        setDocuments([newDoc, ...documents]);
        toast.success(`${file.name} uploaded successfully!`);
        setUploadProgress(0);
      }, 2000);
    } catch (error) {
      toast.error('Upload failed');
      setUploadProgress(0);
    }
  };

  const handleView = (doc) => {
    // For now, show a toast. In a real app, this would open a preview
    toast.success(`Opening ${doc.name}...`);
    // You could implement a preview modal or open in new tab
    // window.open(doc.url, '_blank');
  };

  const handleDownload = (doc) => {
    // Create a mock download
    const blob = new Blob([`Mock content for ${doc.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${doc.name} downloaded`);
  };

  const handleRename = (doc) => {
    setRenameModal({
      isOpen: true,
      docId: doc._id,
      newName: doc.name
    });
  };

  const handleSaveRename = () => {
    if (!renameModal.newName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    
    setDocuments(prev => prev.map(doc => 
      doc._id === renameModal.docId 
        ? { ...doc, name: renameModal.newName }
        : doc
    ));
    
    toast.success('Document renamed successfully');
    setRenameModal({ isOpen: false, docId: null, newName: '' });
  };

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(d => d._id !== docId));
      toast.success('Document deleted');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Documents</h1>
          <p className="text-gray-600 mt-1">Manage and share your team documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md transition-colors ${
                view === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <button className="btn-primary inline-flex items-center gap-2 relative">
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Plus className="h-4 w-4" />
            Upload
            {uploadProgress > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                  </div>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input w-auto"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
          <option value="size">Sort by Size</option>
        </select>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="btn-outline inline-flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {typeFilter !== 'all' && (
              <span className="ml-1 px-2 py-0.5 bg-brand-500 text-white text-xs rounded-full">
                {typeFilter.toUpperCase()}
              </span>
            )}
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Filter by Type</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setTypeFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'all' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('pdf');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'pdf' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('doc');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'doc' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Word (DOC)
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('xls');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'xls' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Excel (XLS)
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('ppt');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'ppt' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    PowerPoint (PPT)
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('jpg');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'jpg' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Images (JPG/PNG)
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter('zip');
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      typeFilter === 'zip' ? 'bg-brand-100 text-brand-700' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Archives (ZIP/RAR)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Folders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {folders.map((folder) => (
          <div key={folder._id} className="card p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
                <Folder className="h-6 w-6 text-brand-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">{folder.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{folder.count} files</p>
            </div>
          </div>
        ))}
      </div>

      {/* Documents Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedDocuments.map((doc) => (
            <div key={doc._id} className="card p-4 group">
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">{getFileIcon(doc.type)}</div>
                <h3 className="text-sm font-medium text-gray-900 text-center truncate w-full">{doc.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(doc.size)}</p>
                <p className="text-xs text-gray-400">{formatDate(doc.updatedAt)}</p>
              </div>
              
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ThreeDotMenu items={[
                  { label: 'View', onClick: () => handleView(doc) },
                  { label: 'Download', onClick: () => handleDownload(doc) },
                  { label: 'Rename', onClick: () => handleRename(doc) },
                  { label: 'Delete', onClick: () => handleDelete(doc._id) }
                ]} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedDocuments.map((doc) => (
            <div key={doc._id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{getFileIcon(doc.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{formatDate(doc.updatedAt)}</span>
                      <span>by {doc.updatedBy?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleView(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => handleRename(doc)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                  <ThreeDotMenu items={[
                    { label: 'View', onClick: () => handleView(doc) },
                    { label: 'Download', onClick: () => handleDownload(doc) },
                    { label: 'Rename', onClick: () => handleRename(doc) },
                    { label: 'Delete', onClick: () => handleDelete(doc._id) }
                  ]} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedDocuments.length === 0 && folders.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No documents yet</h3>
          <p className="text-gray-500 mt-1">Upload your first document to get started</p>
        </div>
      )}

      {/* Rename Modal */}
      {renameModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Rename Document</h3>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Name</label>
                <input
                  type="text"
                  value={renameModal.newName}
                  onChange={(e) => setRenameModal({ ...renameModal, newName: e.target.value })}
                  className="input"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setRenameModal({ isOpen: false, docId: null, newName: '' })}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRename}
                className="btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

