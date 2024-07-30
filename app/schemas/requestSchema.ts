import { z } from 'zod';

export const requestSchema = z.object({
  date: z.object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  }),
  reason: z.string(),
});

export type RequestSchemaType = z.infer<typeof requestSchema>;
