import {AllChecklists, DefaultChecklist} from '../types/checklist';

export const fetchAllDefaultChecklists = () => {
  const defaultChecklist: DefaultChecklist[] = require('../../checklist_seeds.json');

  const allChecklists = defaultChecklist.reduce((acc, cur) => {
    const weekNumber = cur.weekNumber;
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push({
      ...cur,
      isCompleted: false,
      id: acc[weekNumber].length.toString(),
    });
    return acc;
  }, {} as AllChecklists);

  return allChecklists;
};
