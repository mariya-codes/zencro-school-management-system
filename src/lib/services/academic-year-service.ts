/**
 * Academic Year Service
 * 
 * Loosely coupled service for managing Academic Sessions & Terms.
 */

import { AcademicYear } from '@/types/academics';

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay_2026_27',
    name: '2026 - 2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    status: 'active',
    isCurrent: true,
    totalWorkingDays: 220,
    description: 'Current active academic session for all classes (Pre-Primary to 12th).',
    terms: [
      {
        id: 'term_26_1',
        name: 'Term 1 / Half-Yearly',
        startDate: '2026-04-01',
        endDate: '2026-09-30',
        isCompleted: true,
      },
      {
        id: 'term_26_2',
        name: 'Term 2 / Annual',
        startDate: '2026-10-01',
        endDate: '2027-03-31',
        isCompleted: false,
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'ay_2025_26',
    name: '2025 - 2026',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'archived',
    isCurrent: false,
    totalWorkingDays: 218,
    description: 'Completed academic session.',
    terms: [
      {
        id: 'term_25_1',
        name: 'Term 1 / Half-Yearly',
        startDate: '2025-04-01',
        endDate: '2025-09-30',
        isCompleted: true,
      },
      {
        id: 'term_25_2',
        name: 'Term 2 / Annual',
        startDate: '2025-10-01',
        endDate: '2026-03-31',
        isCompleted: true,
      },
    ],
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'ay_2027_28',
    name: '2027 - 2028',
    startDate: '2027-04-01',
    endDate: '2028-03-31',
    status: 'upcoming',
    isCurrent: false,
    totalWorkingDays: 220,
    description: 'Upcoming academic session planned for next year admissions.',
    terms: [
      {
        id: 'term_27_1',
        name: 'Term 1 / Half-Yearly',
        startDate: '2027-04-01',
        endDate: '2027-09-30',
        isCompleted: false,
      },
      {
        id: 'term_27_2',
        name: 'Term 2 / Annual',
        startDate: '2027-10-01',
        endDate: '2028-03-31',
        isCompleted: false,
      },
    ],
    createdAt: '2026-03-01T10:00:00Z',
  },
];

let academicYears: AcademicYear[] = [...INITIAL_ACADEMIC_YEARS];

export const AcademicYearService = {
  async getAll(): Promise<AcademicYear[]> {
    await new Promise((res) => setTimeout(res, 200));
    return [...academicYears];
  },

  async getCurrent(): Promise<AcademicYear | undefined> {
    await new Promise((res) => setTimeout(res, 150));
    return academicYears.find((y) => y.isCurrent) || academicYears[0];
  },

  async create(data: Omit<AcademicYear, 'id' | 'createdAt'>): Promise<AcademicYear> {
    await new Promise((res) => setTimeout(res, 400));
    const newYear: AcademicYear = {
      ...data,
      id: `ay_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (newYear.isCurrent) {
      academicYears = academicYears.map((y) => ({
        ...y,
        isCurrent: false,
        status: y.status === 'active' ? 'archived' : y.status,
      }));
    }

    academicYears.unshift(newYear);
    return newYear;
  },

  async update(id: string, updates: Partial<AcademicYear>): Promise<AcademicYear> {
    await new Promise((res) => setTimeout(res, 300));
    const index = academicYears.findIndex((y) => y.id === id);
    if (index === -1) throw new Error('Academic year not found');

    if (updates.isCurrent) {
      academicYears = academicYears.map((y) => ({
        ...y,
        isCurrent: y.id === id,
        status: y.id === id ? 'active' : y.status === 'active' ? 'archived' : y.status,
      }));
    }

    academicYears[index] = {
      ...academicYears[index],
      ...updates,
    };

    return academicYears[index];
  },

  async setAsCurrent(id: string): Promise<AcademicYear> {
    await new Promise((res) => setTimeout(res, 300));
    academicYears = academicYears.map((y) => ({
      ...y,
      isCurrent: y.id === id,
      status: y.id === id ? 'active' : y.status === 'active' ? 'archived' : y.status,
    }));
    const current = academicYears.find((y) => y.id === id);
    if (!current) throw new Error('Academic year not found');
    return current;
  },

  async delete(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    const target = academicYears.find((y) => y.id === id);
    if (target?.isCurrent) {
      throw new Error('Cannot delete the currently active academic year.');
    }
    academicYears = academicYears.filter((y) => y.id !== id);
  },
};

export const academicYearService = AcademicYearService;

