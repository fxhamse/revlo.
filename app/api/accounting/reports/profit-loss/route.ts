// app/api/accounting/reports/profit-loss/route.ts - Profit & Loss Report API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma Client
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal type

// GET /api/accounting/reports/profit-loss - Returns accurate, real-time P&L data
export async function GET(request: Request) {
  try {
    // --- 1. Parse date range from query params ---
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const startDate = startDateParam ? new Date(startDateParam) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = endDateParam ? new Date(endDateParam) : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

    // --- 2. Fetch all transactions in range ---
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: { gte: startDate, lte: endDate },
        // companyId: companyId // (multi-tenancy support)
      },
      include: {
        project: { select: { name: true } },
        expense: { select: { description: true, category: true, subCategory: true } },
      },
    });

    // --- 3. Aggregate and classify data ---
    let totalProjectIncome = 0;
    let totalDirectProjectCosts = 0;
    let totalOperatingExpenses = 0;
    const monthlySummaryMap: Record<string, { month: string; projectIncome: number; projectDirectCosts: number; operatingExpenses: number; netProjectProfit: number }> = {};
    const expenseBreakdownMap: Record<string, number> = {};

    // Detailed items for frontend
    const projectIncomeItems: any[] = [];
    const directProjectCostItems: any[] = [];
    const operatingExpensesItems: any[] = [];

    transactions.forEach(trx => {
      const monthYear = trx.transactionDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlySummaryMap[monthYear]) {
        monthlySummaryMap[monthYear] = { month: monthYear, projectIncome: 0, projectDirectCosts: 0, operatingExpenses: 0, netProjectProfit: 0 };
      }
      if (trx.type === 'INCOME') {
        totalProjectIncome += trx.amount.toNumber();
        monthlySummaryMap[monthYear].projectIncome += trx.amount.toNumber();
        // Add to projectIncomeItems
        projectIncomeItems.push({
          id: trx.id,
          date: trx.transactionDate,
          description: trx.description || trx.project?.name || '',
          amount: trx.amount.toNumber(),
          type: 'Project Income',
        });
      } else if (trx.type === 'EXPENSE') {
        const expenseAmount = trx.amount.toNumber();
        const expenseCategory = trx.expense?.category;
        const expenseSubCategory = trx.expense?.subCategory;
        // Direct project costs: Material, Labor, Transport
        if (expenseCategory === 'Material' || expenseCategory === 'Labor' || expenseCategory === 'Transport') {
          totalDirectProjectCosts += expenseAmount;
          monthlySummaryMap[monthYear].projectDirectCosts += expenseAmount;
          directProjectCostItems.push({
            id: trx.id,
            date: trx.transactionDate,
            description: trx.expense?.description || trx.description || '',
            amount: Math.abs(expenseAmount),
            type: expenseCategory || 'Direct Cost',
          });
        } else {
          totalOperatingExpenses += expenseAmount;
          monthlySummaryMap[monthYear].operatingExpenses += expenseAmount;
          operatingExpensesItems.push({
            id: trx.id,
            date: trx.transactionDate,
            description: trx.expense?.description || trx.description || '',
            amount: Math.abs(expenseAmount),
            type: expenseCategory || 'Operating Expense',
          });
        }
        // For expense breakdown chart
        const breakdownKey = expenseSubCategory || expenseCategory || 'Other';
        expenseBreakdownMap[breakdownKey] = (expenseBreakdownMap[breakdownKey] || 0) + Math.abs(expenseAmount);
      }
    });

    // --- 4. Calculate summary values ---
    const grossProfit = totalProjectIncome - totalDirectProjectCosts;
    const netProfit = grossProfit - totalOperatingExpenses;

    // --- 5. Realized and potential project profit ---
    const realizedProfitFromCompletedProjects = await prisma.project.aggregate({
      _sum: { remainingAmount: true },
      where: { status: 'Completed' },
    });
    const potentialProfitFromActiveProjects = await prisma.project.aggregate({
      _sum: { remainingAmount: true },
      where: { status: 'Active' },
    });

    // --- 6. Format for frontend ---
    const monthlySummary = Object.values(monthlySummaryMap)
      .map(data => {
        data.netProjectProfit = data.projectIncome - data.projectDirectCosts - data.operatingExpenses;
        return data;
      })
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    const expenseBreakdownData = Object.keys(expenseBreakdownMap).map(key => ({
      name: key,
      value: expenseBreakdownMap[key],
    }));

    // --- 7. Return response ---
    return NextResponse.json(
      {
        totalProjectIncome,
        totalDirectProjectCosts,
        totalOperatingExpenses,
        grossProfit,
        netProfit,
        realizedProjectProfit: realizedProfitFromCompletedProjects._sum.remainingAmount ? realizedProfitFromCompletedProjects._sum.remainingAmount.toNumber() : 0,
        potentialProjectProfit: potentialProfitFromActiveProjects._sum.remainingAmount ? potentialProfitFromActiveProjects._sum.remainingAmount.toNumber() : 0,
        monthlySummary,
        expenseBreakdown: expenseBreakdownData,
        projectIncomeItems,
        directProjectCostItems,
        operatingExpensesItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cilad ayaa dhacday marka warbixinta faa\'iidada iyo khasaaraha la soo gelinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
