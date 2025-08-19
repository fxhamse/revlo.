// app/api/customers/[id]/route.ts - Single Customer Management API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { isValidEmail } from '@/lib/utils'; // For email validation
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants

// GET /api/customers/[id] - Soo deji macmiil gaar ah
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    // const companyId = session.user.companyId;

    // Hel customer iyo xogaha la xiriira
    const customer = await prisma.customer.findUnique({
      where: { id: id },
      include: {
        projects: {
          select: { id: true, name: true, status: true, agreementAmount: true, advancePaid: true, remainingAmount: true }
        },
        payments: {
          select: { id: true, amount: true, paymentDate: true, paymentType: true, receivedIn: true, projectId: true }
        },
        transactions: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ message: 'Macmiilka lama helin.' }, { status: 404 });
    }

    // Xisaabi total outstanding debt (expenses/transactions oo aan la bixin)
    // 1. Expenses uu macmiilkan leeyahay oo aan la bixin (category/subCategory = Debt, Debt Repayment, iwm)
    // Waxaa lagu daray: expenses uu customerId si toos ah ugu lifaaqan yahay (company debt)
    // Project-related expenses
    const projectExpenses = await prisma.expense.findMany({
      where: {
        project: { customerId: id },
      },
      select: {
        id: true,
        amount: true,
        category: true,
        subCategory: true,
        paidFrom: true,
        expenseDate: true,
        note: true,
        projectId: true,
        project: { select: { name: true } },
      },
    });

    // Company debt/repayment (Debt/Debt Repayment, projectId is null, and project.customerId is not available)
    // Waa in la xigtaa expenses-ka category-gaas leh oo projectId=null, kadibna la xigtaa projectId iyo project.customerId
    const companyDebts = await prisma.expense.findMany({
      where: {
        category: 'Company Expense',
        subCategory: { in: ['Debt', 'Debt Repayment'] },
        projectId: null,
        customerId: id,
      },
      select: {
        id: true,
        amount: true,
        category: true,
        subCategory: true,
        paidFrom: true,
        expenseDate: true,
        note: true,
        projectId: true,
        project: { select: { name: true } },
      },
    });

    // Isku dar labada array
    const expenses = [...projectExpenses, ...companyDebts];

    // 2. Transactions uu macmiilkan leeyahay (type = DEBT_TAKEN, DEBT_REPAID, iwm)
    const transactions = await prisma.transaction.findMany({
      where: { customerId: id },
      select: {
        id: true,
        description: true,
        amount: true,
        type: true,
        transactionDate: true,
        note: true,
        projectId: true,
        project: { select: { name: true } },
      },
      orderBy: { transactionDate: 'desc' },
    });

    // 3. Xisaabi total outstanding debt (expenses - repayments)
    let outstandingDebt = 0;
    for (const exp of expenses) {
      if (exp.category === 'Debt' || exp.subCategory === 'Debt') {
        outstandingDebt += Number(exp.amount);
      }
      if (exp.category === 'Debt Repayment' || exp.subCategory === 'Debt Repayment') {
        outstandingDebt -= Number(exp.amount);
      }
    }
    // Transactions (optional, for more accuracy)
    for (const trx of transactions) {
      if (trx.type === 'DEBT_TAKEN') {
        outstandingDebt += Number(trx.amount);
      }
      if (trx.type === 'DEBT_REPAID') {
        outstandingDebt -= Number(trx.amount);
      }
    }

    // 4. Projects uu leeyahay iyo lacagta ku dhiman
    const projectDebts = (customer.projects || []).map(proj => {
      const agreement = Number(proj.agreementAmount || 0);
      const advance = Number(proj.advancePaid || 0);
      const remaining = proj.remainingAmount !== undefined ? Number(proj.remainingAmount) : (agreement - advance);
      return {
        id: proj.id,
        name: proj.name,
        status: proj.status,
        agreementAmount: agreement,
        advancePaid: advance,
        remainingAmount: remaining,
      };
    });

    // 5. Payments uu bixiyay (lacagaha la helay)
    const payments = customer.payments.map(pay => ({
      ...pay,
      amount: Number(pay.amount),
    }));

    // 6. Transactions uu leeyahay (already fetched)

    // 7. Expenses uu leeyahay (already fetched)

    // 8. Return all data
    return NextResponse.json({
      customer: {
        ...customer,
        outstandingDebt,
        projectDebts,
        payments,
        transactions,
        expenses,
      },
    }, { status: 200 });
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka macmiilka ${params.id} la soo gelinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Cusboonaysii macmiil gaar ah
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { 
      name, type, companyName, phone, email, address, notes
    } = await request.json();

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || (!isManagerOrAdmin(session.user.role) && session.user.role !== USER_ROLES.MEMBER)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // 1. Xaqiijinta Input-ka
    if (!name || !type) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah: Magaca, Nooca.' },
        { status: 400 }
      );
    }
    if (type === 'Company' && !companyName) {
      return NextResponse.json(
        { message: 'Magaca shirkadda waa waajib haddii nooca uu yahay "Company".' },
        { status: 400 }
      );
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Fadlan geli email sax ah.' },
        { status: 400 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      data: {
        name,
        type,
        companyName: companyName || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(
      { message: 'Macmiilka si guul leh ayaa loo cusboonaysiiyay!', customer: updatedCustomer },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka macmiilka ${params.id} la cusboonaysiinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Tirtir macmiil gaar ah
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || !isAdmin(session.user.role)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // Hubi in macmiilku jiro ka hor inta aan la tirtirin
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
    });

    if (!existingCustomer) {
      return NextResponse.json({ message: 'Macmiilka lama helin.' }, { status: 404 });
    }

    // Tirtir macmiilka
    await prisma.customer.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Macmiilka si guul leh ayaa loo tirtiray!' },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka macmiilka ${params.id} la tirtirayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
