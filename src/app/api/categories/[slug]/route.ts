import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Try to find by slug first, then by id
    let category = await prisma.category.findUnique({
      where: { slug: params.slug },
    })

    // If not found by slug, try by id
    if (!category) {
      category = await prisma.category.findUnique({
        where: { id: params.slug },
      })
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
