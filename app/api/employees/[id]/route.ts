// app/api/employees/[id]/route.ts - Single Employee Management API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { isValidEmail } from '@/lib/utils'; // For email validation
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { Decimal } from '@prisma/client/runtime/library'; // MUHIIM: Import Decimal

// GET /api/employees/[id] - Soo deji shaqaale gaar ah
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    // const companyId = session.user.companyId;

    const employee = await prisma.employee.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      include: {
        laborRecords: true, // Ku dar diiwaanada shaqada mashruuca
        transactions: true, // Ku dar transactions-ka shaqaalahan
      },
    });

    if (!employee) {
      return NextResponse.json({ message: 'Shaqaalaha lama helin.' }, { status: 404 });
    }

    // Convert Decimal fields to Number for frontend display
    const processedEmployee = {
      ...employee,
      monthlySalary: employee.monthlySalary ? employee.monthlySalary.toNumber() : null, // Handle null
      salaryPaidThisMonth: employee.salaryPaidThisMonth ? employee.salaryPaidThisMonth.toNumber() : null, // Handle null
      overpaidAmount: employee.overpaidAmount ? employee.overpaidAmount.toNumber() : null, // Handle null
    };

    return NextResponse.json({ employee: processedEmployee }, { status: 200 });
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka shaqaalaha ${params.id} la soo gelinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id] - Cusboonaysii shaqaale gaar ah
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { 
      fullName, email, phone, role, monthlySalary, isActive, startDate // NEW: startDate
    } = await request.json();

    // 1. Xaqiijinta Input-ka
    if (!fullName || !role) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah: Magaca Buuxa, Doorka.' },
        { status: 400 }
      );
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Fadlan geli email sax ah.' },
        { status: 400 }
      );
    }
    // Hubi monthlySalary haddii la bixiyay (waa optional for Project Employee)
    if (monthlySalary !== undefined && monthlySalary !== null && monthlySalary !== '' && (typeof monthlySalary !== 'number' || monthlySalary < 0)) {
        return NextResponse.json(
            { message: 'Mushaharka bil kasta waa inuu noqdaa nambar wanaagsan (ama eber).' },
            { status: 400 }
        );
    }
    // Validate startDate if provided (it will be null for Project Employee)
    if (startDate && isNaN(new Date(startDate).getTime())) {
        return NextResponse.json(
            { message: 'Taariikhda bilowga mushaharka waa waajib oo waa inuu noqdaa taariikh sax ah.' },
            { status: 400 }
        );
    }

    const updatedEmployee = await prisma.employee.update({
  where: { id: id },
  // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
  data: {
    fullName,
    email: email || null,
    phone: phone || null,
    role,
    // MUHIIM: Maaree monthlySalary si uu u noqdo Decimal ama undefined
    ...(monthlySalary !== undefined && monthlySalary !== null && monthlySalary !== ''
      ? { monthlySalary: new Decimal(monthlySalary) }
      : {}),
    startDate: startDate ? new Date(startDate) : undefined, // Dir undefined halkii null
    isActive,
    updatedAt: new Date(), // Cusboonaysii taariikhda
  },
});

    return NextResponse.json(
      { message: 'Shaqaalaha si guul leh ayaa loo cusboonaysiiyay!', employee: updatedEmployee },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka shaqaalaha ${params.id} la cusboonaysiinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Tirtir shaqaale gaar ah
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || !isAdmin(session.user.role)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // Hubi in shaqaaluhu jiro ka hor inta aan la tirtirin
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
    });

    if (!existingEmployee) {
      return NextResponse.json({ message: 'Shaqaalaha lama helin.' }, { status: 404 });
    }

    // Tirtir shaqaalaha
    await prisma.employee.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Shaqaalaha si guul leh ayaa loo tirtiray!' },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka shaqaalaha ${params.id} la tirtirayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
