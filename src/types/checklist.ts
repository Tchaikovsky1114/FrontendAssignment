export interface DefaultChecklist {
  weekNumber: number;
  content: string | number;
}

export interface NewChecklist extends DefaultChecklist {
  id: string;
  isCompleted: boolean;
}

export interface AllChecklists {
  [key: DefaultChecklist['weekNumber']]: NewChecklist[];
}
