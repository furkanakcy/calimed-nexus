// Manual seed script - Render console'da çalıştır
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function quickSeed() {
  try {
    console.log('🌱 Starting manual seed...');
    
    const demoPassword = await bcrypt.hash('demo123', 10);
    
    // Create demo company
    const demoCompany = await prisma.company.upsert({
      where: { email: 'admin@calimed.com' },
      update: {},
      create: {
        name: 'CaliMed Demo Company',
        email: 'admin@calimed.com',
        password: demoPassword,
      },
    });
    
    console.log('✅ Demo company created:', demoCompany.name);
    
    // Create demo users
    const users = [
      { name: 'Demo Teknisyen', email: 'teknisyen@calimed.com', role: 'technician' },
      { name: 'Demo Hastane', email: 'hospital@calimed.com', role: 'hospital' }
    ];
    
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          password: demoPassword,
          companyId: demoCompany.id,
        },
      });
      console.log('✅ User created:', user.email);
    }
    
    console.log('🎉 Manual seed completed successfully!');
    console.log('📧 Login credentials:');
    console.log('   admin@calimed.com / demo123');
    console.log('   teknisyen@calimed.com / demo123');
    console.log('   hospital@calimed.com / demo123');
    
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();