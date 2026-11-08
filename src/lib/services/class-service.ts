/**
 * Class Service
 * 
 * Loosely coupled service for managing School Classes, Streams, and Wings.
 */

import { SchoolClass, ClassLevel, SeniorStream } from '@/types/academics';

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls_nur',
    name: 'Nursery',
    code: 'NUR',
    numericOrder: 0,
    level: 'Pre-Primary',
    department: 'Early Childhood Education',
    totalSections: 2,
    totalCapacity: 60,
    totalEnrolled: 54,
    status: 'active',
    description: 'Foundational learning and play-way activities for ages 3-4.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_lkg',
    name: 'LKG (Lower Kindergarten)',
    code: 'LKG',
    numericOrder: 0.1,
    level: 'Pre-Primary',
    department: 'Early Childhood Education',
    totalSections: 2,
    totalCapacity: 60,
    totalEnrolled: 58,
    status: 'active',
    description: 'Pre-primary numeracy and literacy foundation.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_ukg',
    name: 'UKG (Upper Kindergarten)',
    code: 'UKG',
    numericOrder: 0.2,
    level: 'Pre-Primary',
    department: 'Early Childhood Education',
    totalSections: 2,
    totalCapacity: 60,
    totalEnrolled: 59,
    status: 'active',
    description: 'School readiness and phonics mastery.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_1',
    name: 'Class 1',
    code: 'C1',
    numericOrder: 1,
    level: 'Primary (1-5)',
    department: 'Primary Wing',
    totalSections: 3,
    totalCapacity: 105,
    totalEnrolled: 98,
    status: 'active',
    description: 'Primary grade 1 curriculum.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_5',
    name: 'Class 5',
    code: 'C5',
    numericOrder: 5,
    level: 'Primary (1-5)',
    department: 'Primary Wing',
    totalSections: 3,
    totalCapacity: 105,
    totalEnrolled: 102,
    status: 'active',
    description: 'Senior primary curriculum with environmental studies.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_8',
    name: 'Class 8',
    code: 'C8',
    numericOrder: 8,
    level: 'Middle (6-8)',
    department: 'Middle Wing',
    totalSections: 3,
    totalCapacity: 120,
    totalEnrolled: 114,
    status: 'active',
    description: 'Middle school with science labs and third language options.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_9',
    name: 'Class 9',
    code: 'C9',
    numericOrder: 9,
    level: 'Secondary (9-10)',
    department: 'Secondary Wing',
    totalSections: 4,
    totalCapacity: 160,
    totalEnrolled: 152,
    status: 'active',
    description: 'Secondary board preparation phase 1.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_10',
    name: 'Class 10',
    code: 'C10',
    numericOrder: 10,
    level: 'Secondary (9-10)',
    department: 'Secondary Wing',
    totalSections: 4,
    totalCapacity: 160,
    totalEnrolled: 158,
    status: 'active',
    description: 'CBSE Secondary School Examination (AISSE) batch.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_11_sci',
    name: 'Class 11 - Science (PCM/PCB)',
    code: 'C11-SCI',
    numericOrder: 11,
    level: 'Senior Secondary (11-12)',
    stream: 'Science (PCM)',
    department: 'Senior Secondary Wing',
    totalSections: 2,
    totalCapacity: 80,
    totalEnrolled: 76,
    status: 'active',
    description: 'Physics, Chemistry, Mathematics, Biology & Computer Science.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_11_com',
    name: 'Class 11 - Commerce',
    code: 'C11-COM',
    numericOrder: 11.1,
    level: 'Senior Secondary (11-12)',
    stream: 'Commerce',
    department: 'Senior Secondary Wing',
    totalSections: 2,
    totalCapacity: 80,
    totalEnrolled: 72,
    status: 'active',
    description: 'Accountancy, Business Studies, Economics & Applied Mathematics.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_12_sci',
    name: 'Class 12 - Science',
    code: 'C12-SCI',
    numericOrder: 12,
    level: 'Senior Secondary (11-12)',
    stream: 'Science (PCM)',
    department: 'Senior Secondary Wing',
    totalSections: 2,
    totalCapacity: 80,
    totalEnrolled: 78,
    status: 'active',
    description: 'CBSE All India Senior School Certificate Examination (AISSCE) Science.',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cls_12_com',
    name: 'Class 12 - Commerce',
    code: 'C12-COM',
    numericOrder: 12.1,
    level: 'Senior Secondary (11-12)',
    stream: 'Commerce',
    department: 'Senior Secondary Wing',
    totalSections: 2,
    totalCapacity: 80,
    totalEnrolled: 75,
    status: 'active',
    description: 'CBSE AISSCE Commerce Board Examination batch.',
    createdAt: '2026-01-10T10:00:00Z',
  },
];

let classes: SchoolClass[] = [...INITIAL_CLASSES];

export const ClassService = {
  async getAll(): Promise<SchoolClass[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...classes].sort((a, b) => a.numericOrder - b.numericOrder);
  },

  async listClasses(): Promise<SchoolClass[]> {
    return this.getAll();
  },

  async getById(id: string): Promise<SchoolClass | undefined> {
    await new Promise((res) => setTimeout(res, 100));
    return classes.find((c) => c.id === id);
  },

  async create(data: Omit<SchoolClass, 'id' | 'createdAt' | 'totalEnrolled'>): Promise<SchoolClass> {
    await new Promise((res) => setTimeout(res, 350));
    const newClass: SchoolClass = {
      ...data,
      id: `cls_${Date.now()}`,
      totalEnrolled: 0,
      createdAt: new Date().toISOString(),
    };
    classes.push(newClass);
    return newClass;
  },

  async update(id: string, updates: Partial<SchoolClass>): Promise<SchoolClass> {
    await new Promise((res) => setTimeout(res, 300));
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Class not found');

    classes[index] = {
      ...classes[index],
      ...updates,
    };
    return classes[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    classes = classes.filter((c) => c.id !== id);
  },
};

export const classService = ClassService;

