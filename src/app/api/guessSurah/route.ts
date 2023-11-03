import { type NextRequest } from 'next/server'
import { GuessSurahSchema } from '@/schema/guess.schema'
import { uniq } from 'lodash'
import { guessSurah } from 'quran-quiz'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const amountQuery = searchParams.get('amount')
    const selectQuery = searchParams.getAll('select')

    const query = GuessSurahSchema.parse({
      amount: amountQuery,
      select: uniq(selectQuery),
    })

    const data = await guessSurah.bySurah({
      amount: query.amount,
      select: query.select,
    })

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
