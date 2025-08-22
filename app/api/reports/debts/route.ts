import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Debts report: Aggregates company debts (amounts owed and receivable)
export async function GET(req: Request) {
  try {
    // Get companyId from query or session (for now, use first company)
    const company = await prisma.company.findFirst();
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }
    const companyId = company.id;


    // Company debts: vendors only
    const companyDebts = await prisma.transaction.findMany({
      where: {
        companyId,
        vendorId: { not: null },
        OR: [
          { type: 'DEBT_TAKEN' },
          { type: 'DEBT_REPAID' }
        ]
      },
      include: {
        vendor: true,
        account: true,
        project: true,
      },
    });

    // Project debts: vendors only, grouped by project
    const projectDebts = await prisma.transaction.findMany({
      where: {
        companyId,
        vendorId: { not: null },
        projectId: { not: null },
        OR: [
          { type: 'DEBT_TAKEN' },
          { type: 'DEBT_REPAID' }
        ]
      },
      include: {
        vendor: true,
        account: true,
        project: true,
      },
    });

    // Receivables: clients (customers) only
    const clientReceivables = await prisma.transaction.findMany({
      where: {
        companyId,
        customerId: { not: null },
        OR: [
          { type: 'DEBT_TAKEN' },
          { type: 'DEBT_REPAID' }
        ]
      },
      include: {
        customer: true,
        account: true,
        project: true,
      },
    });

    // Project receivables: clients only, grouped by project
    const projectReceivables = await prisma.transaction.findMany({
      where: {
        companyId,
        customerId: { not: null },
        projectId: { not: null },
        OR: [
          { type: 'DEBT_TAKEN' },
          { type: 'DEBT_REPAID' }
        ]
      },
      include: {
        customer: true,
        account: true,
        project: true,
      },
    });

  // Define debts and receivables arrays
  const debtsOwed = companyDebts.filter(t => t.type === 'DEBT_TAKEN');
  const debtsRepaid = companyDebts.filter(t => t.type === 'DEBT_REPAID');
  const receivables = clientReceivables.filter(t => t.type === 'DEBT_TAKEN');
  const receivablesRepaid = clientReceivables.filter(t => t.type === 'DEBT_REPAID');

  // Calculate totals
  const totalDebtsOwed = debtsOwed.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const totalDebtsRepaid = debtsRepaid.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const totalReceivables = receivables.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const totalReceivablesRepaid = receivablesRepaid.reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    // Outstanding debts and receivables
    const outstandingDebts = totalDebtsOwed - totalDebtsRepaid;
    const outstandingReceivables = totalReceivables - totalReceivablesRepaid;

    return NextResponse.json({
      companyId,
      outstandingDebts,
      outstandingReceivables,
      debtsOwed,
      debtsRepaid,
      receivables,
      receivablesRepaid,
    });
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
