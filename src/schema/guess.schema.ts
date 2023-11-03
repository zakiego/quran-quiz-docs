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

export const GuessVerseSchema = z
  .object({
    by: z.enum(['juz', 'surah']).default('surah'),
    select: z
      .array(
        z.coerce.number({
          invalid_type_error: 'Must be number',
        }),
      )
      .min(4, 'Select at least four surah or juz')
      .default([1, 2, 3, 4]),
    amount: z.coerce.number().min(1).default(1),
  })
  .refine(
    (schema) =>
      schema.by === 'surah'
        ? schema.select.every((value) => value >= 1 && value <= 114)
        : true,
    { path: ['select'], message: 'Must be between 1 and 114' },
  )
  .refine(
    (schema) =>
      schema.by === 'juz'
        ? schema.select.every((value) => value >= 1 && value <= 30)
        : true,
    {
      path: ['select'],
      message: 'Must be between 1 and 30',
    },
  )
