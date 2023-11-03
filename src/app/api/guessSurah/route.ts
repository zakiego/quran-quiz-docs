import { type NextRequest } from 'next/server'
import { GuessSurahSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessSurah } from 'quran-quiz'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const amountQuery = searchParams.get('amount') ?? 1
    const selectQuery =
      searchParams.getAll('select').length >= 4
        ? searchParams.getAll('select')
        : [1, 2, 3, 4]

    const query = GuessSurahSchema.parse({
      amount: amountQuery,
      select: uniq(selectQuery as string[]),
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
