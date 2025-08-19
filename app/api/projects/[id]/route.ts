import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { PROJECT_STATUSES } from '@/lib/constants';
import { getSessionCompanyId } from './auth';

// GET /api/projects/[id] - Get single project with all relations
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const companyId = await getSessionCompanyId();
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        expenses: true,
        transactions: true,
        materialsUsed: true,
        laborRecords: true,
        documents: true,
        payments: true,
        members: { select: { id: true, fullName: true, email: true, role: true } },
        tasks: true,
        company: { select: { id: true, name: true } },
      },
    });
    if (!project || project.companyId !== companyId) {
      return NextResponse.json({ message: 'Mashruuca lama helin.' }, { status: 404 });
    }
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Cilad ayaa dhacday marka mashruuca la helayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const companyId = await getSessionCompanyId();
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.companyId !== companyId) {
      return NextResponse.json({ message: 'Mashruuca lama helin.' }, { status: 404 });
    }
    const {
      name, description, agreementAmount, advancePaid, projectType,
      expectedCompletionDate, notes, customerId, status,
    } = await request.json();
    if (!name || !agreementAmount || !projectType || !expectedCompletionDate || !customerId) {
      return NextResponse.json(
        { message: 'Fadlan buuxi dhammaan beeraha waajibka ah.' },
        { status: 400 }
      );
    }
    const customer = await prisma.customer.findUnique({ where: { id: customerId, companyId } });
    if (!customer) {
      return NextResponse.json({ message: 'Macmiilka lama helin.' }, { status: 400 });
    }
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        agreementAmount: parseFloat(agreementAmount),
        advancePaid: parseFloat(advancePaid || 0),
        remainingAmount: parseFloat(agreementAmount) - parseFloat(advancePaid || 0),
        projectType,
        status: status || PROJECT_STATUSES.ACTIVE,
        expectedCompletionDate: new Date(expectedCompletionDate),
        notes,
        customerId,
      },
    });
    return NextResponse.json(
      { message: 'Mashruuca waa la cusboonaysiiyay!', project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cilad ayaa dhacday marka mashruuca la cusboonaysiinayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const companyId = await getSessionCompanyId();
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.companyId !== companyId) {
      return NextResponse.json({ message: 'Mashruuca lama helin.' }, { status: 404 });
    }
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: 'Mashruuca waa la tirtiray.' }, { status: 200 });
  } catch (error) {
    console.error('Cilad ayaa dhacday marka mashruuca la tirtirayay:', error);
    return NextResponse.json(
      { message: 'Cilad server ayaa dhacday. Fadlan isku day mar kale.' },
      { status: 500 }
    );
  }
}