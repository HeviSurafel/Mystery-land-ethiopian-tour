// app/dashboard/admin/inquiries/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Reply,
  Archive,
  Eye,
  Loader2,
  X,
  Send,
  Paperclip,
  Tag,
  Flag,
  Globe,
  MapPin,
  Briefcase,
  ChevronDown,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  Check
} from "lucide-react";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  tourInterest?: string;
  travelDate?: string;
  groupSize?: number;
  budget?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'in-progress' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  internalNotes?: Array<{
    note: string;
    createdBy: string;
    createdAt: string;
  }>;
  communicationHistory?: Array<{
    type: 'email' | 'note' | 'phone';
    content: string;
    timestamp: string;
    by: string;
  }>;
}

interface Stats {
  total: number;
  new: number;
  replied: number;
  resolved: number;
  urgent: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    new: 0,
    replied: 0,
    resolved: 0,
    urgent: 0
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedInquiries, setSelectedInquiries] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reply' | 'notes' | 'history'>('details');
  
  // Reply states
  const [replyMessage, setReplyMessage] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState("");
  
  // Note states
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/inquiries?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, priorityFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInquiries();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = async (id: string, priority: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      });
      
      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, priority: priority as any });
        }
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replySubject.trim() || !selectedInquiry) return;
    
    setSendingReply(true);
    setReplyError("");
    
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'replied',
          replyMessage,
          replySubject,
          repliedBy: 'Admin',
          communication: {
            type: 'email',
            content: replyMessage,
            timestamp: new Date().toISOString(),
            by: 'Admin'
          }
        }),
      });
      
      if (response.ok) {
        setReplySuccess(true);
        setReplyMessage("");
        setReplySubject("");
        fetchInquiries();
        
        // Update selected inquiry
        setSelectedInquiry(prev => prev ? { 
          ...prev, 
          status: 'replied',
          communicationHistory: [
            ...(prev.communicationHistory || []),
            {
              type: 'email',
              content: replyMessage,
              timestamp: new Date().toISOString(),
              by: 'Admin'
            }
          ]
        } : null);
        
        setTimeout(() => setReplySuccess(false), 3000);
      } else {
        setReplyError("Failed to send reply");
      }
    } catch (error) {
      setReplyError("An error occurred");
    } finally {
      setSendingReply(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedInquiry) return;
    
    setAddingNote(true);
    
    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: {
            note: newNote,
            createdBy: 'Admin',
            createdAt: new Date().toISOString()
          }
        }),
      });
      
      if (response.ok) {
        setSelectedInquiry(prev => prev ? {
          ...prev,
          internalNotes: [
            ...(prev.internalNotes || []),
            {
              note: newNote,
              createdBy: 'Admin',
              createdAt: new Date().toISOString()
            }
          ]
        } : null);
        setNewNote("");
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchInquiries();
        if (selectedInquiry?._id === id) {
          setIsModalOpen(false);
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'read': 'bg-gray-100 text-gray-800 border-gray-200',
      'replied': 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'archived': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-600',
      'medium': 'bg-blue-100 text-blue-600',
      'high': 'bg-orange-100 text-orange-600',
      'urgent': 'bg-red-100 text-red-600 animate-pulse'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'general': MessageSquare,
      'booking': Calendar,
      'custom-tour': Star,
      'group': User,
      'corporate': Briefcase,
      'urgent': AlertCircle
    };
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const openInquiryModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
    setActiveTab('details');
    setReplySubject(`Re: ${inquiry.inquiryType} inquiry from ${inquiry.name}`);
    setReplyMessage("");
    setReplySuccess(false);
    setReplyError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
              <p className="text-sm text-gray-500">Manage and respond to customer inquiries</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
            <p className="text-sm text-blue-600">New</p>
            <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-600">Replied</p>
            <p className="text-2xl font-bold text-green-700">{stats.replied}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 shadow-sm border border-emerald-100">
            <p className="text-sm text-emerald-600">Resolved</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.resolved}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm border border-red-100">
            <p className="text-sm text-red-600">Urgent</p>
            <p className="text-2xl font-bold text-red-700">{stats.urgent}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </form>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${
                    viewMode === 'list' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${
                    viewMode === 'grid' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedInquiries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedInquiries.length} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Mark as Replied
                </button>
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Mark as Read
                </button>
                <button className="px-3 py-1 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                  Archive
                </button>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inquiries List/Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-500">Try adjusting your filters or search</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInquiries(inquiries.map(i => i._id));
                        } else {
                          setSelectedInquiries([]);
                        }
                      }}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inquiries.map((inquiry) => {
                  const TypeIcon = getTypeIcon(inquiry.inquiryType);
                  return (
                    <tr 
                      key={inquiry._id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => openInquiryModal(inquiry)}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedInquiries([...selectedInquiries, inquiry._id]);
                            } else {
                              setSelectedInquiries(selectedInquiries.filter(id => id !== inquiry._id));
                            }
                          }}
                          className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                            <div className="text-sm text-gray-500">{inquiry.email}</div>
                            {inquiry.phone && (
                              <div className="text-xs text-gray-400">{inquiry.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <TypeIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 capitalize">
                            {inquiry.inquiryType.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(inquiry.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inquiry.priority}
                          onChange={(e) => handlePriorityChange(inquiry._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(inquiry.priority)}`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(inquiry.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openInquiryModal(inquiry)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              openInquiryModal(inquiry);
                              setActiveTab('reply');
                            }}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(inquiry._id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inquiries.map((inquiry) => {
              const TypeIcon = getTypeIcon(inquiry.inquiryType);
              return (
                <motion.div
                  key={inquiry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 cursor-pointer"
                  onClick={() => openInquiryModal(inquiry)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{inquiry.name}</h3>
                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedInquiries.includes(inquiry._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedInquiries([...selectedInquiries, inquiry._id]);
                        } else {
                          setSelectedInquiries(selectedInquiries.filter(id => id !== inquiry._id));
                        }
                      }}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <TypeIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600 capitalize">{inquiry.inquiryType.replace('-', ' ')}</span>
                    </div>
                    {inquiry.tourInterest && (
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{inquiry.tourInterest}</span>
                      </div>
                    )}
                    {inquiry.travelDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{inquiry.travelDate}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(inquiry.priority)}`}>
                        {inquiry.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          openInquiryModal(inquiry);
                          setActiveTab('reply');
                        }}
                        className="p-1 text-blue-400 hover:text-blue-600 rounded"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
           

              {/* Modal panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Inquiry Details</h3>
                      <p className="text-sm text-white/80">ID: {selectedInquiry._id.slice(-8)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 px-6">
                  <nav className="flex space-x-6">
                    {[
                      { id: 'details', label: 'Details', icon: Eye },
                      { id: 'reply', label: 'Reply', icon: Reply },
                      { id: 'notes', label: 'Notes', icon: MessageSquare },
                      { id: 'history', label: 'History', icon: Clock },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-amber-500 text-amber-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2 text-amber-500" />
                          Customer Information
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium">{selectedInquiry.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-amber-600 hover:underline">
                              {selectedInquiry.email}
                            </a>
                          </div>
                          {selectedInquiry.phone && (
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <a href={`tel:${selectedInquiry.phone}`} className="font-medium text-amber-600 hover:underline">
                                {selectedInquiry.phone}
                              </a>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500">Source</p>
                            <p className="font-medium capitalize">{selectedInquiry.source}</p>
                          </div>
                        </div>
                      </div>

                      {/* Inquiry Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-amber-500" />
                          Inquiry Details
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Type</p>
                            <p className="font-medium capitalize">{selectedInquiry.inquiryType.replace('-', ' ')}</p>
                          </div>
                          {selectedInquiry.tourInterest && (
                            <div>
                              <p className="text-xs text-gray-500">Tour Interest</p>
                              <p className="font-medium">{selectedInquiry.tourInterest}</p>
                            </div>
                          )}
                          {selectedInquiry.travelDate && (
                            <div>
                              <p className="text-xs text-gray-500">Travel Date</p>
                              <p className="font-medium">{selectedInquiry.travelDate}</p>
                            </div>
                          )}
                          {selectedInquiry.groupSize && (
                            <div>
                              <p className="text-xs text-gray-500">Group Size</p>
                              <p className="font-medium">{selectedInquiry.groupSize} people</p>
                            </div>
                          )}
                          {selectedInquiry.budget && (
                            <div>
                              <p className="text-xs text-gray-500">Budget</p>
                              <p className="font-medium">{selectedInquiry.budget}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-amber-500" />
                          Message
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>

                      {/* Status & Priority */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Flag className="w-4 h-4 mr-2 text-amber-500" />
                          Status & Priority
                        </h4>
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <select
                              value={selectedInquiry.status}
                              onChange={(e) => handleStatusChange(selectedInquiry._id, e.target.value)}
                              className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedInquiry.status)}`}
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Priority</p>
                            <select
                              value={selectedInquiry.priority}
                              onChange={(e) => handlePriorityChange(selectedInquiry._id, e.target.value)}
                              className={`text-sm px-3 py-1 rounded-full ${getPriorityBadge(selectedInquiry.priority)}`}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reply Tab */}
                  {activeTab === 'reply' && (
                    <div className="space-y-4">
                      {replySuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <p className="text-sm text-green-700">Reply sent successfully!</p>
                        </div>
                      )}
                      
                      {replyError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <p className="text-sm text-red-700">{replyError}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={replySubject}
                          onChange={(e) => setReplySubject(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Email subject..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Type your reply here..."
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-700">
                          <strong>Tip:</strong> Your reply will be sent to {selectedInquiry.email}. 
                          Include relevant tour information and next steps.
                        </p>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setActiveTab('details')}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendReply}
                          disabled={sendingReply || !replyMessage.trim() || !replySubject.trim()}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {sendingReply ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Send Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      {/* Add Note */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Add Internal Note</h4>
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Add a private note for your team..."
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={handleAddNote}
                            disabled={addingNote || !newNote.trim()}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center space-x-2"
                          >
                            {addingNote ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Add Note</span>
                          </button>
                        </div>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Previous Notes</h4>
                        {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                          selectedInquiry.internalNotes.map((note, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-700">{note.createdBy}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{note.note}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* History Tab */}
                  {activeTab === 'history' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Communication History</h4>
                      {selectedInquiry.communicationHistory && selectedInquiry.communicationHistory.length > 0 ? (
                        <div className="space-y-3">
                          {selectedInquiry.communicationHistory.map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {item.type === 'email' ? (
                                    <Mail className="w-4 h-4 text-blue-500" />
                                  ) : item.type === 'phone' ? (
                                    <Phone className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <MessageSquare className="w-4 h-4 text-amber-500" />
                                  )}
                                  <span className="text-xs font-medium text-gray-700 capitalize">{item.type}</span>
                                  <span className="text-xs text-gray-500">by {item.by}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(item.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No communication history</p>
                      )}

                      {/* Timeline */}
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Created</span>
                            <span className="text-gray-900">{new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="text-gray-900">{new Date(selectedInquiry.updatedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(selectedInquiry._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}