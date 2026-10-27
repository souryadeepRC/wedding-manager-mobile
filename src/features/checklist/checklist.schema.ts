import { z } from 'zod';
import { CHECKLIST_STATUS, TITLE_MAX } from './checklist.constants';

const statuses = CHECKLIST_STATUS.map(s => s.value) as [
  (typeof CHECKLIST_STATUS)[number]['value'],
  ...(typeof CHECKLIST_STATUS)[number]['value'][],
];

export const checklistFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a task').max(TITLE_MAX, `Up to ${TITLE_MAX} characters`),
  dueDate: z.date().nullable(),
  status: z.enum(statuses),
});

export type ChecklistForm = z.infer<typeof checklistFormSchema>;
export type ChecklistItem = ChecklistForm & { id: string };
export type ChecklistStatus = ChecklistForm['status'];

export const defaultChecklistForm: ChecklistForm = { title: '', dueDate: null, status: 'pending' };

export const toChecklistFormValues = ({ id: _id, ...form }: ChecklistItem): ChecklistForm => form;
