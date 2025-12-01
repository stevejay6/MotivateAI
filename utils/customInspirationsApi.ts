export type CustomInspiration = {
  id: string;
  think: string;
  author?: string;
  feel?: string;
  do: string;
};

type CreateInspirationInput = Omit<CustomInspiration, "id">;
type UpdateInspirationInput = Partial<CreateInspirationInput>;

const delay = (ms: number = 450) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let inspirationsStore: CustomInspiration[] = [
  {
    id: "inspiration-1",
    think: "Small sparks become bonfires through daily tending.",
    author: "Studio mantra",
    feel: "Grounded, steady, quietly energized.",
    do: "Spend 10 focused minutes moving one project forward.",
  },
  {
    id: "inspiration-2",
    think: "Lead with generosity, follow with curiosity.",
    author: "Mentor’s advice",
    feel: "Open-hearted, expansive.",
    do: "Send one encouraging message to a teammate today.",
  },
];

export async function listInspirations(): Promise<CustomInspiration[]> {
  await delay();
  return [...inspirationsStore];
}

export async function createInspiration(
  data: CreateInspirationInput
): Promise<CustomInspiration> {
  await delay();
  const newInspiration: CustomInspiration = {
    id: crypto.randomUUID?.() ?? `custom-${Date.now()}`,
    ...data,
  };
  inspirationsStore = [newInspiration, ...inspirationsStore];
  return newInspiration;
}

export async function updateInspiration(
  id: string,
  data: UpdateInspirationInput
): Promise<CustomInspiration> {
  await delay();
  let updated: CustomInspiration | null = null;
  inspirationsStore = inspirationsStore.map((item) => {
    if (item.id === id) {
      updated = { ...item, ...data };
      return updated;
    }
    return item;
  });
  if (!updated) {
    throw new Error("Inspiration not found");
  }
  return updated;
}

export async function deleteInspiration(id: string): Promise<void> {
  await delay();
  inspirationsStore = inspirationsStore.filter((item) => item.id !== id);
}


