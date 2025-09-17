const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoPassword = await bcrypt.hash('demo123', 10);

  // Check if demo company already exists
  let demoCompany = await prisma.company.findUnique({
    where: { email: 'admin@calimed.com' }
  });

  if (!demoCompany) {
    // Create a demo company
    demoCompany = await prisma.company.create({
      data: {
        name: 'CaliMed Demo Company',
        email: 'admin@calimed.com',
        password: demoPassword,
      },
    });
  }

  // Create demo users for each role
  const demoUsers = [
    {
      name: 'Demo Teknisyen',
      email: 'teknisyen@calimed.com',
      password: demoPassword,
      role: 'technician',
      companyId: demoCompany.id,
    },
    {
      name: 'Demo Hastane',
      email: 'hospital@calimed.com',
      password: demoPassword,
      role: 'hospital',
      companyId: demoCompany.id,
    }
  ];

  for (const userData of demoUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    
    if (!existingUser) {
      await prisma.user.create({
        data: userData,
      });
    }
  }

  // Create a hospital for demo purposes
  let demoHospital = await prisma.hospital.findFirst({
    where: { email: 'hospital@calimed.com', companyId: demoCompany.id }
  });

  if (!demoHospital) {
    demoHospital = await prisma.hospital.create({
      data: {
        name: 'Demo Hastanesi',
        address: 'Demo Adresi',
        phone: '+90 555 123 4567',
        email: 'hospital@calimed.com',
        companyId: demoCompany.id,
      },
    });
  }

  // Create a demo device
  let demoDevice = await prisma.device.findFirst({
    where: { serialNo: 'DEMO-001' }
  });

  if (!demoDevice) {
    demoDevice = await prisma.device.create({
      data: {
        serialNo: 'DEMO-001',
        type: 'ekg',
        model: 'Demo Model',
        brand: 'Demo Brand',
        hospitalId: demoHospital.id,
        companyId: demoCompany.id,
      },
    });
  }

  console.log('Demo data seeded successfully:', { 
    company: demoCompany.name, 
    hospital: demoHospital.name, 
    device: demoDevice.serialNo 
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
