// app/api/accounting/transactions/route.ts - Accounting Transactions API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { Decimal } from '@prisma/client/runtime/library'; // Import Decimal type

// GET /api/accounting/transactions - Soo deji dhammaan dhaqdhaqaaqa lacagta
export async function GET(request: Request) {
  try {
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user?.companyId) {
      return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    }
    const companyId = (session as any).user.companyId;

    const transactions = await prisma.transaction.findMany({
      where: { companyId },
      include: {
        account: { select: { name: true } },
        fromAccount: { select: { name: true } },
        toAccount: { select: { name: true } },
        project: { select: { name: true } },
        expense: { select: { description: true } },
        customer: { select: { name: true } },
        vendor: { select: { name: true } },
        user: { select: { fullName: true } },
        employee: { select: { fullName: true } },
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });

    const processedTransactions = transactions.map(trx => ({
      ...trx,
      amount: trx.amount instanceof Decimal ? trx.amount.toNumber() : trx.amount,
    }));

    return NextResponse.json({ transactions: processedTransactions }, { status: 200 });
  } catch (error) {
    console.error('Cilad ayaa dhacday marka dhaqdhaqaaqa lacagta la soo gelinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// POST /api/accounting/transactions - Ku dar dhaqdhaqaaq cusub
export async function POST(request: Request) {
  try {
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);
    if (!session || !(session as any).user?.companyId || !(session as any).user?.id) {
      return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    }
    const companyId = (session as any).user.companyId;
    const userId = (session as any).user.id;

    const { 
      description, amount, type, transactionDate, note, 
      accountId, fromAccountId, toAccountId, // Account IDs
      projectId, expenseId, customerId, vendorId, employeeId // Related entity IDs
    } = await request.json();

    if (!description || typeof amount !== 'number' || !type || !transactionDate) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah: Sharaxaad, Qiime, Nooc, Taariikhda.' },
        { status: 400 }
      );
    }
    if (amount === 0) {
      return NextResponse.json(
        { message: 'Qiimaha ma noqon karo eber.' },
        { status: 400 }
      );
    }

    // Xaqiijinta Account-yada
    if (type !== 'TRANSFER_IN' && type !== 'TRANSFER_OUT' && !accountId) {
      return NextResponse.json(
        { message: 'Account-ka waa waajib dhaqdhaqaaqyada aan wareejinta ahayn.' },
        { status: 400 }
      );
    }
    if ((type === 'TRANSFER_IN' || type === 'TRANSFER_OUT') && (!fromAccountId || !toAccountId)) {
      return NextResponse.json(
        { message: 'Accounts-ka laga wareejinayo iyo loo wareejinayo waa waajib wareejinta.' },
        { status: 400 }
      );
    }
    if (fromAccountId === toAccountId && (type === 'TRANSFER_IN' || type === 'TRANSFER_OUT')) {
      return NextResponse.json(
        { message: 'Accounts-ka wareejinta ma noqon karaan isku mid.' },
        { status: 400 }
      );
    }

    // Hubi jiritaanka accounts-ka shirkaddan
    let primaryAccount = null;
    let sourceAccount = null;
    let destinationAccount = null;

    if (accountId) {
      primaryAccount = await prisma.account.findFirst({ where: { id: accountId, companyId } });
      if (!primaryAccount) return NextResponse.json({ message: 'Account-ka aasaasiga ah lama helin.' }, { status: 400 });
    }
    if (fromAccountId) {
      sourceAccount = await prisma.account.findFirst({ where: { id: fromAccountId, companyId } });
      if (!sourceAccount) return NextResponse.json({ message: 'Account-ka laga wareejinayo lama helin.' }, { status: 400 });
    }
    if (toAccountId) {
      destinationAccount = await prisma.account.findFirst({ where: { id: toAccountId, companyId } });
      if (!destinationAccount) return NextResponse.json({ message: 'Account-ka loo wareejinayo lama helen.' }, { status: 400 });
    }

    // Hubi jiritaanka entities-ka shirkaddan
    if (projectId) {
      const project = await prisma.project.findFirst({ where: { id: projectId, companyId } });
      if (!project) return NextResponse.json({ message: 'Mashruuca la xiriira lama helin.' }, { status: 400 });
    }
    if (expenseId) {
      const expense = await prisma.expense.findFirst({ where: { id: expenseId, companyId } });
      if (!expense) return NextResponse.json({ message: 'Kharashka la xiriira lama helin.' }, { status: 400 });
    }
    if (customerId) {
      const customer = await prisma.customer.findFirst({ where: { id: customerId, companyId } });
      if (!customer) return NextResponse.json({ message: 'Macmiilka la xiriira lama helin.' }, { status: 400 });
    }
    if (vendorId) {
      const vendor = await prisma.vendor.findFirst({ where: { id: vendorId, companyId } });
      if (!vendor) return NextResponse.json({ message: 'Iibiyaha la xiriira lama helin.' }, { status: 400 });
    }
    if (employeeId) {
      const employee = await prisma.employee.findFirst({ where: { id: employeeId, companyId } });
      if (!employee) return NextResponse.json({ message: 'Shaqaalaha la xiriira lama helin.' }, { status: 400 });
    }

    // Abuur dhaqdhaqaaq cusub
    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: new Decimal(amount),
        type,
        transactionDate: new Date(transactionDate),
        note: note || null,
        accountId: accountId || null,
        fromAccountId: fromAccountId || null,
        toAccountId: toAccountId || null,
        projectId: projectId || null,
        expenseId: expenseId || null,
        customerId: customerId || null,
        vendorId: vendorId || null,
        employeeId: employeeId || null,
        userId,
        companyId,
      },
    });

    // Cusboonaysii balance-ka accounts-ka
    if (type === 'INCOME' && primaryAccount) {
      await prisma.account.update({
        where: { id: primaryAccount.id },
        data: { balance: new Decimal(primaryAccount.balance.toNumber() + amount) },
      });
    } else if (type === 'EXPENSE' && primaryAccount) {
      await prisma.account.update({
        where: { id: primaryAccount.id },
        data: { balance: new Decimal(primaryAccount.balance.toNumber() - Math.abs(amount)) },
      });
    } else if (type === 'TRANSFER_OUT' && sourceAccount && destinationAccount) {
      await prisma.account.update({
        where: { id: sourceAccount.id },
        data: { balance: new Decimal(sourceAccount.balance.toNumber() - amount) },
      });
      await prisma.account.update({
        where: { id: destinationAccount.id },
        data: { balance: new Decimal(destinationAccount.balance.toNumber() + amount) },
      });
    } else if (type === 'TRANSFER_IN' && sourceAccount && destinationAccount) {
      await prisma.account.update({
        where: { id: sourceAccount.id },
        data: { balance: new Decimal(sourceAccount.balance.toNumber() - amount) },
      });
      await prisma.account.update({
        where: { id: destinationAccount.id },
        data: { balance: new Decimal(destinationAccount.balance.toNumber() + amount) },
      });
    } else if (type === 'DEBT_TAKEN' && primaryAccount) {
      await prisma.account.update({
        where: { id: primaryAccount.id },
        data: { balance: new Decimal(primaryAccount.balance.toNumber() + amount) },
      });
      // Tani waxay u baahan tahay in sidoo kale diiwaan deyn cusub la abuuro
    } else if (type === 'DEBT_REPAID' && primaryAccount) {
      await prisma.account.update({
        where: { id: primaryAccount.id },
        data: { balance: new Decimal(primaryAccount.balance.toNumber() - amount) },
      });
      // Tani waxay u baahan tahay in sidoo kale diiwaan deyn la cusboonaysiiyo
    }

    return NextResponse.json(
      { message: 'Dhaqdhaqaaqa lacagta si guul leh ayaa loo daray!', transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Cilad ayaa dhacday marka dhaqdhaqaaqa lacagta la darayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
