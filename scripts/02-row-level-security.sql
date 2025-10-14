-- Row Level Security (RLS) Policies for Multi-Tenant Isolation

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE calibration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY org_isolation_policy ON organizations
  FOR ALL
  USING (id = current_setting('app.current_organization_id')::UUID);

-- Users: Can only see users in their organization
CREATE POLICY users_isolation_policy ON users
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Devices: Can only see devices in their organization
CREATE POLICY devices_isolation_policy ON devices
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Calibration Records: Can only see records in their organization
CREATE POLICY calibration_isolation_policy ON calibration_records
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Audit Logs: Can only see logs in their organization
CREATE POLICY audit_isolation_policy ON audit_logs
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Role-based permissions
-- Super Admin: Full access to everything
-- Admin: Full access within their organization
-- Technician: Can view and create calibration records, view devices
-- Observer: Read-only access
