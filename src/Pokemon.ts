export type Pokemon = {
    id: number;
    name: string;
    types: { type: { name: string } }[];
  };