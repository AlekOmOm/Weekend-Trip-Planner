import { Card, Note } from '../types';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface TripCardProps {
  card: Card;
  provided?: any;
  isDayCard?: boolean;
  onRemove: (id: string) => void;
  onAddNote: (cardId: string) => void;
  onEditNote: (cardId: string, noteId: string, text: string) => void;
  onDeleteNote: (cardId: string, noteId: string) => void;
}

export function TripCard({
  card,
  provided,
  isDayCard,
  onRemove,
  onAddNote,
  onEditNote,
  onDeleteNote
}: TripCardProps) {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
  };

  const saveEdit = (cardId: string, noteId: string) => {
    onEditNote(cardId, noteId, editText);
    setEditingNoteId(null);
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`${
        isDayCard ? 'bg-[#FAFAFA]' : 'bg-white'
      } p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-between items-start mb-3 pb-2 border-b border-[#E8DFD1]">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-[#4A4A4A]">{card.title}</h3>
          {card.time && (
            <p className="text-sm text-[#6B6B6B]">kl {card.time}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(card.id)}
          className="text-[#8B8B8B] hover:text-red-500"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {card.notes.map(note => (
          <div key={note.id} className="group flex items-start gap-2">
            {editingNoteId === note.id ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEdit(card.id, note.id);
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => saveEdit(card.id, note.id)}
                    className="text-xs text-[#2F4F4F] hover:text-[#1B4B6B]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="text-xs text-[#8B8B8B] hover:text-[#4A4A4A]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-[#8B8B8B]">-</span>
                <p className="flex-1 text-sm text-[#4A4A4A]">{note.text}</p>
                <div className="hidden group-hover:flex gap-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-[#8B8B8B] hover:text-[#1B4B6B]"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(card.id, note.id)}
                    className="text-[#8B8B8B] hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => onAddNote(card.id)}
        className="mt-3 text-sm text-[#1B4B6B] hover:text-[#123448]"
      >
        + Add Note
      </button>
    </div>
  );
}