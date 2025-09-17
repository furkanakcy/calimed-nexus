const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for authentication and RBAC
const authenticateToken = (roles = []) => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Handle demo tokens
    if (token.startsWith('demo-token-')) {
      const role = token.replace('demo-token-', '');
      req.user = {
        userId: 0,
        email: `${role}@calimed.com`,
        role: role,
        companyId: 0
      };
      
      // If roles are specified, check authorization
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // If roles are specified, check authorization
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
// Company Registration
app.post('/api/companies/register', async (req, res) => {
  const { name, email, password, logo } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        logo,
      },
    });
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Registration
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role, companyId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyId: parseInt(companyId),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // First try to find user
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role, companyId: user.companyId },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({ 
        token, 
        role: user.role, 
        companyId: user.companyId,
        userId: user.id,
        name: user.name
      });
    }

    // If not found in users, try company (admin login)
    const company = await prisma.company.findUnique({ where: { email } });
    if (company && (await bcrypt.compare(password, company.password))) {
      const token = jwt.sign(
        { userId: company.id, email: company.email, role: 'admin', companyId: company.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({ 
        token, 
        role: 'admin', 
        companyId: company.id,
        userId: company.id,
        name: company.name
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Management (Admin only)
app.get('/api/users', authenticateToken(['admin']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user.companyId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users', authenticateToken(['admin']), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        companyId: req.user.companyId,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Hospital Management (Admin, Technician)
app.get('/api/hospitals', authenticateToken(['admin', 'technician']), async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: { companyId: req.user.companyId },
    });
    res.json(hospitals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/hospitals', authenticateToken(['admin']), async (req, res) => {
  const { name, address, phone, email } = req.body;
  try {
    const hospital = await prisma.hospital.create({
      data: {
        name,
        address,
        phone,
        email,
        companyId: req.user.companyId,
      },
    });
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Device Management (Admin, Technician, Hospital)
app.get('/api/devices', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  try {
    const whereClause = { companyId: req.user.companyId };
    
    if (req.user.role === 'hospital') {
      // For hospital users, find their associated hospital
      const hospitalUser = await prisma.hospital.findFirst({
        where: { email: req.user.email, companyId: req.user.companyId }
      });
      if (hospitalUser) {
        whereClause.hospitalId = hospitalUser.id;
      } else {
        // If no specific hospital found, return empty array
        return res.json([]);
      }
    }
    
    const devices = await prisma.device.findMany({
      where: whereClause,
      include: { hospital: true },
    });
    res.json(devices);
  } catch (error) {
    console.error('Device fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add device endpoint
app.post('/api/devices', authenticateToken(['admin']), async (req, res) => {
  const { serialNo, type, model, brand, hospitalId } = req.body;
  try {
    const device = await prisma.device.create({
      data: {
        serialNo,
        type,
        model,
        brand,
        hospitalId: parseInt(hospitalId),
        companyId: req.user.companyId,
      },
      include: { hospital: true }
    });
    res.status(201).json(device);
  } catch (error) {
    console.error('Device creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user endpoint
app.put('/api/users/:id', authenticateToken(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await prisma.user.update({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId // Ensure user belongs to same company
      },
      data: { name, email, role },
    });
    res.json(user);
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user endpoint
app.delete('/api/users/:id', authenticateToken(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId // Ensure user belongs to same company
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update hospital endpoint
app.put('/api/hospitals/:id', authenticateToken(['admin']), async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;
  try {
    const hospital = await prisma.hospital.update({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId
      },
      data: { name, address, phone, email },
    });
    res.json(hospital);
  } catch (error) {
    console.error('Hospital update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete hospital endpoint
app.delete('/api/hospitals/:id', authenticateToken(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.hospital.delete({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Hospital deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calibration (Technician only)
app.post('/api/calibrations', authenticateToken(['technician']), async (req, res) => {
  const { deviceId, hospitalId, environmentTemp, environmentHumidity, status, results } = req.body;
  try {
    const calibration = await prisma.calibration.create({
      data: {
        deviceId: parseInt(deviceId),
        technicianId: req.user.userId,
        hospitalId: parseInt(hospitalId),
        companyId: req.user.companyId,
        environmentTemp: parseFloat(environmentTemp),
        environmentHumidity: parseFloat(environmentHumidity),
        status,
        results: {
          create: results.map(r => ({
            testName: r.testName,
            measuredValue: parseFloat(r.measuredValue),
            expectedValue: parseFloat(r.expectedValue),
            tolerance: parseFloat(r.tolerance),
            passed: r.passed,
          })),
        },
      },
      include: { results: true },
    });
    res.status(201).json(calibration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/calibrations', authenticateToken(['admin', 'technician']), async (req, res) => {
  try {
    const whereClause = { companyId: req.user.companyId };
    if (req.user.role === 'technician') {
      whereClause.technicianId = req.user.userId;
    }
    const calibrations = await prisma.calibration.findMany({
      where: whereClause,
      include: { device: true, technician: true, hospital: true },
    });
    res.json(calibrations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Report Management (Technician, Admin)
app.post('/api/reports/generate/:id', authenticateToken(['admin', 'technician']), async (req, res) => {
  const { id } = req.params;
  const { digitalSignature } = req.body; // Optional
  try {
    const calibration = await prisma.calibration.findUnique({
      where: { id: parseInt(id), companyId: req.user.companyId },
      include: {
        device: { include: { hospital: true } },
        technician: true,
        hospital: true,
        results: true,
      },
    });

    if (!calibration) {
      return res.status(404).json({ error: 'Calibration not found or not authorized.' });
    }

    // Generate PDF (simplified for now, actual Puppeteer logic would go here)
    const reportFileName = `CAL-${calibration.createdAt.getFullYear()}-${calibration.id}.pdf`;
    const pdfUrl = `/reports/${reportFileName}`; // Placeholder path

    const report = await prisma.report.create({
      data: {
        calibrationId: calibration.id,
        pdfUrl,
        digitalSignature,
      },
    });

    res.status(201).json({ message: 'Report generated and saved.', report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports/:id', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  const { id } = req.params;
  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) },
      include: { calibration: true },
    });

    if (!report || report.calibration.companyId !== req.user.companyId) {
      return res.status(404).json({ error: 'Report not found or not authorized.' });
    }

    // In a real application, you would serve the PDF file from storage (e.g., AWS S3 or local /reports folder)
    // For now, we'll just return the URL
    res.json({ pdfUrl: report.pdfUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Service Order Management
app.post('/api/service-orders', authenticateToken(['admin', 'technician']), async (req, res) => {
  const { description, status, priority, scheduledDate, completedDate, hospitalId, deviceId, technicianId } = req.body;
  try {
    const serviceOrder = await prisma.serviceOrder.create({
      data: {
        description,
        status,
        priority,
        scheduledDate,
        completedDate,
        companyId: req.user.companyId,
        hospitalId,
        deviceId,
        technicianId,
      },
    });
    res.status(201).json(serviceOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/service-orders', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  try {
    const serviceOrders = await prisma.serviceOrder.findMany({
      where: { companyId: req.user.companyId },
    });
    res.json(serviceOrders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Validation Management
app.post('/api/validations', authenticateToken(['admin', 'technician']), async (req, res) => {
  const { validationType, status, results, hospitalId, deviceId, technicianId } = req.body;
  try {
    const validation = await prisma.validation.create({
      data: {
        validationType,
        status,
        results,
        companyId: req.user.companyId,
        hospitalId,
        deviceId,
        technicianId,
      },
    });
    res.status(201).json(validation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/validations', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  try {
    const validations = await prisma.validation.findMany({
      where: { companyId: req.user.companyId },
    });
    res.json(validations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Planning Management
app.post('/api/plannings', authenticateToken(['admin']), async (req, res) => {
  const { planType, description, startDate, endDate, status, hospitalId, deviceId, assignedToId } = req.body;
  try {
    const planning = await prisma.planning.create({
      data: {
        planType,
        description,
        startDate,
        endDate,
        status,
        companyId: req.user.companyId,
        hospitalId,
        deviceId,
        assignedToId,
      },
    });
    res.status(201).json(planning);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/plannings', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  try {
    const plannings = await prisma.planning.findMany({
      where: { companyId: req.user.companyId },
    });
    res.json(plannings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// HVAC Report Management
app.post('/api/hvac-reports', authenticateToken(['admin', 'technician']), async (req, res) => {
  const { generalInfo, rooms, testData, hospitalId } = req.body;
  
  console.log('HVAC Report creation request:', {
    user: req.user,
    generalInfo,
    hospitalId,
    roomsCount: rooms?.length,
    testDataKeys: testData ? Object.keys(testData) : []
  });

  try {
    // Validate required fields
    if (!generalInfo || !rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: generalInfo, rooms' });
    }

    // Validate hospital selection
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital selection is required' });
    }

    // For demo users, we'll create a simple record without foreign key constraints
    if (req.user.companyId === 0) {
      // Demo mode - create without relations
      const hvacReport = {
        id: Date.now(),
        hospitalId: hospitalId,
        hospitalName: generalInfo.hospitalName,
        reportNo: generalInfo.reportNo,
        measurementDate: generalInfo.measurementDate,
        testerName: generalInfo.testerName,
        preparedBy: generalInfo.preparedBy,
        approvedBy: generalInfo.approvedBy,
        organizationName: generalInfo.organizationName,
        rooms: rooms.map(room => ({
          ...room,
          testData: testData[room.id] || null
        })),
        createdAt: new Date().toISOString()
      };
      
      console.log('Demo HVAC Report created:', hvacReport.id);
      return res.status(201).json(hvacReport);
    }

    // Verify hospital belongs to user's company
    const hospital = await prisma.hospital.findFirst({
      where: { 
        id: parseInt(hospitalId),
        companyId: req.user.companyId 
      }
    });

    if (!hospital) {
      return res.status(403).json({ error: 'Hospital not found or not authorized' });
    }

    const hvacReport = await prisma.hVACReport.create({
      data: {
        hospitalName: hospital.name, // Use hospital name from database
        hospitalId: parseInt(hospitalId),
        reportNo: generalInfo.reportNo,
        measurementDate: new Date(generalInfo.measurementDate),
        testerName: generalInfo.testerName,
        preparedBy: generalInfo.preparedBy,
        approvedBy: generalInfo.approvedBy,
        organizationName: generalInfo.organizationName,
        logo: generalInfo.logo || null,
        stamp: generalInfo.stamp || null,
        companyId: req.user.companyId,
        createdById: req.user.userId,
        rooms: {
          create: rooms.map(room => ({
            roomNo: room.roomNo,
            roomName: room.roomName,
            surfaceArea: parseFloat(room.surfaceArea),
            height: parseFloat(room.height),
            volume: parseFloat(room.volume),
            testMode: room.testMode,
            flowType: room.flowType,
            roomClass: room.roomClass,
            testData: testData[room.id] ? JSON.stringify(testData[room.id]) : null
          }))
        }
      },
      include: {
        rooms: true,
        hospital: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    console.log('HVAC Report created successfully:', hvacReport.id);
    res.status(201).json(hvacReport);
  } catch (error) {
    console.error('HVAC Report creation error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: `Database error: ${error.message}` });
  }
});

app.get('/api/hvac-reports', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  try {
    let whereClause = { companyId: req.user.companyId };

    // Role-based filtering
    if (req.user.role === 'technician') {
      // Technicians can only see their own reports
      whereClause.createdById = req.user.userId;
    } else if (req.user.role === 'hospital') {
      // Hospital users can only see reports for their hospital
      const hospitalUser = await prisma.hospital.findFirst({
        where: { email: req.user.email, companyId: req.user.companyId }
      });
      if (hospitalUser) {
        whereClause.hospitalId = hospitalUser.id;
      } else {
        // If no specific hospital found, return empty array
        return res.json([]);
      }
    }
    // Admin can see all reports (no additional filtering)

    const hvacReports = await prisma.hVACReport.findMany({
      where: whereClause,
      include: {
        rooms: true,
        hospital: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(hvacReports);
  } catch (error) {
    console.error('HVAC Reports fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/hvac-reports/:id', authenticateToken(['admin', 'technician', 'hospital']), async (req, res) => {
  const { id } = req.params;
  try {
    const hvacReport = await prisma.hVACReport.findUnique({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId 
      },
      include: {
        rooms: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!hvacReport) {
      return res.status(404).json({ error: 'HVAC Report not found' });
    }

    res.json(hvacReport);
  } catch (error) {
    console.error('HVAC Report fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/hvac-reports/:id', authenticateToken(['admin', 'technician']), async (req, res) => {
  const { id } = req.params;
  try {
    // First delete related rooms
    await prisma.hVACRoom.deleteMany({
      where: { reportId: parseInt(id) }
    });
    
    // Then delete the report
    await prisma.hVACReport.delete({
      where: { 
        id: parseInt(id),
        companyId: req.user.companyId 
      }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('HVAC Report deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoints (must be before static file serving)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: prisma ? 'connected' : 'disconnected',
    port: process.env.PORT || 5000,
    version: '1.0.1'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: prisma ? 'connected' : 'disconnected',
    api: 'CaliMed Nexus API v1.0.0'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  console.log(`Serving static files from: ${publicPath}`);
  
  // Check if public directory exists
  const fs = require('fs');
  if (fs.existsSync(publicPath)) {
    console.log('Public directory exists');
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('index.html found');
    } else {
      console.log('WARNING: index.html not found!');
    }
  } else {
    console.log('WARNING: Public directory does not exist!');
  }
  
  // Serve static files
  app.use(express.static(publicPath, {
    maxAge: '1d',
    etag: false
  }));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Application not found. Build may have failed.');
    }
  });
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    prisma.$disconnect();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    prisma.$disconnect();
  });
});
