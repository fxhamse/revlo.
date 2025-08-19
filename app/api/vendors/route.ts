// app/api/vendors/route.ts - Vendor Management API Route (DEBUGGING)
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Import Prisma Client
import { isValidEmail } from '@/lib/utils'; // For email validation
import { USER_ROLES } from '@/lib/constants'; // Import user roles constants
import { getSessionCompanyId } from './auth';

// GET /api/vendors - Soo deji dhammaan iibiyayaasha
export async function GET(request: Request) {
  try {
    const companyId = await getSessionCompanyId();
    const vendors = await prisma.vendor.findMany({
      where: { companyId },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error) {
    console.error('Cilad ayaa dhacday marka iibiyayaasha la soo gelinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// POST /api/vendors - Ku dar iibiye cusub
export async function POST(request: Request) {
  try {
    const companyId = await getSessionCompanyId();
    const { 
      name, type, phone, email, address, productsServices, notes
    } = await request.json();
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
    const existingVendor = await prisma.vendor.findUnique({
      where: { 
        name_companyId: { 
          name: name, 
          companyId
        } 
      }, 
    });
    if (existingVendor) {
      return NextResponse.json(
        { message: 'Iibiyahan horey ayuu u jiray.' },
        { status: 409 }
      );
    }
    const newVendor = await prisma.vendor.create({
      data: {
        name,
        type,
        phone: phone || null,
        email: email || null,
        address: address || null,
        productsServices: productsServices || null,
        notes: notes || null,
        companyId,
      },
    });
    return NextResponse.json(
      { message: 'Iibiyaha si guul leh ayaa loo daray!', vendor: newVendor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('SERVER ERROR: Cilad ayaa dhacday marka iibiyaha la darayay:', error);
    return NextResponse.json(
      { message: `Cilad server ayaa dhacday: ${error.message || 'Fadlan isku day mar kale.'}` },
      { status: 500 }
    );
  }
}
