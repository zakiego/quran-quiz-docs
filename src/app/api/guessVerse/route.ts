import { type NextRequest } from 'next/server'
import { GuessVerseSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessVerse } from 'quran-quiz'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const byQuery = searchParams.get('by') ?? 'surah'
    const amountQuery = searchParams.get('amount') ?? 1
    const selectQuery = searchParams.getAll('select')

    const parsedSelectQuery = match(selectQuery.length)
      .when(
        (len) => len > 0 && len < 4,
        () => selectQuery[0].split(','),
      )
      .when(
        (len) => len >= 4,
        () => selectQuery,
      )
      .otherwise(() => [1, 2, 3, 5])

    const query = GuessVerseSchema.parse({
      by: byQuery,
      amount: amountQuery,
      select: uniq(parsedSelectQuery as string[]),
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

    return NextResponse.json({
      message: 'success',
      ...data,
    })
  } catch (error) {
    return NextResponse.json({
      message: 'error',
      errors: error,
    })
  }
}
