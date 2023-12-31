import { type NextRequest } from 'next/server'
import { GuessSurahSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessSurah } from 'quran-quiz'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const amountQuery = searchParams.get('amount') ?? 1
    const selectQuery = searchParams.getAll('select')

    const parsedSelectQuery = match(selectQuery.length)
      .when(
        (len) => len === 1,
        () => selectQuery[0].split(','),
      )
      .when(
        (len) => len >= 4,
        () => selectQuery,
      )
      .otherwise(() => [1, 2, 3, 5])

    const query = GuessSurahSchema.parse({
      amount: amountQuery,
      select: uniq(parsedSelectQuery as string[]),
    })

    const data = await guessSurah.bySurah({
      amount: query.amount,
      select: query.select,
    })

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
