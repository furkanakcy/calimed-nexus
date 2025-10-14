-- Seed Data for CaliMed Nexus Demo

-- Insert demo organization
INSERT INTO organizations (id, name, slug) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'Ankara Şehir Hastanesi', 'ankara-sehir'),
  ('550e8400-e29b-41d4-a716-446655440001', 'İstanbul Medipol Hastanesi', 'istanbul-medipol');

-- Insert demo users
INSERT INTO users (id, organization_id, email, full_name, role, password_hash) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'admin@ankara-sehir.com', 'Ahmet Yılmaz', 'admin', 'hashed_password'),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'teknisyen@ankara-sehir.com', 'Ayşe Demir', 'technician', 'hashed_password'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'gozlemci@ankara-sehir.com', 'Mehmet Kaya', 'observer', 'hashed_password');

-- Insert demo devices
INSERT INTO devices (id, organization_id, device_name, device_type, manufacturer, model, serial_number, location, department, purchase_date, last_calibration_date, next_calibration_date, status) VALUES
  ('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'EKG Cihazı', 'Kardiyoloji', 'Philips', 'PageWriter TC70', 'PH-2023-001', 'Kardiyoloji Servisi', 'Kardiyoloji', '2023-01-15', '2024-11-01', '2025-11-01', 'active'),
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Hasta Monitörü', 'Yoğun Bakım', 'GE Healthcare', 'CARESCAPE B850', 'GE-2023-045', 'Yoğun Bakım', 'Yoğun Bakım', '2023-03-20', '2024-10-15', '2025-10-15', 'active'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Defibrilatör', 'Acil', 'ZOLL', 'R Series', 'ZL-2022-089', 'Acil Servis', 'Acil Tıp', '2022-06-10', '2024-09-20', '2025-09-20', 'active');

-- Insert demo calibration records
INSERT INTO calibration_records (organization_id, device_id, calibration_date, next_calibration_date, technician_id, calibration_type, result, certificate_number, standards_used) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '2024-11-01', '2025-11-01', '660e8400-e29b-41d4-a716-446655440001', 'routine', 'passed', 'CAL-2024-1001', 'IEC 60601-2-25'),
  ('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', '2024-10-15', '2025-10-15', '660e8400-e29b-41d4-a716-446655440001', 'routine', 'passed', 'CAL-2024-1002', 'IEC 60601-2-49'),
  ('550e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440002', '2024-09-20', '2025-09-20', '660e8400-e29b-41d4-a716-446655440001', 'validation', 'passed', 'CAL-2024-0987', 'IEC 60601-2-4');
