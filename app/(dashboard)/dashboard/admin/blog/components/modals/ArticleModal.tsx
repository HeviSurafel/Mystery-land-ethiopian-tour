'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  Save,
  Tag,
  Folder,
  User,
  Upload,
  Trash2,
  Link as LinkIcon,
  ChevronDown,
  Search,
  Plus,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

import Swal from 'sweetalert2';
import { BlogCategory } from '@/Types';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  categories: BlogCategory[];
  loading: boolean;
  isEditing: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  categories,
  loading,
  isEditing,
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const categorySearchRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected category name
  const selectedCategory = categories.find(c => c.id === formData.category);
  const selectedCategoryName = selectedCategory?.name || '';

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    cat.description?.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click outside for category dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Only JPEG, PNG, and WebP images are allowed',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Maximum file size is 5MB',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    try {
      setUploading(true);
      setImageError(false);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      // Update the cover image field with the uploaded URL
      onInputChange({
        target: {
          name: 'coverImage',
          value: data.url
        }
      } as any);

      // Also add to images array
      onInputChange({
        target: {
          name: 'images',
          value: [data.url]
        }
      } as any);

      Swal.fire({
        title: 'Success',
        text: 'Image uploaded successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error: any) {
      setImageError(true);
      Swal.fire({
        title: 'Upload Failed',
        text: error.message || 'Failed to upload image',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onInputChange(e);
    setImageError(false);
    
    // Also update images array
    if (url) {
      onInputChange({
        target: {
          name: 'images',
          value: [url]
        }
      } as any);
    } else {
      onInputChange({
        target: {
          name: 'images',
          value: []
        }
      } as any);
    }
  };

  const handleRemoveImage = () => {
    onInputChange({
      target: {
        name: 'coverImage',
        value: ''
      }
    } as any);
    onInputChange({
      target: {
        name: 'images',
        value: []
      }
    } as any);
    setImageError(false);
  };

  const handleCategorySelect = (categoryId: string) => {
    onInputChange({
      target: {
        name: 'category',
        value: categoryId
      }
    } as any);
    setCategorySearch('');
    setIsCategoryDropdownOpen(false);
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a category name',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    try {
      setCreatingCategory(true);
      
      const response = await fetch('http://localhost:3000/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          description: `${newCategoryName} category`,
          slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create category');
      }

      setShowNewCategoryInput(false);
      setNewCategoryName('');
      
      Swal.fire({
        title: 'Success',
        text: 'Category created successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      // You might want to refresh categories here
      // window.location.reload(); // Quick fix, but not ideal

    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate image is present
    const hasImage = formData.coverImage || (formData.images && formData.images.length > 0);
    
    if (!hasImage) {
      Swal.fire({
        title: 'Image Required',
        text: 'Please add a cover image for the article',
        icon: 'warning',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    await onSubmit();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm"
          onClick={handleBackdropClick}
        />

        {/* Modal container */}
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ''}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Enter article title"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /blog/
                    </span>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={onInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      placeholder="article-url-slug"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt || ''}
                    onChange={onInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Brief description of the article"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={onInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono"
                    placeholder="Article content (HTML/Markdown supported)"
                  />
                </div>

                {/* Cover Image - Required */}
                <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    <h3 className="font-medium text-amber-800">Cover Image <span className="text-red-500">*</span></h3>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Image Source
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setImageSource('url')}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center space-x-1 ${
                          imageSource === 'url'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span>URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSource('upload')}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors flex items-center space-x-1 ${
                          imageSource === 'upload'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {imageSource === 'url' ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          name="coverImage"
                          value={formData.coverImage || ''}
                          onChange={handleImageUrlChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, WebP up to 5MB
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Image Preview */}
                  {formData.coverImage && (
                    <div className="mt-3 relative">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={formData.coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Required Indicator */}
                  {!formData.coverImage && !uploading && (
                    <div className="mt-2 flex items-center gap-2 text-amber-600 bg-amber-100 p-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">A cover image is required</span>
                    </div>
                  )}

                  {imageError && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-100 p-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Failed to load image. Please check the URL or try uploading.</span>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Searchable Category Dropdown */}
                  <div className="relative" ref={categoryDropdownRef}>
                    <div
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between"
                    >
                      <span className={selectedCategoryName ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedCategoryName || 'Select a category'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isCategoryDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              ref={categorySearchRef}
                              type="text"
                              value={categorySearch}
                              onChange={(e) => setCategorySearch(e.target.value)}
                              placeholder="Search categories..."
                              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* Categories list */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                              <div
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`px-3 py-2 cursor-pointer hover:bg-amber-50 transition-colors ${
                                  formData.category === cat.id ? 'bg-amber-100 text-amber-700' : ''
                                }`}
                              >
                                <div className="font-medium text-sm">{cat.name}</div>
                                {cat.description && (
                                  <div className="text-xs text-gray-500 truncate">{cat.description}</div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-center text-sm text-gray-500">
                              {categorySearch ? (
                                <div>
                                  <p>No categories found</p>
                                  <button
                                    onClick={() => {
                                      setShowNewCategoryInput(true);
                                      setNewCategoryName(categorySearch);
                                    }}
                                    className="mt-2 text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Create "{categorySearch}"
                                  </button>
                                </div>
                              ) : (
                                <p>No categories available</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quick create option */}
                        {showNewCategoryInput && (
                          <div className="p-2 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category name"
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                autoFocus
                              />
                              <button
                                onClick={handleCreateNewCategory}
                                disabled={creatingCategory}
                                className="px-3 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                              >
                                {creatingCategory ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Create'
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setShowNewCategoryInput(false);
                                  setNewCategoryName('');
                                }}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick create button when no categories exist */}
                  {categories.length === 0 && !isCategoryDropdownOpen && (
                    <div className="mt-2">
                      <button
                        onClick={() => {
                          setShowNewCategoryInput(true);
                          setIsCategoryDropdownOpen(true);
                        }}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Create first category
                      </button>
                    </div>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author || ''}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="Author name"
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime || ''}
                    onChange={onInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                    placeholder="5 min read"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-calculated from content if left empty
                  </p>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900">Featured Article</h4>
                    <p className="text-sm text-gray-500">Display this article in featured sections</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured || false}
                      onChange={onInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploading ? 'Uploading...' : 'Saving...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Update Article' : 'Create Article'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};