// app/api/accounting/reports/debts/route.ts - Debts Report API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal type

// GET /api/accounting/reports/debts - Soo deji xogta warbixinta deynaha iyo lacagaha la sugayo
export async function GET(request: Request) {
  try {
    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || !isManagerOrAdmin(session.user.role)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // Parameters for filters
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get('type'); // 'Debts Owed' or 'Receivables'
    const statusFilter = searchParams.get('status'); // 'Overdue', 'Upcoming', 'Active', 'Paid'

    // Fetch all debts owed by the company
    const debtsOwed = await prisma.expense.findMany({
      where: {
        category: 'Debt', // Assuming 'Debt' category for debts owed
        // companyId: companyId, // Mustaqbalka, ku dar filter-kan
      },
      orderBy: {
        expenseDate: 'desc',
      },
    });

    // Fetch all receivables (payments expected from customers)
    const receivables = await prisma.payment.findMany({
      where: {
        // companyId: companyId, // Mustaqbalka, ku dar filter-kan
      },
      include: {
          project: { select: { name: true } },
          customer: { select: { name: true } },
      },
      orderBy: {
        paymentDate: 'desc',
      },
    });

    // Calculate aggregated data for the report
    let totalDebtsOwedAmount = 0;
    let remainingDebtsOwed = 0;
    let overdueDebtsOwed = 0;

    debtsOwed.forEach(debt => {
        const amount = debt.amount.toNumber();
        totalDebtsOwedAmount += amount;
        // For simplicity, assuming 'Overdue' status is set manually or by another process
        // In a real app, you'd calculate remaining and overdue based on payment schedules
        remainingDebtsOwed += amount; // Placeholder for remaining
        if (debt.description.includes('Overdue')) { // Simple check for dummy data
            overdueDebtsOwed += amount;
        }
    });

    let totalReceivableAmount = 0;
    let remainingReceivableAmount = 0;
    let overdueReceivableAmount = 0;

    receivables.forEach(rec => {
        const amount = rec.amount.toNumber();
        totalReceivableAmount += amount;
        // For simplicity, assuming 'Overdue' status is set manually or by another process
        remainingReceivableAmount += amount; // Placeholder for remaining
        if (rec.paymentType.includes('Overdue')) { // Simple check for dummy data
            overdueReceivableAmount += amount;
        }
    });


    return NextResponse.json(
      {
        totalDebtsOwed: totalDebtsOwedAmount,
        remainingDebtsOwed: remainingDebtsOwed,
        overdueDebtsOwed: overdueDebtsOwed,
        totalReceivableAmount: totalReceivableAmount,
        remainingReceivableAmount: remainingReceivableAmount,
        overdueReceivableAmount: overdueReceivableAmount,
        
        debts: debtsOwed.map(debt => ({ // Return original debts with converted Decimal to Number
            ...debt,
            amount: debt.amount.toNumber(),
            // Add actual remaining/overdue status here if calculated on backend
        })),
        receivables: receivables.map(rec => ({ // Return original receivables with converted Decimal to Number
            ...rec,
            amount: rec.amount.toNumber(),
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cilad ayaa dhacday marka warbixinta deynaha la soo gelinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
