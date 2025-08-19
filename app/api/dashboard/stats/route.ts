

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    // Financial stats
    const [incomeAgg, expensesAgg, projectsAgg, bankAgg, mobileAgg, cashAgg, lowStockAgg, overdueAgg, completedAgg, activeAgg] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'INCOME' } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: 'EXPENSE' } }),
      prisma.project.count(),
      prisma.account.aggregate({ _sum: { balance: true }, where: { type: 'BANK' } }),
      prisma.account.aggregate({ _sum: { balance: true }, where: { type: 'MOBILE_MONEY' } }),
      prisma.account.aggregate({ _sum: { balance: true }, where: { type: 'CASH' } }),
      prisma.inventoryItem.count({ where: { inStock: { lt: 5 } } }),
      prisma.project.count({ where: { status: 'Overdue' } }),
      prisma.project.aggregate({ _sum: { agreementAmount: true }, where: { status: 'Completed' } }),
      prisma.project.aggregate({ _sum: { agreementAmount: true }, where: { status: 'Active' } }),
    ]);

    // Monthly financial data
    const monthlyFinancialData = await prisma.$queryRaw`SELECT to_char("transactionDate", 'Mon YYYY') as month, SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expenses, SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as profit FROM "transactions" GROUP BY month ORDER BY min("transactionDate") DESC LIMIT 12`;

    // Project status breakdown
    const statusColors = {
      Active: '#2ECC71',
      Completed: '#3498DB',
      OnHold: '#F39C12',
      Overdue: '#E74C3C',
      Upcoming: '#9B59B6',
    };
    const statusCounts: Array<{ status: string; _count: { status: number } }> = await prisma.project.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const projectStatusBreakdown = statusCounts.map((s: { status: string; _count: { status: number } }) => ({
      name: s.status,
      value: s._count.status,
      color: statusColors[s.status as keyof typeof statusColors] || '#A0A0A0',
    }));

    // Recent activities
    const recentActivitiesRaw: Array<{ id: string; type: string; description: string; amount?: number; date: string; user?: string }> = await prisma.notification.findMany({
      orderBy: { date: 'desc' },
      take: 10,
    });
    const recentActivities = recentActivitiesRaw.map((a) => ({
      id: a.id,
      type: a.type,
      description: a.description,
      amount: undefined,
      date: a.date,
      user: a.user || 'System',
    }));

    return NextResponse.json({
      totalIncome: Number(incomeAgg._sum.amount) || 0,
      totalExpenses: Number(expensesAgg._sum.amount) || 0,
      netProfit: (Number(incomeAgg._sum.amount) || 0) - (Number(expensesAgg._sum.amount) || 0),
      totalProjects: projectsAgg,
      activeProjects: statusCounts.find((s) => s.status === 'Active')?._count.status || 0,
      completedProjects: statusCounts.find((s) => s.status === 'Completed')?._count.status || 0,
      onHoldProjects: statusCounts.find((s) => s.status === 'OnHold')?._count.status || 0,
      totalBankBalance: Number(bankAgg._sum.balance) || 0,
      totalMobileMoneyBalance: Number(mobileAgg._sum.balance) || 0,
      totalCashBalance: Number(cashAgg._sum.balance) || 0,
      lowStockItems: lowStockAgg,
      overdueProjects: overdueAgg,
      realizedProfitFromCompletedProjects: Number(completedAgg._sum.agreementAmount) || 0,
      potentialProfitFromActiveProjects: Number(activeAgg._sum.agreementAmount) || 0,
      monthlyFinancialData,
      projectStatusBreakdown,
      recentActivities,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Dashboard stats fetch failed', details: String(err) }, { status: 500 });
  }
}
