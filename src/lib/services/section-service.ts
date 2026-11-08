/**
 * Section Service
 * 
 * Loosely coupled service for managing Class Sections, Teachers, and Rooms.
 */

import { ClassSection, TeacherOption } from '@/types/academics';

export const TEACHERS_LIST: TeacherOption[] = [
  { id: 't_01', name: 'Mrs. Ananya Sen', email: 'ananya.sen@dpa.edu.in', department: 'Mathematics', designation: 'Senior PGT Math' },
  { id: 't_02', name: 'Mr. Vikram Malhotra', email: 'vikram.m@dpa.edu.in', department: 'Science / Physics', designation: 'PGT Physics' },
  { id: 't_03', name: 'Mrs. Priya Sharma', email: 'priya.s@dpa.edu.in', department: 'English', designation: 'TGT English' },
  { id: 't_04', name: 'Mr. Amitav Ghosh', email: 'amitav.g@dpa.edu.in', department: 'Social Studies', designation: 'TGT Social Sciences' },
  { id: 't_05', name: 'Mrs. Meenakshi Sundaram', email: 'meenakshi.s@dpa.edu.in', department: 'Commerce', designation: 'PGT Accountancy' },
  { id: 't_06', name: 'Mr. Rakesh Pandey', email: 'rakesh.p@dpa.edu.in', department: 'Hindi & Sanskrit', designation: 'TGT Hindi' },
  { id: 't_07', name: 'Ms. Deepika Kapoor', email: 'deepika.k@dpa.edu.in', department: 'Early Childhood', designation: 'Primary Teacher (PRT)' },
  { id: 't_08', name: 'Mr. Suresh Nair', email: 'suresh.n@dpa.edu.in', department: 'Computer Science & IT', designation: 'PGT Informatics' },
];

export const INITIAL_SECTIONS: ClassSection[] = [
  {
    id: 'sec_10_a',
    classId: 'cls_10',
    className: 'Class 10',
    name: 'Section A',
    roomNumber: 'Room 201 (Second Floor)',
    maxCapacity: 40,
    currentEnrollment: 40,
    classTeacherId: 't_01',
    classTeacherName: 'Mrs. Ananya Sen',
    classTeacherEmail: 'ananya.sen@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_10_b',
    classId: 'cls_10',
    className: 'Class 10',
    name: 'Section B',
    roomNumber: 'Room 202 (Second Floor)',
    maxCapacity: 40,
    currentEnrollment: 39,
    classTeacherId: 't_02',
    classTeacherName: 'Mr. Vikram Malhotra',
    classTeacherEmail: 'vikram.m@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_10_c',
    classId: 'cls_10',
    className: 'Class 10',
    name: 'Section C',
    roomNumber: 'Room 203 (Second Floor)',
    maxCapacity: 40,
    currentEnrollment: 39,
    classTeacherId: 't_03',
    classTeacherName: 'Mrs. Priya Sharma',
    classTeacherEmail: 'priya.s@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_10_d',
    classId: 'cls_10',
    className: 'Class 10',
    name: 'Section D',
    roomNumber: 'Room 204 (Second Floor)',
    maxCapacity: 40,
    currentEnrollment: 40,
    classTeacherId: 't_04',
    classTeacherName: 'Mr. Amitav Ghosh',
    classTeacherEmail: 'amitav.g@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_12_sci_a',
    classId: 'cls_12_sci',
    className: 'Class 12 - Science',
    name: 'Section A (PCM)',
    roomNumber: 'Senior Lab Wing - Room 301',
    maxCapacity: 40,
    currentEnrollment: 39,
    classTeacherId: 't_02',
    classTeacherName: 'Mr. Vikram Malhotra',
    classTeacherEmail: 'vikram.m@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_12_com_a',
    classId: 'cls_12_com',
    className: 'Class 12 - Commerce',
    name: 'Section A',
    roomNumber: 'Senior Wing - Room 304',
    maxCapacity: 40,
    currentEnrollment: 38,
    classTeacherId: 't_05',
    classTeacherName: 'Mrs. Meenakshi Sundaram',
    classTeacherEmail: 'meenakshi.s@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_nur_a',
    classId: 'cls_nur',
    className: 'Nursery',
    name: 'Section Lotus',
    roomNumber: 'Kindergarten Activity Room 1',
    maxCapacity: 30,
    currentEnrollment: 27,
    classTeacherId: 't_07',
    classTeacherName: 'Ms. Deepika Kapoor',
    classTeacherEmail: 'deepika.k@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'sec_nur_b',
    classId: 'cls_nur',
    className: 'Nursery',
    name: 'Section Tulip',
    roomNumber: 'Kindergarten Activity Room 2',
    maxCapacity: 30,
    currentEnrollment: 27,
    classTeacherId: 't_06',
    classTeacherName: 'Mr. Rakesh Pandey',
    classTeacherEmail: 'rakesh.p@dpa.edu.in',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
  },
];

let sections: ClassSection[] = [...INITIAL_SECTIONS];

export const SectionService = {
  async getAll(classId?: string): Promise<ClassSection[]> {
    await new Promise((res) => setTimeout(res, 200));
    if (classId && classId !== 'all') {
      return sections.filter((s) => s.classId === classId);
    }
    return [...sections];
  },

  async listSections(classId?: string): Promise<ClassSection[]> {
    return this.getAll(classId);
  },

  async getById(id: string): Promise<ClassSection | undefined> {
    await new Promise((res) => setTimeout(res, 100));
    return sections.find((s) => s.id === id);
  },

  async getTeachers(): Promise<TeacherOption[]> {
    await new Promise((res) => setTimeout(res, 100));
    return [...TEACHERS_LIST];
  },

  async create(data: Omit<ClassSection, 'id' | 'createdAt' | 'currentEnrollment'>): Promise<ClassSection> {
    await new Promise((res) => setTimeout(res, 350));
    const newSection: ClassSection = {
      ...data,
      id: `sec_${Date.now()}`,
      currentEnrollment: 0,
      createdAt: new Date().toISOString(),
    };
    sections.push(newSection);
    return newSection;
  },

  async update(id: string, updates: Partial<ClassSection>): Promise<ClassSection> {
    await new Promise((res) => setTimeout(res, 300));
    const index = sections.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Section not found');

    sections[index] = {
      ...sections[index],
      ...updates,
    };
    return sections[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    sections = sections.filter((s) => s.id !== id);
  },
};

export const sectionService = SectionService;

