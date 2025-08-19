
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// STATIC COMPANY ID (ku beddel id-ga saxda ah marka aad session isticmaasho)
const STATIC_COMPANY_ID = 'test-company-id'; // Ku beddel id-ga saxda ah

export async function GET(request: Request) {
	try {
		const companyId = STATIC_COMPANY_ID;
		// Aggregate total income
		const incomeResult = await prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { companyId: companyId, type: { in: ['INCOME', 'TRANSFER_IN', 'DEBT_TAKEN'] } },
		});
		// Aggregate total expenses
		const expenseResult = await prisma.transaction.aggregate({
			_sum: { amount: true },
			where: { companyId: companyId, type: { in: ['EXPENSE', 'TRANSFER_OUT', 'DEBT_REPAID'] } },
		});
		const totalIncome = incomeResult._sum?.amount ? Number(incomeResult._sum.amount) : 0;
		const totalExpenses = expenseResult._sum?.amount ? Number(expenseResult._sum.amount) : 0;
		const netProfit = totalIncome - totalExpenses;

		return NextResponse.json({
			totalIncome,
			totalExpenses,
			netProfit,
		}, { status: 200 });
	} catch (error) {
		console.error('Profit-Loss API error:', error);
		return NextResponse.json({ message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' }, { status: 500 });
	}
}
