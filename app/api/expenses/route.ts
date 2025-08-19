// app/api/expenses/route.ts - Expense Management API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { isValidEmail } from '@/lib/utils'; // For email validation if needed
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { getSessionCompanyUser } from './auth';
import { TransactionType } from '@prisma/client';

// GET /api/expenses - Soo deji dhammaan kharashyada
export async function GET(request: Request) {
  try {
    const { companyId } = await getSessionCompanyUser();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const subCategory = searchParams.get('subCategory');
    const category = searchParams.get('category');
    const projectId = searchParams.get('projectId');

    // Build where clause
    const where: any = { companyId };
    if (employeeId) where.employeeId = employeeId;
    if (subCategory) where.subCategory = subCategory;
    if (category) where.category = category;
    // projectId=null means only company expenses (not linked to a project)
    if (projectId === 'null') {
      where.projectId = null;
    } else if (projectId) {
      where.projectId = projectId;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expenseDate: 'desc' },
      select: {
        id: true,
        expenseDate: true,
        project: true,
        category: true,
        subCategory: true,
        description: true,
        amount: true,
        paidFrom: true,
        note: true,
        approved: true,
        employee: true,
        expenseCategory: true,
        createdAt: true,
        updatedAt: true,
        materials: true,
      },
    });

    // Map to frontend format: always return amount as number, project name, etc.
    const mappedExpenses = expenses.map(exp => ({
      id: exp.id,
      date: exp.expenseDate,
      project: exp.project ? exp.project.name : undefined,
      category: exp.category,
      subCategory: exp.subCategory || undefined,
      description: exp.description,
      amount: typeof exp.amount === 'object' && 'toNumber' in exp.amount ? exp.amount.toNumber() : Number(exp.amount),
      paidFrom: exp.paidFrom,
      note: exp.note,
      approved: exp.approved,
      employee: exp.employee ? exp.employee.fullName : undefined,
      expenseCategory: exp.expenseCategory ? exp.expenseCategory.name : undefined,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
      materials: exp.materials || [],
    }));
    return NextResponse.json({ expenses: mappedExpenses }, { status: 200 });
  } catch (error) {
    console.error('Cilad ayaa dhacday marka kharashyada la soo gelinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Ku dar kharash cusub
export async function POST(request: Request) {
  try {

    const { companyId, userId } = await getSessionCompanyUser();
    const {
      description,
      amount,
      category,
      subCategory,
      paidFrom,
      expenseDate,
      note,
      projectId,
      customerId, // NEW: for Debt/Debt Repayment
      employeeId, // For Salary payments
      materials // <-- NEW: for Material expenses
    } = await request.json();

    // Defensive: fallback for missing/invalid category
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { message: 'Nooca kharashka waa waajib (category).' },
        { status: 400 }
      );
    }

    // Always trim description if present
    let finalDescription = typeof description === 'string' ? description.trim() : '';
    // Only require description for Labor, Material, and Company Expense: Salary
    let mustHaveDescription = false;
    if (category === 'Labor' || category === 'Material' || (category === 'Company Expense' && subCategory === 'Salary')) {
      mustHaveDescription = true;
    }
    if (!finalDescription) {
      if (mustHaveDescription) {
        return NextResponse.json(
          { message: 'Sharaxaad (description) waa waajib.' },
          { status: 400 }
        );
      } else {
        // Auto-generate description for categories that don't require it
        finalDescription = `${category ? category : 'Expense'} expense - ${expenseDate || ''}`;
      }
    }
    // For Material expenses, always require materials array
    if (category === 'Material' && (!Array.isArray(materials) || materials.length === 0)) {
      return NextResponse.json(
        { message: 'Materials waa waajib (ugu yaraan hal alaab).'},
        { status: 400 }
      );
    }

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json(
        { message: 'Qiimaha (amount) waa waajib.' },
        { status: 400 }
      );
    }
    if (!paidFrom) {
      return NextResponse.json(
        { message: 'Akoonka laga bixiyay (paidFrom) waa waajib.' },
        { status: 400 }
      );
    }
    if (!expenseDate) {
      return NextResponse.json(
        { message: 'Taariikhda kharashka (expenseDate) waa waajib.' },
        { status: 400 }
      );
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Qiimaha waa inuu noqdaa nambar wanaagsan.' },
        { status: 400 }
      );
    }

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId, companyId },
      });
      if (!project) {
        return NextResponse.json({ message: 'Mashruuca la doortay lama helin.' }, { status: 400 });
      }
    }




    // Always set subCategory to 'Salary' for company salary expenses if missing
    let finalSubCategory = subCategory;
    if (category === 'Company Expense' && employeeId && (!subCategory || subCategory === null)) {
      finalSubCategory = 'Salary';
    }
    const newExpense = await prisma.expense.create({
      data: {
        description: finalDescription,
        amount: amount.toString(),
        category,
        subCategory: finalSubCategory || null,
        paidFrom,
        expenseDate: new Date(expenseDate),
        note: note || null,
        approved: false,
        projectId: projectId || null,
        companyId,
        userId,
        // Always set employeeId for salary payments, and for any expense with employeeId
        employeeId: (category === 'Company Expense' && finalSubCategory === 'Salary' && employeeId) ? employeeId : (employeeId ? employeeId : undefined),
        // Store materials array if present and category is Material (project or company)
        ...( ((category === 'Material' || (category === 'Company Expense' && finalSubCategory === 'Material')) && Array.isArray(materials)) ? { materials } : {} ),
        // NEW: Store customerId for company debts
        ...(customerId ? { customerId } : {}),
      },
    });
    // 2b. If this is a Salary payment, increment salaryPaidThisMonth for the employee
    if (category === 'Company Expense' && subCategory === 'Salary' && employeeId && amount) {
      await prisma.employee.update({
        where: { id: employeeId, companyId },
        data: {
          salaryPaidThisMonth: { increment: Number(amount) },
          lastPaymentDate: new Date(expenseDate),
        },
      });
    }

    // 2. Create a corresponding transaction
    let transactionType: TransactionType = TransactionType.EXPENSE;
    let transactionAmount = Number(amount);
    let transactionCustomerId = undefined;
    if (category === 'Debt') {
      transactionType = TransactionType.DEBT_TAKEN;
      transactionCustomerId = customerId || null;
    } else if (category === 'Debt Repayment') {
      transactionType = TransactionType.DEBT_REPAID;
      transactionCustomerId = customerId || null;
    }
    // For EXPENSE, always store as negative (money out)
    if (transactionType === TransactionType.EXPENSE) {
      transactionAmount = -Math.abs(transactionAmount);
    }
    await prisma.transaction.create({
      data: {
        description: finalDescription,
        amount: transactionAmount,
        type: transactionType,
        transactionDate: new Date(expenseDate),
        note: note || null,
        accountId: paidFrom || null,
        projectId: projectId || null,
        expenseId: newExpense.id,
        userId,
        companyId,
        customerId: transactionCustomerId,
      },
    });

    // 3. Decrement the account balance in real time
    if (paidFrom && amount) {
      await prisma.account.update({
        where: { id: paidFrom },
        data: {
          balance: { decrement: Number(amount) },
        },
      });
    }

    return NextResponse.json(
      { message: 'Kharashka si guul leh ayaa loo daray!', expense: newExpense },
      { status: 201 }
    );
  } catch (error) {
    console.error('Expense API error:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
