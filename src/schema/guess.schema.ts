import { z } from 'zod'

export const GuessSurahSchema = z.object({
  select: z
    .array(
      z.coerce
        .number({
          invalid_type_error: 'Must be number',
        })
        .min(1, 'Must be between 1 and 114')
        .max(114, 'Must be between 1 and 114'),
    )
    .min(4, 'Select at least four surah')
    .default([1, 2, 3, 4]),
  amount: z.coerce.number().min(1).default(1),
})
