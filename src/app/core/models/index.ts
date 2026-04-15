// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

// Role
export interface Role {
  roleId: number;
  roleName: string;
  createdAt: string;
}

// User
export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  roleId: number;
}

export interface UserResponse {
  userId: number;
  name: string;
  email: string;
  phone: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

// Payer
export interface Payer {
  payerId: number;
  payerName: string;
}

// Patient & Insurance
export interface PatientInsuranceRequest {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  payerName: string;
  policyNumber: string;
  coverageDetails: string;
  coverageLimit: number;
  eligibilityStatus: 'ACTIVE' | 'INACTIVE';
}

export interface PatientInsuranceResponse {
  patientId: number;
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  visitedDoctor: boolean;
  payerId: number;
  payerName: string;
  insuranceId: number;
  policyNumber: string;
  coverageDetails: string;
  coverageLimit: number;
  eligibilityStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface InsuranceResponse {
  insuranceId: number;
  payerId: number;
  payerName: string;
  policyNumber: string;
  coverageDetails: string;
  coverageLimit: number;
  eligibilityStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// Encounter
export interface EncounterRequest {
  patientId: number;
  serviceDate: string;
  diagnosisNotes: string;
}

export interface EncounterResponse {
  encounterId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  serviceDate: string;
  diagnosisNotes: string;
  charged: boolean;
  createdAt: string;
}

// Charge Entry
export interface ChargeEntryRequest {
  encounterId: number;
  icdCode: string;
  cptCode: string;
  units: number;
}

export interface ChargeEntryResponse {
  chargeId: number;
  encounterId: number;
  icdCode: string;
  icdDescription: string;
  cptCode: string;
  cptDescription: string;
  units: number;
  chargeAmount: number;
  createdAt: string;
}

export interface IcdMaster {
  icdCode: string;
  description: string;
  isActive: boolean;
}

export interface CptMaster {
  cptCode: string;
  description: string;
  defaultCharge: number;
  isActive: boolean;
}

// Claim
export interface ClaimRequest {
  encounterId: number;
  payerId: number;
}

export interface ClaimResponse {
  claimId: number;
  encounterId: number;
  patientId: number;
  patientName: string;
  payerId: number;
  payerName: string;
  claimNumber: string;
  status: string;
  totalBilledAmount: number;
  approvedAmount: number;
  decisionReasons: string[];
  createdAt: string;
  previousStatus: string;
  statusChangedAt: string;
  statusChangedByUserId: number;
}

// Payment
export interface PaymentRequest {
  claimId: number;
  transactionReference: string;
  adjustmentReason: string;
}

export interface PaymentResponse {
  paymentId: number;
  claimId: number;
  claimNumber: string;
  claimStatus: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  payerName: string;
  policyNumber: string;
  coverageLimit: number;
  serviceDate: string;
  totalBilledAmount: number;
  approvedAmount: number;
  insurancePayment: number;
  patientPayment: number;
  adjustmentAmount: number;
  adjustmentReason: string;
  transactionReference: string;
  datePosted: string;
  postedBy: string;
  createdAt: string;
}

// Denial
export interface DenialResponse {
  denialId: number;
  claimId: number;
  claimNumber: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  denialDate: string;
  reasonCode: string;
  category: string;
  scrubReasons: string[];
  detailedReason: string;
  status: string;
  verifiedByName: string;
  verifiedAt: string;
  createdAt: string;
}

export interface VerifyDenialRequest {
  reasonCode: string;
  category: string;
  detailedReason: string;
}

// Dashboard
export interface DashboardResponse {
  totalBilledAmount: number;
  totalInsurancePayments: number;
  totalPatientPayments: number;
  totalAdjustments: number;
  totalClaims: number;
  draftClaims: number;
  approvedClaims: number;
  deniedClaims: number;
  processedClaims: number;
  denialRate: number;
  paymentPieChart: PieChartData;
  denialByReasonChart: BarChartData;
  denialByCategoryChart: BarChartData;
  claimStatusChart: BarChartData;
}

export interface PieChartData {
  labels: string[];
  values: number[];
  percentages: number[];
  total: number;
}

export interface BarChartData {
  title: string;
  labels: string[];
  values: number[];
}

// Audit Log
export interface AuditLog {
  auditId: number;
  userId: number;
  entityType: string;
  entityId: number;
  actionType: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
}
