import { z } from 'zod';

export const weddingFormSchema = z
  .object({
    brideName: z.string().trim().max(60, 'Up to 60 characters'),
    groomName: z.string().trim().max(60, 'Up to 60 characters'),
    weddingDate: z.date().nullable(),
    receptionDate: z.date().nullable(),
  })
  .refine(d => !d.weddingDate || !d.receptionDate || d.receptionDate >= d.weddingDate, {
    path: ['receptionDate'],
    message: 'Reception cannot be before the wedding date',
  });

export type WeddingForm = z.infer<typeof weddingFormSchema>;

export type Wedding = {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: Date | null;
  receptionDate: Date | null;
};

export const toFormValues = (w: Wedding): WeddingForm => ({
  brideName: w.brideName,
  groomName: w.groomName,
  weddingDate: w.weddingDate,
  receptionDate: w.receptionDate,
});
