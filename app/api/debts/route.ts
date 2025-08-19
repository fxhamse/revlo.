// app/api/debts/route.ts - Debts API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionCompanyUser } from '../expenses/auth';

// GET /api/debts - Get all debts for the company
export async function GET(request: Request) {
  try {
    const { companyId } = await getSessionCompanyUser();
    const debts = await prisma.expense.findMany({
      where: { companyId, category: 'Debt' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ debts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// POST /api/debts - Add a new debt
export async function POST(request: Request) {
  try {
    const { companyId } = await getSessionCompanyUser();
    const { lender, amount, remaining, date, note } = await request.json();
    if (!lender || amount === undefined || amount === null || isNaN(Number(amount)) || !date) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah.' },
        { status: 400 }
      );
    }
    const parsedAmount = Number(amount);
    const parsedRemaining = remaining !== undefined && remaining !== null && !isNaN(Number(remaining)) ? Number(remaining) : parsedAmount;
    if (parsedAmount < 0 || parsedRemaining < 0) {
      return NextResponse.json(
        { message: 'Qiimaha deynta sax ma aha.' },
        { status: 400 }
      );
    }
    let parsedDate;
    try {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
    } catch {
      return NextResponse.json(
        { message: 'Taariikh sax ah ma lahan.' },
        { status: 400 }
      );
    }
    const newDebt = await prisma.expense.create({
      data: {
        description: lender,
        amount: parsedAmount,
        category: 'Debt',
        subCategory: null,
        paidFrom: '',
        expenseDate: parsedDate,
        note: note || '',
        approved: false,
        companyId,
      },
    });
    return NextResponse.json({ message: 'Deyn waa la daray!', debt: newDebt }, { status: 201 });
  } catch (error) {
    console.error('Debts API error:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
