import { HeartPulse, Brain, Activity, Bone, Baby, Sun, Microscope, Scissors, Stethoscope } from 'lucide-react';

export const SPECIALTY_ICONS = { Cardiology: HeartPulse, Neurology: Brain, Oncology: Activity, Orthopedics: Bone, Pediatrics: Baby, Dermatology: Sun, Radiology: Microscope, 'General Surgery': Scissors };
export const DEFAULT_ICON = Stethoscope;

export const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',   'bg-indigo-100 text-indigo-700',
  'bg-violet-100 text-violet-700', 'bg-purple-100 text-purple-700',
  'bg-fuchsia-100 text-fuchsia-700', 'bg-rose-100 text-rose-700',
];

export const DOCTORS = [
  { id: 'sarah-johnson', name: 'Dr. Sarah Johnson',  specialty: 'Cardiology',     hospital: 'Apollo Medical Center',       exp: '14 years', qual: 'MBBS, MD (Cardiology)',  rating: 4.9, reviews: 128, patients: '5k+' },
  { id: 'michael-chen', name: 'Dr. Michael Chen',   specialty: 'Neurology',      hospital: 'Mercy General Hospital',      exp: '15 years', qual: 'MBBS, MS, DM (Neurology)',  rating: 4.8, reviews: 94, patients: '3k+' },
  { id: 'priya-patel', name: 'Dr. Priya Patel',    specialty: 'Oncology',       hospital: 'Sunrise Specialty Clinic',    exp: '16 years', qual: 'MBBS, DM (Oncology)',  rating: 4.9, reviews: 215, patients: '8k+' },
  { id: 'james-wilson', name: 'Dr. James Wilson',   specialty: 'Orthopedics',    hospital: 'Greenfield Hospital',         exp: '12 years', qual: 'MBBS, MS (Ortho)', rating: 4.7, reviews: 86, patients: '4k+' },
  { id: 'emily-rodriguez', name: 'Dr. Emily Rodriguez',specialty: 'Pediatrics',     hospital: 'Cedar Park Medical',          exp: '8 years', qual: 'MBBS, MD (Pediatrics)', rating: 4.8, reviews: 156, patients: '6k+' },
  { id: 'david-kim', name: 'Dr. David Kim',      specialty: 'Dermatology',    hospital: "Northstar Children's Hospital",exp: '9 years', qual: 'MBBS, MD (Dermatology)',  rating: 4.6, reviews: 72, patients: '2k+' },
  { id: 'aisha-khan', name: 'Dr. Aisha Khan',     specialty: 'Radiology',      hospital: 'Apollo Medical Center',       exp: '10 years',qual: 'MBBS, MD (Radiology)',  rating: 4.9, reviews: 110, patients: '4k+' },
  { id: 'robert-garcia', name: 'Dr. Robert Garcia',  specialty: 'General Surgery',hospital: 'Mercy General Hospital',      exp: '11 years',qual: 'MBBS, MS (Surgery)',  rating: 4.7, reviews: 89, patients: '3k+' },
  { id: 'linda-thompson', name: 'Dr. Linda Thompson', specialty: 'Cardiology',     hospital: 'Sunrise Specialty Clinic',    exp: '12 years',qual: 'MBBS, MD (Cardiology)', rating: 4.8, reviews: 142, patients: '5k+' },
];

export const SPECIALTIES = ['All', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Radiology', 'General Surgery'];
