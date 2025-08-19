// app/api/vendors/[id]/route.ts - Single Vendor Management API Route
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { isValidEmail } from '@/lib/utils'; // For email validation
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants

// GET /api/vendors/[id] - Soo deji iibiye gaar ah
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 401 });
    // const companyId = session.user.companyId;

    const vendor = await prisma.vendor.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      include: {
        // Ku dar xiriirada kale ee iibiyaha (tusaale, kharashyadiisa)
        expenses: { // Haddii aad rabto inaad soo bandhigto kharashyada la xiriira iibiyahan
          select: { id: true, description: true, amount: true, expenseDate: true }
        },
        transactions: true, // Ku dar transactions-ka iibiyahan
      },
    });

    if (!vendor) {
      return NextResponse.json({ message: 'Iibiyaha lama helin.' }, { status: 404 });
    }

    return NextResponse.json({ vendor }, { status: 200 });
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka iibiyaha ${params.id} la soo gelinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// PUT /api/vendors/[id] - Cusboonaysii iibiye gaar ah
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { 
      name, type, phone, email, address, productsServices, notes
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
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Fadlan geli email sax ah.' },
        { status: 400 }
      );
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
      data: {
        name,
        type,
        phone: phone || null,
        email: email || null,
        address: address || null,
        productsServices: productsServices || null,
        notes: notes || null,
        updatedAt: new Date(), // Cusboonaysii taariikhda
      },
    });

    return NextResponse.json(
      { message: 'Iibiyaha si guul leh ayaa loo cusboonaysiiyay!', vendor: updatedVendor },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka iibiyaha ${params.id} la cusboonaysiinayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// DELETE /api/vendors/[id] - Tirtir iibiye gaar ah
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Mustaqbalka, halkan waxaad ku dari doontaa authentication iyo authorization
    // Tusaale: const session = await getServerSession(authOptions);
    // if (!session || !isAdmin(session.user.role)) return NextResponse.json({ message: 'Awood uma lihid.' }, { status: 403 });
    // const companyId = session.user.companyId;

    // Hubi in iibiyuhu jiro ka hor inta aan la tirtirin
    const existingVendor = await prisma.vendor.findUnique({
      where: { id: id },
      // and: { companyId: companyId } // Mustaqbalka, ku dar filter-kan
    });

    if (!existingVendor) {
      return NextResponse.json({ message: 'Iibiyaha lama helin.' }, { status: 404 });
    }

    // Tirtir iibiyaha
    await prisma.vendor.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: 'Iibiyaha si guul leh ayaa loo tirtiray!' },
      { status: 200 } // OK
    );
  } catch (error) {
    console.error(`Cilad ayaa dhacday marka iibiyaha ${params.id} la tirtirayay:`, error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}
