import { type NextRequest } from 'next/server'
import { GuessVerseSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessVerse } from 'quran-quiz'
import { match } from 'ts-pattern'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const byQuery = searchParams.get('by')
    const amountQuery = searchParams.get('amount')
    const selectQuery = searchParams.getAll('select')

    const query = GuessVerseSchema.parse({
      by: byQuery,
      amount: amountQuery,
      select: uniq(selectQuery),
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
