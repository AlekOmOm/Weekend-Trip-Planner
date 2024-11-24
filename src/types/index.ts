export interface Person {
  id: string;
  initials: string;
  name: string;
  color: string;
  interests: string[];
}

export interface Note {
  id: string;
  text: string;
  createdAt: Date;
}

export interface Card {
  id: string;
  title: string;
  time?: string;
  notes: Note[];
  dayId?: string;
}

export interface Day {
  id: string;
  title: string;
  cards: Card[];
}