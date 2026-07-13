"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Eye,
  Edit,
  Trash2,
  MapPin
} from "lucide-react";
import { Destination } from "@/types/types";

interface DestinationsTableProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onEdit: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
}

export const DestinationsTable = ({
  destinations,
  selectedDestinations,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete
}: DestinationsTableProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSelectAll = () => {
    if (selectedDestinations.length === destinations.length) {
      onSelectAll([]);
    } else {
      onSelectAll(destinations.map(d => d.id!));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedDestinations.length === destinations.length && destinations.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                />
              </th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tours</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {destinations.map((dest) => (
              <tr key={dest.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(dest.id!)}
                    onChange={() => onSelect(dest.id!)}
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                      <Image
                        src={dest.images[0] || "/Images/placeholder.jpg"}
                        alt={dest.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{dest.name}</p>
                   
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{dest.type}</td>
                <td className="px-6 py-4">{dest.region}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full border `}>
                    {dest.status}
                  </span>
                </td>
                <td className="px-6 py-4">{dest.tourCount || 0}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                    {dest.rating?.toFixed(1) || '0.0'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Link href={`/destinations/${dest.slug}`} target="_blank">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => onEdit(dest)}
                      className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(dest)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};