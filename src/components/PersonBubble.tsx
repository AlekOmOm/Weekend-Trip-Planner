import { Person } from '../types';
import { MinusIcon } from '@heroicons/react/24/outline';

interface PersonBubbleProps {
  person: Person;
  onRemove: (id: string) => void;
}

export function PersonBubble({ person, onRemove }: PersonBubbleProps) {
  return (
    <div
      className="p-4 rounded-lg shadow-sm transition-transform hover:scale-105"
      style={{ backgroundColor: person.color + '15' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-lg" style={{ color: person.color }}>
          {person.name}
        </span>
        <button
          onClick={() => onRemove(person.id)}
          className="hover:text-red-500"
        >
          <MinusIcon className="w-4 h-4" />
        </button>
      </div>
      {person.interests.length > 0 && (
        <div className="space-y-1 mt-2 pl-2">
          {person.interests.map((interest, index) => (
            <div 
              key={index} 
              className="text-sm"
              style={{ color: person.color + 'CC' }}
            >
              • {interest}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}