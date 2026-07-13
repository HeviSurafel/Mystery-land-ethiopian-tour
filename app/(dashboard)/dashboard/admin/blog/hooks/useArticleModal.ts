import { useState } from 'react';
import { BlogArticle } from '@/app/types/types';
import Swal from 'sweetalert2';

interface ArticleFormData {
  // Required by model
  name: string;
  description: string;
  slug: string;
  category: string;
  
  // Optional fields
  title: string;
  excerpt: string;
  author: string;
  coverImage: string;
  images: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string;
  readTime: string;
}

const initialFormData: ArticleFormData = {
  // Required fields
  name: '',
  description: '',
  slug: '',
  category: '',
  
  // Optional fields
  title: '',
  excerpt: '',
  author: '',
  coverImage: '',
  images: [],
  featured: false,
  status: 'draft',
  readTime: '',
};

export const useArticleModal = (onSuccess: () => void) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData(initialFormData);
    setIsOpen(true);
  };

  const openEditModal = (article: BlogArticle) => {
    setEditingArticle(article);
    setFormData({
      // Required fields
      name: article.name || '',
      description: article.description || '',
      slug: article.slug || '',
      category: typeof article.category === 'string' ? article.category : article.category?.id || '',
      
      // Optional fields
      title: article.title || article.name || '',
      excerpt: article.excerpt || '',
      author: article.author || '',
      coverImage: article.coverImage || '',
      images: article.images || [],
      featured: article.featured || false,
      status: article.status || 'draft',
      publishedAt: article.publishedAt,
      readTime: article.readTime || '',
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingArticle(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => {
        const updates: any = {
          ...prev,
          [name]: value
        };

        // Auto-generate slug from title and update name
        if (name === 'title') {
          const slug = value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          
          updates.slug = slug;
          updates.name = value; // CRITICAL: Set name from title
        }

        return updates;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Please fill in all required fields (Title, Content, and Category)',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
        return;
      }

      // Prepare data for API - ensure name is set from title
      const submitData = {
        ...formData,
        name: formData.title, // CRITICAL: Set name from title for the API
        title: formData.title, // Keep title for UI consistency
      };

      // Calculate read time if not provided
      if (!submitData.readTime && submitData.description) {
        const wordsPerMinute = 200;
        const wordCount = submitData.description.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        submitData.readTime = `${readTime} min read`;
      }

      // Generate excerpt if not provided
      if (!submitData.excerpt && submitData.description) {
        submitData.excerpt = submitData.description.substring(0, 160) + '...';
      }

      console.log('Submitting data:', submitData); // Debug log

      const url = editingArticle 
        ? `/api/admin/blog/${editingArticle.id}`
        : '/api/admin/blog';
      
      const method = editingArticle ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error); // Debug log
        throw new Error(error.error || 'Failed to save article');
      }

      await onSuccess();
      closeModal();

      Swal.fire({
        title: 'Success',
        text: `Article ${editingArticle ? 'updated' : 'created'} successfully`,
        icon: 'success',
        timer: 2000,
        confirmButtonColor: '#B88A3D'
      });

    } catch (error: any) {
      console.error('Submit error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isOpen,
    loading,
    editingArticle,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    handleInputChange,
    handleSubmit
  };
};