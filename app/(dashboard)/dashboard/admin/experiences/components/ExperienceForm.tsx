import { useState } from "react";
import {
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { ApiExperience, CATEGORIES, DIFFICULTIES, ExperienceFormData } from "./types";
import { useExperienceForm } from "../hooks/useExperienceForm";

interface ExperienceFormProps {
  initialData?: ApiExperience | null;
  mode: 'create' | 'edit';
  onSubmit: (data: ExperienceFormData, id?: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ExperienceForm = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  loading = false,
}: ExperienceFormProps) => {
  const {
    formData,
    uploadingImage,
    listItems,
    setListItems,
    handleChange,
    handleCoordinatesChange,
    addListItem,
    removeListItem,
    handleImageUpload,
    handleRemoveImage,
  } = useExperienceForm(initialData, mode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, initialData?._id || initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
            >
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Description *
          </label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="ml-2 text-sm text-gray-700">Featured</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 transition cursor-pointer flex flex-col items-center justify-center bg-gray-50">
            {uploadingImage ? (
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Upload</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>
      </div>

      {/* Location & Duration */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Location & Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g., Full Day, 3 Hours"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Size
            </label>
            <input
              type="text"
              name="groupSize"
              value={formData.groupSize}
              onChange={handleChange}
              placeholder="e.g., 2-8 people"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Best Time to Visit
            </label>
            <input
              type="text"
              name="bestTimeToVisit"
              value={formData.bestTimeToVisit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Point
            </label>
            <input
              type="text"
              name="meetingPoint"
              value={formData.meetingPoint || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <input
              type="text"
              name="ageRange"
              value={formData.ageRange || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Coordinates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Latitude"
              value={formData.coordinates.lat}
              onChange={(e) => handleCoordinatesChange('lat', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={formData.coordinates.lng}
              onChange={(e) => handleCoordinatesChange('lng', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.coordinates.city}
              onChange={(e) => handleCoordinatesChange('city', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Region"
              value={formData.coordinates.region}
              onChange={(e) => handleCoordinatesChange('region', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Start Times */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Start Times</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newStartTime}
            onChange={(e) => setListItems(prev => ({ ...prev, newStartTime: e.target.value }))}
            placeholder="Add a start time (e.g., 8:00 AM)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newStartTime', 'startTimes'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newStartTime', 'startTimes')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.startTimes?.map((time, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              <span>{time}</span>
              <button
                type="button"
                onClick={() => removeListItem('startTimes', index)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Languages</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newLanguage}
            onChange={(e) => setListItems(prev => ({ ...prev, newLanguage: e.target.value }))}
            placeholder="Add a language..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newLanguage', 'languages'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newLanguage', 'languages')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.languages.map((language, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
            >
              <span>{language}</span>
              <button
                type="button"
                onClick={() => removeListItem('languages', index)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Highlights</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newHighlight}
            onChange={(e) => setListItems(prev => ({ ...prev, newHighlight: e.target.value }))}
            placeholder="Add a highlight..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newHighlight', 'highlights'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newHighlight', 'highlights')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.highlights.map((highlight, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full"
            >
              <span>{highlight}</span>
              <button
                type="button"
                onClick={() => removeListItem('highlights', index)}
                className="ml-1 text-green-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Inclusions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">What's Included</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newInclusion}
            onChange={(e) => setListItems(prev => ({ ...prev, newInclusion: e.target.value }))}
            placeholder="Add an inclusion..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newInclusion', 'included'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newInclusion', 'included')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.included.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeListItem('included', index)}
                className="ml-1 text-blue-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Exclusions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">What's Not Included</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newExclusion}
            onChange={(e) => setListItems(prev => ({ ...prev, newExclusion: e.target.value }))}
            placeholder="Add an exclusion..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newExclusion', 'notIncluded'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newExclusion', 'notIncluded')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.notIncluded?.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-full"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeListItem('notIncluded', index)}
                className="ml-1 text-red-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* What to Bring */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">What to Bring</h3>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={listItems.newItem}
            onChange={(e) => setListItems(prev => ({ ...prev, newItem: e.target.value }))}
            placeholder="Add an item..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('newItem', 'whatToBring'))}
          />
          <button
            type="button"
            onClick={() => addListItem('newItem', 'whatToBring')}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.whatToBring?.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeListItem('whatToBring', index)}
                className="ml-1 text-purple-500 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Cultural Significance */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Cultural Information</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cultural Significance
          </label>
          <textarea
            name="culturalSignificance"
            value={formData.culturalSignificance || ''}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="Explain the cultural importance of this experience..."
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seasonal Availability
          </label>
          <input
            type="text"
            name="seasonalAvailability"
            value={formData.seasonalAvailability || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            placeholder="e.g., Available year-round, Best during dry season"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{mode === 'create' ? 'Create' : 'Save Changes'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};