// admin/experiences/hooks/useExperienceForm.ts

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { ApiExperience, ExperienceFormData, INITIAL_FORM_DATA } from '../components/types';

export const useExperienceForm = (
  initialData?: ApiExperience | null,
  mode: 'create' | 'edit' = 'create'
) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<ExperienceFormData>(() => {
    if (initialData && mode === 'edit') {
      return {
        name: initialData.name || '',
        slug: initialData.slug || '',
        shortDescription: initialData.shortDescription || initialData.description?.substring(0, 150) || '',
        description: initialData.description || '',
        category: initialData.category || 'tribal',
        duration: initialData.duration || '',
        location: initialData.location || '',
        groupSize: initialData.groupSize || '',
        languages: initialData.languages || [],
        highlights: initialData.highlights || [],
        included: initialData.included || [],
        notIncluded: initialData.notIncluded || [],
        whatToBring: initialData.whatToBring || [],
        bestTimeToVisit: initialData.bestTimeToVisit || initialData.seasonalAvailability || '',
        difficulty: initialData.difficulty || 'Easy',
        coordinates: {
          lat: initialData.coordinates?.lat?.toString() || '',
          lng: initialData.coordinates?.lng?.toString() || '',
          city: initialData.coordinates?.city || '',
          region: initialData.coordinates?.region || ''
        },
        images: initialData.images || [],
        featured: initialData.featured || false,
        meetingPoint: initialData.meetingPoint || '',
        ageRange: initialData.ageRange || '',
        culturalSignificance: initialData.culturalSignificance || '',
        seasonalAvailability: initialData.seasonalAvailability || '',
        startTimes: initialData.startTimes || [],
        rating: initialData.rating || 0,
        reviewCount: initialData.reviewCount || 0,
      };
    }
    return INITIAL_FORM_DATA;
  });

  const [listItems, setListItems] = useState({
    newHighlight: '',
    newInclusion: '',
    newExclusion: '',
    newItem: '',
    newLanguage: '',
    newStartTime: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoordinatesChange = (field: keyof typeof formData.coordinates, value: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { ...prev.coordinates, [field]: value }
    }));
  };

  const addListItem = (field: keyof typeof listItems, listField: keyof ExperienceFormData) => {
    const value = listItems[field];
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [listField]: [...(prev[listField] as string[]), value.trim()]
      }));
      setListItems(prev => ({ ...prev, [field]: '' }));
    }
  };

  const removeListItem = (listField: keyof ExperienceFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [listField]: (prev[listField] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file); // Make sure the key matches what the API expects
        
        const response = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }
        
        const data = await response.json();
        return data.url; // The API returns { success: true, url: string, filename: string }
      });

      const newImageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImageUrls.filter(Boolean)]
      }));
      
      // Optional: Show success message
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: `${newImageUrls.length} image(s) uploaded successfully`,
        timer: 1500,
        showConfirmButton: false
      });
      
    } catch (error: any) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.message || 'Failed to upload images'
      });
    } finally {
      setUploadingImage(false);
      // Clear the input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (data: ExperienceFormData, id?: string) => {
    setLoading(true);

    try {
      const url = id 
        ? `/api/admin/experiences/${id}`
        : '/api/admin/experiences';
      
      const method = id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to ${id ? 'update' : 'create'} experience`);
      }
      
      await Swal.fire({
        title: "Success!",
        text: `Experience ${id ? 'updated' : 'created'} successfully`,
        icon: "success",
        confirmButtonColor: "#B88A3D",
        timer: 2000
      });

      router.push("/admin/experiences");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || `Failed to ${id ? 'update' : 'create'} experience`,
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    uploadingImage,
    listItems,
    setListItems,
    handleChange,
    handleCoordinatesChange,
    addListItem,
    removeListItem,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
  };
};