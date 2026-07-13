import { ApiExperience } from "./types";
import { ExperienceCard } from "./ExperienceCard";

interface ExperiencesGridProps {
  experiences: ApiExperience[];
  selectedExperiences: string[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (experience: ApiExperience) => void;
  onEdit?: (experience: ApiExperience) => void;
  loading?: boolean;
}

export const ExperiencesGrid = ({
  experiences,
  selectedExperiences,
  onSelect,
  onDelete,
  onDuplicate,
  onEdit,
  loading,
}: ExperiencesGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-lg font-medium text-gray-900">
          No experiences found
        </h3>
        <p className="text-gray-500 mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences.map((experience) => (
        <ExperienceCard
          key={experience._id || experience.id}
          experience={experience}
          isSelected={selectedExperiences.includes(experience._id || experience.id || '')}
          onSelect={onSelect}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};