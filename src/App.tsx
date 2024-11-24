import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PersonBubble } from './components/PersonBubble';
import { TripCard } from './components/TripCard';
import type { Person, Note, Card, Day } from './types';

// Feng Shui inspired colors
const COLORS = [
  '#8B4513', // Saddle Brown
  '#1B4B6B', // Navy
  '#2F4F4F', // Dark Slate Gray
  '#CD5C5C', // Indian Red
  '#DAA520', // Golden Rod
  '#556B2F', // Olive
  '#4A708B', // Steel Blue
  '#8B7355', // Burly Wood
  '#CD853F', // Peru
  '#698B69'  // Dark Sea Green
];

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [floatingCards, setFloatingCards] = useState<Card[]>([]);
  const [days] = useState<Day[]>([
    { id: 'friday', title: 'Friday', cards: [] },
    { id: 'saturday', title: 'Saturday', cards: [] },
    { id: 'sunday', title: 'Sunday', cards: [] },
  ]);

  const addPerson = () => {
    const name = prompt('Enter person name:');
    if (!name) return;

    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();

    const interests = [];
    let interest;
    do {
      interest = prompt('Add an interest (or leave empty to finish):');
      if (interest) interests.push(interest);
    } while (interest);

    setPeople(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        initials,
        interests,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
  };

  const addCard = (dayId?: string) => {
    const title = prompt('Enter card title:');
    if (!title) return;

    const time = prompt('Enter time (optional, format: HH-HH):');
    const newCard: Card = {
      id: crypto.randomUUID(),
      title,
      time,
      notes: [],
      dayId,
    };

    if (dayId) {
      const dayIndex = days.findIndex(day => day.id === dayId);
      days[dayIndex].cards = [...days[dayIndex].cards, newCard];
    } else {
      setFloatingCards(prev => [...prev, newCard]);
    }
  };

  const removeCard = (cardId: string, dayId?: string) => {
    if (dayId) {
      const dayIndex = days.findIndex(day => day.id === dayId);
      days[dayIndex].cards = days[dayIndex].cards.filter(card => card.id !== cardId);
    } else {
      setFloatingCards(prev => prev.filter(card => card.id !== cardId));
    }
  };

  const addNote = (cardId: string, dayId?: string) => {
    const text = prompt('Enter note:');
    if (!text) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date(),
    };

    if (dayId) {
      const dayIndex = days.findIndex(day => day.id === dayId);
      const cardIndex = days[dayIndex].cards.findIndex(card => card.id === cardId);
      days[dayIndex].cards[cardIndex].notes.push(newNote);
    } else {
      setFloatingCards(prev =>
        prev.map(card =>
          card.id === cardId
            ? { ...card, notes: [...card.notes, newNote] }
            : card
        )
      );
    }
  };

  const editNote = (cardId: string, noteId: string, text: string, dayId?: string) => {
    if (dayId) {
      const dayIndex = days.findIndex(day => day.id === dayId);
      const cardIndex = days[dayIndex].cards.findIndex(card => card.id === cardId);
      const noteIndex = days[dayIndex].cards[cardIndex].notes.findIndex(
        note => note.id === noteId
      );
      days[dayIndex].cards[cardIndex].notes[noteIndex].text = text;
    } else {
      setFloatingCards(prev =>
        prev.map(card =>
          card.id === cardId
            ? {
                ...card,
                notes: card.notes.map(note =>
                  note.id === noteId ? { ...note, text } : note
                ),
              }
            : card
        )
      );
    }
  };

  const deleteNote = (cardId: string, noteId: string, dayId?: string) => {
    if (dayId) {
      const dayIndex = days.findIndex(day => day.id === dayId);
      const cardIndex = days[dayIndex].cards.findIndex(card => card.id === cardId);
      days[dayIndex].cards[cardIndex].notes = days[dayIndex].cards[
        cardIndex
      ].notes.filter(note => note.id !== noteId);
    } else {
      setFloatingCards(prev =>
        prev.map(card =>
          card.id === cardId
            ? { ...card, notes: card.notes.filter(note => note.id !== noteId) }
            : card
        )
      );
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const itemId = result.draggableId;

    if (sourceId === destId) return;

    let card;
    if (sourceId === 'floating') {
      card = floatingCards.find(c => c.id === itemId);
      setFloatingCards(prev => prev.filter(c => c.id !== itemId));
    } else {
      const sourceDay = days.find(d => d.id === sourceId);
      card = sourceDay?.cards.find(c => c.id === itemId);
      if (sourceDay) {
        sourceDay.cards = sourceDay.cards.filter(c => c.id !== itemId);
      }
    }

    if (card) {
      if (destId === 'floating') {
        setFloatingCards(prev => [...prev, { ...card!, dayId: undefined }]);
      } else {
        const destDay = days.find(d => d.id === destId);
        if (destDay) {
          destDay.cards = [...destDay.cards, { ...card, dayId: destId }];
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5DC] via-[#E8DFD1] to-[#F0EAD6] p-8">
      <div className="flex gap-8">
        {/* Left sidebar with people */}
        <div className="w-80 bg-[#FFFAF0]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A4A4A]">
              Participants
            </h2>
            <button
              onClick={addPerson}
              className="p-2 bg-[#8B4513] text-[#FFFAF0] rounded-full hover:bg-[#6B3410] transition-all"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {people.map(person => (
              <PersonBubble
                key={person.id}
                person={person}
                onRemove={removePerson}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Floating cards */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#4A4A4A]">
                  General Notes
                </h2>
                <button
                  onClick={() => addCard()}
                  className="px-4 py-2 bg-[#1B4B6B] text-[#FFFAF0] rounded-lg hover:bg-[#123448] transition-all"
                >
                  Add Card
                </button>
              </div>
              <Droppable droppableId="floating">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-3 gap-4"
                  >
                    {floatingCards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <TripCard
                            card={card}
                            provided={provided}
                            onRemove={removeCard}
                            onAddNote={addNote}
                            onEditNote={editNote}
                            onDeleteNote={deleteNote}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Days */}
            <div className="grid grid-cols-3 gap-8">
              {days.map(day => (
                <div key={day.id} className="bg-[#FFFAF0]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#4A4A4A]">
                      {day.title}
                    </h2>
                    <button
                      onClick={() => addCard(day.id)}
                      className="px-4 py-2 bg-[#1B4B6B] text-[#FFFAF0] rounded-lg hover:bg-[#123448] transition-all"
                    >
                      Add Card
                    </button>
                  </div>
                  <Droppable droppableId={day.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-4"
                      >
                        {day.cards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
                            {(provided) => (
                              <TripCard
                                card={card}
                                provided={provided}
                                isDayCard
                                onRemove={(id) => removeCard(id, day.id)}
                                onAddNote={(id) => addNote(id, day.id)}
                                onEditNote={(cardId, noteId, text) => 
                                  editNote(cardId, noteId, text, day.id)
                                }
                                onDeleteNote={(cardId, noteId) => 
                                  deleteNote(cardId, noteId, day.id)
                                }
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;