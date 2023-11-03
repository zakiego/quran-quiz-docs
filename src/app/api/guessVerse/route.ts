import { type NextRequest } from 'next/server'
import { GuessVerseSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessVerse } from 'quran-quiz'
import { match } from 'ts-pattern'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const byQuery = searchParams.get('by') ?? 'surah'
    const amountQuery = searchParams.get('amount') ?? 1
    const selectQuery =
      searchParams.getAll('select').length >= 4
        ? searchParams.getAll('select')
        : [1, 2, 3, 4]

    const query = GuessVerseSchema.parse({
      by: byQuery,
      amount: amountQuery,
      select: uniq(selectQuery as string[]),
    })

    const data = await match(query)
      .with(
        { by: 'juz' },
        async () =>
          await guessVerse.byJuz({
            amount: query.amount,
            select: query.select,
          }),
      )
      .with(
        { by: 'surah' },
        async () =>
          await guessVerse.bySurah({
            amount: query.amount,
            select: query.select,
          }),
      )
      .exhaustive()

    return Response.json({
      message: 'success',
      ...data,
    })
  } catch (error) {
    return Response.json({
      message: 'error',
      errors: error,
    })
  }
}
