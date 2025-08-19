// PATCH /api/expenses/[id] - Approve expense (only updates 'approved' field)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { approved } = await request.json();
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ message: "'approved' field is required and must be boolean." }, { status: 400 });
    }
    // Get the expense to check type and employeeId
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      return NextResponse.json({ message: 'Kharashka lama helin.' }, { status: 404 });
    }
    // Approve the expense
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: { approved },
    });
    // If approving and it's a salary/advance expense, increment employee's salaryPaidThisMonth
    if (
      approved === true &&
      expense.employeeId &&
      (
        (expense.category === 'Company Expense' && expense.subCategory === 'Salary') ||
        expense.category === 'Advance'
      )
    ) {
      await prisma.employee.update({
        where: { id: expense.employeeId },
        data: {
          salaryPaidThisMonth: { increment: Number(expense.amount) },
          lastPaymentDate: new Date(expense.expenseDate),
        },
      });
    }
    return NextResponse.json({ message: 'Kharashka si guul leh ayaa loo ansixiyay!', expense: updatedExpense }, { status: 200 });
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka kharashka ${params.id} la ansixinayay:`, error);
    return NextResponse.json({ message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' }, { status: 500 });
  }
}
// app/api/expenses/[id]/route.ts - Single Expense Management API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client

// GET /api/expenses/[id] - Soo deji kharash gaar ah
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    // const companyId = session.user.companyId;

    const expense = await prisma.expense.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      include: {
        project: { // Ku dar macluumaadka mashruuca haddii uu la xiriira
          select: { name: true }
        },
        user: { // Ku dar macluumaadka user-ka diiwaan geliyay
          select: { fullName: true }
        }
      },
    });

    if (!expense) {
      return NextResponse.json({ message: 'Kharashka lama helin.' }, { status: 404 });
    }

    return NextResponse.json({ expense }, { status: 200 });
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka kharashka ${params.id} la soo gelinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Cusboonaysii kharash gaar ah
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { 
      description, amount, category, subCategory, paidFrom, expenseDate, note, approved // Approved status can be updated
    } = await request.json();

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || (!isManagerOrAdmin(session.user.role) && session.user.role !== USER_ROLES.MEMBER)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // 1. Xaqiijinta Input-ka
    if (!description || !amount || !category || !paidFrom || !expenseDate) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah.' },
        { status: 400 }
      );
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Qiimaha waa inuu noqdaa nambar wanaagsan.' },
        { status: 400 }
      );
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      data: {
        description,
        amount: typeof amount === 'string' ? parseFloat(amount).toString() : amount.toString(),
        category,
        subCategory: subCategory || null,
        paidFrom,
        expenseDate: new Date(expenseDate),
        note: note || null,
        approved: approved, // Update approved status
      },
    });

    return NextResponse.json(
      { message: 'Kharashka si guul leh ayaa loo cusboonaysiiyay!', expense: updatedExpense },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka kharashka ${params.id} la cusboonaysiinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Tirtir kharash gaar ah
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Hubi in kharashku jiro ka hor inta aan la tirtirin
    const existingExpense = await prisma.expense.findUnique({
      where: { id: id },
      include: {
        transactions: true,
      },
    });

    if (!existingExpense) {
      return NextResponse.json({ message: 'Kharashka lama helin.' }, { status: 404 });
    }

    // 1. Delete related transaction(s) and restore account balance
    if (existingExpense.transactions && existingExpense.transactions.length > 0) {
      for (const txn of existingExpense.transactions) {
        // Only restore balance if transaction has accountId and amount
        if (txn.accountId && txn.amount) {
          // txn.amount is negative for expenses, so add back the original value (reverse the sign)
          await prisma.account.update({
            where: { id: txn.accountId },
            data: {
              balance: { increment: -Number(txn.amount) },
            },
          });
        }
        await prisma.transaction.delete({ where: { id: txn.id } });
      }
    }

    // 2. If expense is salary, decrement employee's salaryPaidThisMonth
    if (
      existingExpense.employeeId &&
      existingExpense.category === 'Company Expense' &&
      existingExpense.subCategory === 'Salary' &&
      existingExpense.amount
    ) {
      await prisma.employee.update({
        where: { id: existingExpense.employeeId },
        data: {
          salaryPaidThisMonth: { decrement: Number(existingExpense.amount) },
        },
      });
    }

    // 3. Delete the expense
    await prisma.expense.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Kharashka si guul leh ayaa loo tirtiray!' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka kharashka ${params.id} la tirtirayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
