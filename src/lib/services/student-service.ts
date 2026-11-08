/**
 * ZenCro Student Service
 * 
 * Loosely coupled service layer for Student Management and Student 360.
 * Follows the Day 1-7 Mock Service Architecture & Day 8 API Contract.
 * 
 * Supported API contracts:
 * - GET /api/students?class_id&section_id&search&page&page_size -> { students: [...], total: number }
 * - POST /api/students -> { student: Student, guardians: Guardian[] }
 * - PATCH /api/students/:id -> { student: Student }
 * - GET /api/students/:id/360?academic_year_id -> Student360
 */

import {
  Student,
  Guardian,
  StudentListItem,
  StudentListResponse,
  StudentFormData,
  Student360,
  StudentFilters,
  AttendanceSummary,
  FeeSummary,
  AcademicSummary,
  StudentFormItem,
  PtmSummary,
  StudentActivity,
  StudentDocument,
} from '@/types/student';

// Initial realistic fictional student records (Greenwood High / Delhi Public Academy)
export const INITIAL_STUDENTS: (Student & { guardians: Guardian[] })[] = [
  {
    id: 'std_01',
    admission_no: 'ADM-2026-0101',
    first_name: 'Aryan',
    last_name: 'Sharma',
    dob: '2010-05-14',
    gender: 'male',
    class_id: 'cls_10',
    section_id: 'sec_10_a',
    class_name: 'Class 10',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'aryan.sharma@student.dpa.edu.in',
    phone: '+91 98101 23456',
    address: 'B-42, Gulmohar Park, New Delhi 110049',
    blood_group: 'B+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98101 23456 (Father)',
    avatar_url: '',
    enrollment_date: '2020-04-01',
    documents: [
      { id: 'doc_1', title: 'Birth Certificate', type: 'PDF', file_name: 'birth_certificate_aryan.pdf', uploaded_at: '2020-04-01', status: 'verified' },
      { id: 'doc_2', title: 'Previous School Transfer Certificate (TC)', type: 'PDF', file_name: 'tc_delhi_public.pdf', uploaded_at: '2020-04-01', status: 'verified' },
      { id: 'doc_3', title: 'Aadhaar / National ID', type: 'PDF', file_name: 'aadhaar_scan.pdf', uploaded_at: '2020-04-01', status: 'verified' },
      { id: 'doc_4', title: 'Immunization & Health Record', type: 'PDF', file_name: 'health_card_2026.pdf', uploaded_at: '2026-01-15', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_01_1',
        student_id: 'std_01',
        name: 'Dr. Ramesh Sharma',
        relationship: 'Father',
        phone: '+91 98101 23456',
        email: 'ramesh.sharma@aiims.edu.in',
        occupation: 'Senior Physician & Cardiologist',
        is_primary: true,
        address: 'B-42, Gulmohar Park, New Delhi 110049',
      },
      {
        id: 'grd_01_2',
        student_id: 'std_01',
        name: 'Dr. Sunita Sharma',
        relationship: 'Mother',
        phone: '+91 98101 65432',
        email: 'sunita.sharma@health.gov.in',
        occupation: 'Professor of Pathology',
        is_primary: false,
        address: 'B-42, Gulmohar Park, New Delhi 110049',
      },
    ],
  },
  {
    id: 'std_02',
    admission_no: 'ADM-2026-0102',
    first_name: 'Ananya',
    last_name: 'Iyer',
    dob: '2010-08-22',
    gender: 'female',
    class_id: 'cls_10',
    section_id: 'sec_10_a',
    class_name: 'Class 10',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'ananya.iyer@student.dpa.edu.in',
    phone: '+91 98711 44556',
    address: 'C-12, Mayur Vihar Phase 1, New Delhi 110091',
    blood_group: 'O+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98711 44556 (Mother)',
    avatar_url: '',
    enrollment_date: '2021-04-01',
    documents: [
      { id: 'doc_5', title: 'Birth Certificate', type: 'PDF', file_name: 'birth_cert_ananya.pdf', uploaded_at: '2021-04-01', status: 'verified' },
      { id: 'doc_6', title: 'Aadhaar Identification', type: 'PDF', file_name: 'aadhaar_ananya.pdf', uploaded_at: '2021-04-01', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_02_1',
        student_id: 'std_02',
        name: 'Mrs. Vidya Iyer',
        relationship: 'Mother',
        phone: '+91 98711 44556',
        email: 'vidya.iyer@techcorp.com',
        occupation: 'Software Architect',
        is_primary: true,
        address: 'C-12, Mayur Vihar Phase 1, New Delhi 110091',
      },
      {
        id: 'grd_02_2',
        student_id: 'std_02',
        name: 'Mr. Sundaram Iyer',
        relationship: 'Father',
        phone: '+91 98711 99887',
        email: 'sundaram.i@finadvisors.in',
        occupation: 'Chartered Accountant',
        is_primary: false,
        address: 'C-12, Mayur Vihar Phase 1, New Delhi 110091',
      },
    ],
  },
  {
    id: 'std_03',
    admission_no: 'ADM-2026-0103',
    first_name: 'Rohan',
    last_name: 'Verma',
    dob: '2010-11-03',
    gender: 'male',
    class_id: 'cls_10',
    section_id: 'sec_10_b',
    class_name: 'Class 10',
    section_name: 'Section B',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'rohan.verma@student.dpa.edu.in',
    phone: '+91 98112 33445',
    address: '45-A, Hauz Khas Enclave, New Delhi 110016',
    blood_group: 'A+',
    category: 'OBC',
    religion: 'Hindu',
    emergency_contact: '+91 98112 33445 (Father)',
    avatar_url: '',
    enrollment_date: '2019-04-01',
    documents: [
      { id: 'doc_7', title: 'Birth Certificate', type: 'PDF', file_name: 'birth_rohan.pdf', uploaded_at: '2019-04-01', status: 'verified' },
      { id: 'doc_8', title: 'Category Certificate (OBC)', type: 'PDF', file_name: 'obc_certificate.pdf', uploaded_at: '2019-04-01', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_03_1',
        student_id: 'std_03',
        name: 'Mr. Anil Verma',
        relationship: 'Father',
        phone: '+91 98112 33445',
        email: 'anil.verma@vermagroup.com',
        occupation: 'Civil Contractor & Real Estate',
        is_primary: true,
        address: '45-A, Hauz Khas Enclave, New Delhi 110016',
      },
    ],
  },
  {
    id: 'std_04',
    admission_no: 'ADM-2026-0104',
    first_name: 'Priya',
    last_name: 'Patel',
    dob: '2008-03-19',
    gender: 'female',
    class_id: 'cls_12_sci',
    section_id: 'sec_12_sci_a',
    class_name: 'Class 12 - Science',
    section_name: 'Section A (PCM)',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'priya.patel@student.dpa.edu.in',
    phone: '+91 98200 11223',
    address: 'Flat 402, Lotus Heights, Saket, New Delhi 110017',
    blood_group: 'AB+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98200 11223 (Father)',
    avatar_url: '',
    enrollment_date: '2024-04-01',
    documents: [
      { id: 'doc_9', title: 'Class 10 CBSE Board Marksheet', type: 'PDF', file_name: 'cbse_10_marksheet_priya.pdf', uploaded_at: '2024-04-01', status: 'verified' },
      { id: 'doc_10', title: 'Migration & Character Certificate', type: 'PDF', file_name: 'migration_cert.pdf', uploaded_at: '2024-04-01', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_04_1',
        student_id: 'std_04',
        name: 'Mr. Jagdish Patel',
        relationship: 'Father',
        phone: '+91 98200 11223',
        email: 'jagdish.patel@patelpharm.in',
        occupation: 'Pharmaceutical Director',
        is_primary: true,
        address: 'Flat 402, Lotus Heights, Saket, New Delhi 110017',
      },
    ],
  },
  {
    id: 'std_05',
    admission_no: 'ADM-2026-0105',
    first_name: 'Kabir',
    last_name: 'Sen',
    dob: '2008-07-11',
    gender: 'male',
    class_id: 'cls_12_com',
    section_id: 'sec_12_com_a',
    class_name: 'Class 12 - Commerce',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'kabir.sen@student.dpa.edu.in',
    phone: '+91 98300 77889',
    address: 'D-8, Greater Kailash 1, New Delhi 110048',
    blood_group: 'O-',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98300 77889 (Mother)',
    avatar_url: '',
    enrollment_date: '2024-04-01',
    documents: [
      { id: 'doc_11', title: 'Class 10 AISSE Marksheet', type: 'PDF', file_name: 'class10_marks_kabir.pdf', uploaded_at: '2024-04-01', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_05_1',
        student_id: 'std_05',
        name: 'Mrs. Nandita Sen',
        relationship: 'Mother',
        phone: '+91 98300 77889',
        email: 'nandita.sen@mediaworks.com',
        occupation: 'Managing Editor & Journalist',
        is_primary: true,
        address: 'D-8, Greater Kailash 1, New Delhi 110048',
      },
    ],
  },
  {
    id: 'std_06',
    admission_no: 'ADM-2026-0106',
    first_name: 'Sneha',
    last_name: 'Mukhopadhyay',
    dob: '2011-02-14',
    gender: 'female',
    class_id: 'cls_9',
    section_id: 'sec_10_c',
    class_name: 'Class 9',
    section_name: 'Section C',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'sneha.m@student.dpa.edu.in',
    phone: '+91 98188 66778',
    address: 'Plot 104, CR Park, New Delhi 110019',
    blood_group: 'B+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98188 66778 (Father)',
    avatar_url: '',
    enrollment_date: '2020-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_06_1',
        student_id: 'std_06',
        name: 'Mr. Subir Mukhopadhyay',
        relationship: 'Father',
        phone: '+91 98188 66778',
        email: 'subir.m@delhiuniv.ac.in',
        occupation: 'Associate Professor',
        is_primary: true,
        address: 'Plot 104, CR Park, New Delhi 110019',
      },
    ],
  },
  {
    id: 'std_07',
    admission_no: 'ADM-2026-0107',
    first_name: 'Aarav',
    last_name: 'Gupta',
    dob: '2022-09-10',
    gender: 'male',
    class_id: 'cls_nur',
    section_id: 'sec_nur_a',
    class_name: 'Nursery',
    section_name: 'Section Lotus',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'aarav.g@student.dpa.edu.in',
    phone: '+91 98100 44332',
    address: 'E-55, Vasant Vihar, New Delhi 110057',
    blood_group: 'A+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98100 44332 (Father)',
    avatar_url: '',
    enrollment_date: '2026-01-10',
    documents: [
      { id: 'doc_12', title: 'Municipal Birth Certificate', type: 'PDF', file_name: 'birth_aarav.pdf', uploaded_at: '2026-01-10', status: 'verified' },
      { id: 'doc_13', title: 'Vaccination History Card', type: 'PDF', file_name: 'vaccine_record.pdf', uploaded_at: '2026-01-10', status: 'verified' },
    ],
    guardians: [
      {
        id: 'grd_07_1',
        student_id: 'std_07',
        name: 'Mr. Nitin Gupta',
        relationship: 'Father',
        phone: '+91 98100 44332',
        email: 'nitin.gupta@fintechlabs.in',
        occupation: 'Investment Banker',
        is_primary: true,
        address: 'E-55, Vasant Vihar, New Delhi 110057',
      },
    ],
  },
  {
    id: 'std_08',
    admission_no: 'ADM-2026-0108',
    first_name: 'Ishaan',
    last_name: 'Malhotra',
    dob: '2020-04-12',
    gender: 'male',
    class_id: 'cls_1',
    section_id: 'sec_10_a',
    class_name: 'Class 1',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'ishaan.m@student.dpa.edu.in',
    phone: '+91 98105 11998',
    address: '77, Defence Colony, New Delhi 110024',
    blood_group: 'B-',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98105 11998 (Mother)',
    avatar_url: '',
    enrollment_date: '2025-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_08_1',
        student_id: 'std_08',
        name: 'Mrs. Radhika Malhotra',
        relationship: 'Mother',
        phone: '+91 98105 11998',
        email: 'radhika.m@malhotradesign.com',
        occupation: 'Interior Architect',
        is_primary: true,
        address: '77, Defence Colony, New Delhi 110024',
      },
    ],
  },
  {
    id: 'std_09',
    admission_no: 'ADM-2026-0109',
    first_name: 'Diya',
    last_name: 'Sundaram',
    dob: '2016-06-25',
    gender: 'female',
    class_id: 'cls_5',
    section_id: 'sec_10_b',
    class_name: 'Class 5',
    section_name: 'Section B',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'diya.s@student.dpa.edu.in',
    phone: '+91 98114 55667',
    address: 'A-21, Green Park Extension, New Delhi 110016',
    blood_group: 'O+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98114 55667 (Father)',
    avatar_url: '',
    enrollment_date: '2021-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_09_1',
        student_id: 'std_09',
        name: 'Mr. Raghavan Sundaram',
        relationship: 'Father',
        phone: '+91 98114 55667',
        email: 'raghavan.s@iitd.ac.in',
        occupation: 'Research Scientist',
        is_primary: true,
        address: 'A-21, Green Park Extension, New Delhi 110016',
      },
    ],
  },
  {
    id: 'std_10',
    admission_no: 'ADM-2026-0110',
    first_name: 'Vihaan',
    last_name: 'Joshi',
    dob: '2013-10-18',
    gender: 'male',
    class_id: 'cls_8',
    section_id: 'sec_10_a',
    class_name: 'Class 8',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'vihaan.j@student.dpa.edu.in',
    phone: '+91 98117 88990',
    address: 'H-14, Model Town 2, New Delhi 110009',
    blood_group: 'A+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98117 88990 (Father)',
    avatar_url: '',
    enrollment_date: '2021-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_10_1',
        student_id: 'std_10',
        name: 'Mr. Manoj Joshi',
        relationship: 'Father',
        phone: '+91 98117 88990',
        email: 'manoj.joshi@joshilegal.com',
        occupation: 'Advocate - High Court of Delhi',
        is_primary: true,
        address: 'H-14, Model Town 2, New Delhi 110009',
      },
    ],
  },
  {
    id: 'std_11',
    admission_no: 'ADM-2026-0111',
    first_name: 'Riya',
    last_name: 'Mukherjee',
    dob: '2010-12-05',
    gender: 'female',
    class_id: 'cls_10',
    section_id: 'sec_10_c',
    class_name: 'Class 10',
    section_name: 'Section C',
    academic_year_id: 'ay_2026_27',
    status: 'inactive',
    email: 'riya.m@student.dpa.edu.in',
    phone: '+91 98109 77665',
    address: 'K-90, Kalkaji, New Delhi 110019',
    blood_group: 'AB-',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98109 77665 (Father)',
    avatar_url: '',
    enrollment_date: '2020-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_11_1',
        student_id: 'std_11',
        name: 'Mr. Debashis Mukherjee',
        relationship: 'Father',
        phone: '+91 98109 77665',
        email: 'debashis.m@statbank.in',
        occupation: 'General Manager - Banking',
        is_primary: true,
        address: 'K-90, Kalkaji, New Delhi 110019',
      },
    ],
  },
  {
    id: 'std_12',
    admission_no: 'ADM-2026-0112',
    first_name: 'Aditya',
    last_name: 'Deshmukh',
    dob: '2009-08-30',
    gender: 'male',
    class_id: 'cls_11_sci',
    section_id: 'sec_12_sci_a',
    class_name: 'Class 11 - Science (PCM/PCB)',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'aditya.d@student.dpa.edu.in',
    phone: '+91 98733 22110',
    address: 'B-10, Preet Vihar, New Delhi 110092',
    blood_group: 'O+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98733 22110 (Father)',
    avatar_url: '',
    enrollment_date: '2025-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_12_1',
        student_id: 'std_12',
        name: 'Mr. Sanjay Deshmukh',
        relationship: 'Father',
        phone: '+91 98733 22110',
        email: 'sanjay.d@psuindia.co.in',
        occupation: 'Executive Director - BHEL',
        is_primary: true,
        address: 'B-10, Preet Vihar, New Delhi 110092',
      },
    ],
  },
  {
    id: 'std_13',
    admission_no: 'ADM-2026-0113',
    first_name: 'Tanvi',
    last_name: 'Reddy',
    dob: '2009-01-15',
    gender: 'female',
    class_id: 'cls_11_com',
    section_id: 'sec_12_com_a',
    class_name: 'Class 11 - Commerce',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'tanvi.reddy@student.dpa.edu.in',
    phone: '+91 98118 99001',
    address: '62, Shanti Niketan, New Delhi 110021',
    blood_group: 'B+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98118 99001 (Mother)',
    avatar_url: '',
    enrollment_date: '2025-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_13_1',
        student_id: 'std_13',
        name: 'Mrs. Anuradha Reddy',
        relationship: 'Mother',
        phone: '+91 98118 99001',
        email: 'anuradha.reddy@artworks.in',
        occupation: 'Gallery Curator',
        is_primary: true,
        address: '62, Shanti Niketan, New Delhi 110021',
      },
    ],
  },
  {
    id: 'std_14',
    admission_no: 'ADM-2026-0114',
    first_name: 'Manav',
    last_name: 'Khurana',
    dob: '2008-11-20',
    gender: 'male',
    class_id: 'cls_12_sci',
    section_id: 'sec_12_sci_a',
    class_name: 'Class 12 - Science',
    section_name: 'Section A (PCM)',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'manav.k@student.dpa.edu.in',
    phone: '+91 98102 33445',
    address: '18, Punjabi Bagh West, New Delhi 110026',
    blood_group: 'A+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98102 33445 (Father)',
    avatar_url: '',
    enrollment_date: '2024-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_14_1',
        student_id: 'std_14',
        name: 'Mr. Harpreet Khurana',
        relationship: 'Father',
        phone: '+91 98102 33445',
        email: 'harpreet.k@khuranamotors.com',
        occupation: 'Automotive Dealer',
        is_primary: true,
        address: '18, Punjabi Bagh West, New Delhi 110026',
      },
    ],
  },
  {
    id: 'std_15',
    admission_no: 'ADM-2026-0115',
    first_name: 'Zoya',
    last_name: 'Khan',
    dob: '2010-09-04',
    gender: 'female',
    class_id: 'cls_10',
    section_id: 'sec_10_d',
    class_name: 'Class 10',
    section_name: 'Section D',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'zoya.khan@student.dpa.edu.in',
    phone: '+91 98115 66778',
    address: 'M-34, Jamia Nagar, New Delhi 110025',
    blood_group: 'O+',
    category: 'General',
    religion: 'Muslim',
    emergency_contact: '+91 98115 66778 (Father)',
    avatar_url: '',
    enrollment_date: '2020-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_15_1',
        student_id: 'std_15',
        name: 'Mr. Tariq Khan',
        relationship: 'Father',
        phone: '+91 98115 66778',
        email: 'tariq.khan@archdesign.com',
        occupation: 'Senior Urban Planner',
        is_primary: true,
        address: 'M-34, Jamia Nagar, New Delhi 110025',
      },
    ],
  },
  {
    id: 'std_16',
    admission_no: 'ADM-2026-0116',
    first_name: 'Samarjit',
    last_name: 'Bose',
    dob: '2011-04-16',
    gender: 'male',
    class_id: 'cls_9',
    section_id: 'sec_10_c',
    class_name: 'Class 9',
    section_name: 'Section C',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'samarjit.bose@student.dpa.edu.in',
    phone: '+91 98108 11224',
    address: 'S-12, Panchsheel Park, New Delhi 110017',
    blood_group: 'B+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98108 11224 (Mother)',
    avatar_url: '',
    enrollment_date: '2022-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_16_1',
        student_id: 'std_16',
        name: 'Dr. Sharmila Bose',
        relationship: 'Mother',
        phone: '+91 98108 11224',
        email: 'sharmila.bose@jnu.ac.in',
        occupation: 'Professor of Economics',
        is_primary: true,
        address: 'S-12, Panchsheel Park, New Delhi 110017',
      },
    ],
  },
  {
    id: 'std_17',
    admission_no: 'ADM-2026-0117',
    first_name: 'Meera',
    last_name: 'Nambiar',
    dob: '2016-08-19',
    gender: 'female',
    class_id: 'cls_5',
    section_id: 'sec_10_a',
    class_name: 'Class 5',
    section_name: 'Section A',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'meera.n@student.dpa.edu.in',
    phone: '+91 98710 33221',
    address: 'D-4, Safdarjung Enclave, New Delhi 110029',
    blood_group: 'O-',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98710 33221 (Father)',
    avatar_url: '',
    enrollment_date: '2021-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_17_1',
        student_id: 'std_17',
        name: 'Mr. K. Nambiar',
        relationship: 'Father',
        phone: '+91 98710 33221',
        email: 'k.nambiar@foreignserv.gov.in',
        occupation: 'Deputy Secretary - Ministry of External Affairs',
        is_primary: true,
        address: 'D-4, Safdarjung Enclave, New Delhi 110029',
      },
    ],
  },
  {
    id: 'std_18',
    admission_no: 'ADM-2026-0118',
    first_name: 'Devansh',
    last_name: 'Singhania',
    dob: '2020-10-02',
    gender: 'male',
    class_id: 'cls_1',
    section_id: 'sec_10_b',
    class_name: 'Class 1',
    section_name: 'Section B',
    academic_year_id: 'ay_2026_27',
    status: 'active',
    email: 'devansh.s@student.dpa.edu.in',
    phone: '+91 98111 88776',
    address: '102, Golf Links, New Delhi 110003',
    blood_group: 'A+',
    category: 'General',
    religion: 'Hindu',
    emergency_contact: '+91 98111 88776 (Father)',
    avatar_url: '',
    enrollment_date: '2025-04-01',
    documents: [],
    guardians: [
      {
        id: 'grd_18_1',
        student_id: 'std_18',
        name: 'Mr. Yash Singhania',
        relationship: 'Father',
        phone: '+91 98111 88776',
        email: 'yash.singhania@singhaniatrading.in',
        occupation: 'Industrialist',
        is_primary: true,
        address: '102, Golf Links, New Delhi 110003',
      },
    ],
  },
];

let inMemoryStudents = [...INITIAL_STUDENTS];

// Helper to generate dynamic Student 360 payload based on student details
function generateStudent360Data(studentWithGuardians: Student & { guardians: Guardian[] }): Student360 {
  const isSenior = studentWithGuardians.class_id.includes('11') || studentWithGuardians.class_id.includes('12');
  const isPrimary = studentWithGuardians.class_id.includes('nur') || studentWithGuardians.class_id.includes('lkg') || studentWithGuardians.class_id.includes('ukg') || studentWithGuardians.class_id.includes('cls_1');

  // Academic breakdown
  const academicSummary: AcademicSummary = isSenior
    ? {
        latest_exam_name: 'Term 1 Mid-Term Examination 2026',
        overall_percentage: 88.6,
        grade: 'A1',
        rank: '3rd in Section',
        gpa: '9.4 / 10',
        total_marks: 443,
        max_total_marks: 500,
        subjects: [
          { subject_name: 'Physics', subject_code: 'PHY-042', max_marks: 100, obtained_marks: 92, grade: 'A1', remarks: 'Excellent grasp of Electromagnetism and Kinematics' },
          { subject_name: 'Chemistry', subject_code: 'CHE-043', max_marks: 100, obtained_marks: 86, grade: 'A2', remarks: 'Good practical accuracy in Titration' },
          { subject_name: 'Mathematics', subject_code: 'MAT-041', max_marks: 100, obtained_marks: 94, grade: 'A1', remarks: 'Flawless Calculus problem-solving' },
          { subject_name: 'English Core', subject_code: 'ENG-301', max_marks: 100, obtained_marks: 85, grade: 'A2', remarks: 'Strong analytical writing and comprehension' },
          { subject_name: 'Computer Science (Python)', subject_code: 'CS-083', max_marks: 100, obtained_marks: 86, grade: 'A2', remarks: 'Very good OOP and Data Structures implementation' },
        ],
      }
    : isPrimary
    ? {
        latest_exam_name: 'Continuous Comprehensive Assessment (Term 1)',
        overall_percentage: 95.0,
        grade: 'A+',
        rank: 'Outstanding',
        gpa: '9.8 / 10',
        total_marks: 285,
        max_total_marks: 300,
        subjects: [
          { subject_name: 'Foundational English & Phonics', subject_code: 'ENG-P1', max_marks: 100, obtained_marks: 96, grade: 'A+', remarks: 'Expressive vocabulary and reading fluency' },
          { subject_name: 'Early Mathematics & Numeracy', subject_code: 'MAT-P1', max_marks: 100, obtained_marks: 94, grade: 'A+', remarks: 'Strong mental arithmetic skills' },
          { subject_name: 'Environmental Exploration & Art', subject_code: 'EVS-P1', max_marks: 100, obtained_marks: 95, grade: 'A+', remarks: 'Highly engaged in hands-on nature projects' },
        ],
      }
    : {
        latest_exam_name: 'CBSE Periodic Assessment II (2026-27)',
        overall_percentage: 86.4,
        grade: 'A1',
        rank: '4th in Class',
        gpa: '9.1 / 10',
        total_marks: 432,
        max_total_marks: 500,
        subjects: [
          { subject_name: 'Mathematics', subject_code: 'MAT-041', max_marks: 100, obtained_marks: 91, grade: 'A1', remarks: 'Consistent high marks in Trigonometry and Quadratic Equations' },
          { subject_name: 'Science (Physics, Chem, Bio)', subject_code: 'SCI-086', max_marks: 100, obtained_marks: 84, grade: 'A2', remarks: 'Well-structured diagrams and practical write-ups' },
          { subject_name: 'Social Science', subject_code: 'SST-087', max_marks: 100, obtained_marks: 82, grade: 'A2', remarks: 'Good grasp of Modern Indian History and Geography' },
          { subject_name: 'English Language & Literature', subject_code: 'ENG-184', max_marks: 100, obtained_marks: 88, grade: 'A1', remarks: 'Commendable creative writing and debate skills' },
          { subject_name: 'Hindi Course A', subject_code: 'HIN-002', max_marks: 100, obtained_marks: 87, grade: 'A2', remarks: 'Accurate grammar and literature essays' },
        ],
      };

  // Attendance summary
  const attendanceSummary: AttendanceSummary = {
    percentage: studentWithGuardians.status === 'inactive' ? 62.5 : 94.2,
    present_days: studentWithGuardians.status === 'inactive' ? 120 : 179,
    absent_days: studentWithGuardians.status === 'inactive' ? 52 : 8,
    late_days: studentWithGuardians.status === 'inactive' ? 14 : 2,
    half_days: studentWithGuardians.status === 'inactive' ? 6 : 1,
    total_working_days: 190,
    recent_records: [
      { date: '2026-10-08', status: 'present', remarks: 'Regular biometric punch in at 07:54 AM' },
      { date: '2026-10-07', status: 'present', remarks: 'Punctual attendance' },
      { date: '2026-10-06', status: 'present', remarks: 'Punctual attendance' },
      { date: '2026-10-05', status: 'late', remarks: 'Late arrival (08:18 AM) due to heavy metro congestion' },
      { date: '2026-10-04', status: 'holiday', remarks: 'Sunday / Weekly Off' },
      { date: '2026-10-03', status: 'present', remarks: 'Punctual attendance' },
      { date: '2026-10-02', status: 'holiday', remarks: 'Mahatma Gandhi Jayanti' },
      { date: '2026-10-01', status: 'present', remarks: 'Punctual attendance' },
      { date: '2026-09-30', status: 'present', remarks: 'Punctual attendance' },
      { date: '2026-09-29', status: 'absent', remarks: 'Leave applied by parent for medical check-up' },
    ],
  };

  // Fee summary
  const feeSummary: FeeSummary = {
    total_fee: 58000,
    paid_fee: studentWithGuardians.status === 'inactive' ? 29000 : 48500,
    outstanding_fee: studentWithGuardians.status === 'inactive' ? 29000 : 9500,
    next_due_date: '2026-11-15',
    currency: 'INR',
    recent_transactions: [
      {
        id: 'tx_01',
        receipt_no: 'REC-2026-8812',
        date: '2026-07-10',
        title: 'Quarter 2 Tuition & Science Composite Lab Fee',
        amount: 24500,
        payment_mode: 'Online UPI',
        status: 'paid',
      },
      {
        id: 'tx_02',
        receipt_no: 'REC-2026-4109',
        date: '2026-04-15',
        title: 'Quarter 1 Tuition & Annual Development Charge',
        amount: 24000,
        payment_mode: 'Net Banking',
        status: 'paid',
      },
      {
        id: 'tx_03',
        receipt_no: 'INV-2026-9041',
        date: '2026-10-01',
        title: 'Quarter 3 Tuition & Examination Fee',
        amount: 9500,
        payment_mode: 'Online UPI',
        status: 'pending',
      },
    ],
  };

  // Forms summary
  const forms: StudentFormItem[] = [
    {
      id: 'frm_01',
      title: 'Annual Student Health & Vaccination Declaration 2026',
      category: 'Medical / Health',
      submission_date: '2026-04-20',
      status: 'approved',
    },
    {
      id: 'frm_02',
      title: 'Inter-School CBSE Science Olympiad Consent & Indemnity',
      category: 'Academic Competition',
      submission_date: '2026-09-12',
      status: 'submitted',
    },
    {
      id: 'frm_03',
      title: 'School Transport / Bus Route Modification Request',
      category: 'Logistics',
      submission_date: undefined,
      due_date: '2026-11-01',
      status: 'pending',
    },
  ];

  // PTM Summary
  const ptm: PtmSummary = {
    upcoming: {
      id: 'ptm_01',
      title: 'Term 1 Mid-Session Parent-Teacher Conference',
      date: '2026-10-25',
      time: '10:30 AM – 10:45 AM',
      teacher_name: 'Mrs. Ananya Sen',
      teacher_designation: 'Senior PGT Math / Class Teacher',
      status: 'upcoming',
      mode: 'In-Person',
      agenda: 'Review Term 1 periodic performance, focus areas in geometry, and board project roadmap.',
    },
    history: [
      {
        id: 'ptm_hist_1',
        title: 'Annual Academic Orientation & Progress Review',
        date: '2026-05-18',
        time: '11:00 AM',
        teacher_name: 'Mrs. Ananya Sen',
        teacher_designation: 'Class Teacher',
        status: 'completed',
        mode: 'In-Person',
        agenda: 'Curriculum transition and goal setting for Class 10 board year.',
        feedback_notes: 'Parents appreciated structured weekly mock tests. Student is displaying high interest and engagement.',
      },
    ],
  };

  // Recent activity timeline
  const recent_activity: StudentActivity[] = [
    {
      id: 'act_1',
      date: '08 Oct 2026',
      time: '07:54 AM',
      type: 'attendance',
      title: 'Attendance marked Present',
      description: 'Morning biometric gate entry verified with 94.2% monthly compliance.',
      actor: 'Automated Attendance Gateway',
    },
    {
      id: 'act_2',
      date: '04 Oct 2026',
      time: '02:30 PM',
      type: 'academic',
      title: 'Periodic Test II Mathematics result entered',
      description: 'Scored 91/100 (Grade A1) in CBSE Periodic Test II.',
      actor: 'Mrs. Ananya Sen (Teacher)',
    },
    {
      id: 'act_3',
      date: '01 Oct 2026',
      time: '10:15 AM',
      type: 'fee',
      title: 'Quarter 3 fee invoice generated',
      description: 'Invoice #INV-2026-9041 for ₹9,500 due on 15 Nov 2026.',
      actor: 'School Accounts Office',
    },
    {
      id: 'act_4',
      date: '28 Sep 2026',
      time: '04:00 PM',
      type: 'ptm',
      title: 'Parent Teacher Meeting slot confirmed',
      description: 'Slot booked for 25 Oct 2026 at 10:30 AM with Mrs. Ananya Sen.',
      actor: 'Dr. Ramesh Sharma (Parent)',
    },
    {
      id: 'act_5',
      date: '12 Sep 2026',
      time: '01:15 PM',
      type: 'form',
      title: 'Parent submitted Science Olympiad Consent Form',
      description: 'Consent for CBSE Zonal Science Exhibition participation submitted.',
      actor: 'Dr. Ramesh Sharma (Parent)',
    },
    {
      id: 'act_6',
      date: '10 Jul 2026',
      time: '11:45 AM',
      type: 'fee',
      title: 'Quarter 2 fee payment recorded',
      description: 'Received ₹24,500 via Online UPI (Receipt #REC-2026-8812).',
      actor: 'Payment Gateway / Accountant',
    },
  ];

  const { guardians, ...studentOnly } = studentWithGuardians;

  return {
    student: studentOnly,
    guardians: guardians || [],
    attendance_summary: attendanceSummary,
    fee_summary: feeSummary,
    academic_summary: academicSummary,
    forms,
    ptm,
    recent_activity,
  };
}

export const StudentService = {
  /**
   * GET /api/students
   * Supports filtering by class_id, section_id, status, search, and pagination
   */
  async getStudents(params?: StudentFilters): Promise<StudentListResponse> {
    await new Promise((res) => setTimeout(res, 250));

    let filtered = [...inMemoryStudents];

    if (params?.class_id && params.class_id !== 'all') {
      filtered = filtered.filter((s) => s.class_id === params.class_id);
    }

    if (params?.section_id && params.section_id !== 'all') {
      filtered = filtered.filter((s) => s.section_id === params.section_id);
    }

    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter((s) => s.status === params.status);
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter((s) => {
        const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
        const admNo = s.admission_no.toLowerCase();
        const guardianName = s.guardians?.[0]?.name?.toLowerCase() || '';
        return fullName.includes(q) || admNo.includes(q) || guardianName.includes(q);
      });
    }

    const total = filtered.length;
    const page = params?.page || 1;
    const pageSize = params?.page_size || 10;
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    // Map to StudentListItem shape as specified in contract
    const students: StudentListItem[] = paginated.map((s) => {
      const primaryGuardian = s.guardians.find((g) => g.is_primary) || s.guardians[0];
      return {
        id: s.id,
        admission_no: s.admission_no,
        first_name: s.first_name,
        last_name: s.last_name,
        class: s.class_name || 'Class 10',
        section: s.section_name || 'Section A',
        status: s.status,
        gender: s.gender,
        dob: s.dob,
        avatar_url: s.avatar_url,
        guardian_name: primaryGuardian?.name || 'Not Recorded',
        guardian_phone: primaryGuardian?.phone || '-',
        guardian_relationship: primaryGuardian?.relationship || 'Guardian',
        email: s.email,
      };
    });

    return {
      students,
      total,
    };
  },

  /**
   * GET /api/students/:id
   */
  async getStudent(id: string): Promise<Student | undefined> {
    await new Promise((res) => setTimeout(res, 150));
    const found = inMemoryStudents.find((s) => s.id === id);
    if (!found) return undefined;
    const { guardians, ...studentOnly } = found;
    return studentOnly;
  },

  /**
   * GET /api/students/:id/360
   * Aggregated Student 360 Workspace
   */
  async getStudent360(id: string, academic_year_id?: string): Promise<Student360> {
    await new Promise((res) => setTimeout(res, 250));
    const found = inMemoryStudents.find((s) => s.id === id);
    if (!found) {
      const error: any = new Error('Student record not found or access restricted.');
      error.code = 'NOT_FOUND';
      throw error;
    }

    return generateStudent360Data(found);
  },

  /**
   * POST /api/students
   * Create new student and linked guardians
   */
  async createStudent(data: Partial<StudentFormData>): Promise<{ student: Student; guardians: Guardian[] }> {
    await new Promise((res) => setTimeout(res, 350));

    // Validation: Check duplicate admission number
    if (data.admission_no) {
      const duplicate = inMemoryStudents.some(
        (s) => s.admission_no.toLowerCase().trim() === data.admission_no?.toLowerCase().trim()
      );
      if (duplicate) {
        const error: any = new Error(`Admission number "${data.admission_no}" already exists in student registry.`);
        error.code = 'VALIDATION_ERROR';
        error.field = 'admission_no';
        throw error;
      }
    }

    const newId = `std_${Date.now()}`;
    const newStudent: Student & { guardians: Guardian[] } = {
      id: newId,
      admission_no: data.admission_no || `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      dob: data.dob || '2012-01-01',
      gender: data.gender || 'male',
      class_id: data.class_id || 'cls_10',
      section_id: data.section_id || 'sec_10_a',
      class_name: data.class_id === 'cls_nur' ? 'Nursery' : data.class_id === 'cls_1' ? 'Class 1' : data.class_id === 'cls_5' ? 'Class 5' : data.class_id === 'cls_8' ? 'Class 8' : data.class_id === 'cls_9' ? 'Class 9' : data.class_id === 'cls_12_sci' ? 'Class 12 - Science' : data.class_id === 'cls_12_com' ? 'Class 12 - Commerce' : 'Class 10',
      section_name: data.section_id === 'sec_nur_a' ? 'Section Lotus' : data.section_id === 'sec_10_b' ? 'Section B' : data.section_id === 'sec_10_c' ? 'Section C' : data.section_id === 'sec_10_d' ? 'Section D' : 'Section A',
      academic_year_id: data.academic_year_id || 'ay_2026_27',
      status: data.status || 'active',
      email: data.email || `${data.first_name?.toLowerCase() || 'student'}.${data.last_name?.toLowerCase() || 'new'}@student.dpa.edu.in`,
      phone: data.phone || '',
      address: data.address || '',
      blood_group: data.blood_group || 'B+',
      category: data.category || 'General',
      religion: data.religion || 'General',
      emergency_contact: data.emergency_contact || data.phone || '',
      avatar_url: '',
      enrollment_date: new Date().toISOString().split('T')[0],
      documents: data.documents || [],
      guardians: (data.guardians || []).map((g, idx) => ({
        ...g,
        id: `grd_${newId}_${idx + 1}`,
        student_id: newId,
        is_primary: idx === 0,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryStudents.unshift(newStudent);

    const { guardians, ...studentOnly } = newStudent;
    return {
      student: studentOnly,
      guardians: guardians || [],
    };
  },

  /**
   * PATCH /api/students/:id
   * Update student details
   */
  async updateStudent(id: string, updates: Partial<StudentFormData>): Promise<{ student: Student }> {
    await new Promise((res) => setTimeout(res, 300));

    const index = inMemoryStudents.findIndex((s) => s.id === id);
    if (index === -1) {
      const error: any = new Error('Student record not found.');
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Check duplicate admission number if changing
    if (updates.admission_no && updates.admission_no !== inMemoryStudents[index].admission_no) {
      const duplicate = inMemoryStudents.some(
        (s) => s.id !== id && s.admission_no.toLowerCase().trim() === updates.admission_no?.toLowerCase().trim()
      );
      if (duplicate) {
        const error: any = new Error(`Admission number "${updates.admission_no}" already exists.`);
        error.code = 'VALIDATION_ERROR';
        error.field = 'admission_no';
        throw error;
      }
    }

    const current = inMemoryStudents[index];
    const updated: Student & { guardians: Guardian[] } = {
      ...current,
      ...updates,
      guardians: updates.guardians
        ? updates.guardians.map((g, idx) => ({
            ...g,
            id: g.id || `grd_${id}_${idx + 1}`,
            student_id: id,
          }))
        : current.guardians,
      updated_at: new Date().toISOString(),
    };

    inMemoryStudents[index] = updated;

    const { guardians, ...studentOnly } = updated;
    return {
      student: studentOnly,
    };
  },

  listStudents(params?: StudentFilters): Promise<StudentListResponse> {
    return this.getStudents(params);
  },
};

export const studentService = StudentService;
