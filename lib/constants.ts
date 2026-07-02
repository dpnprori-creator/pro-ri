export const APP_NAME = "PRO RI Digital Command Center";
export const APP_NAME_SHORT = "PRO RI";

export const ACADEMY_URL = process.env.NEXT_PUBLIC_ACADEMY_URL || "https://academy.prori.id";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const TARGET_MEMBERS = 10000;
export const TARGET_TRAINERS = 500;
export const TARGET_MENTORS = 200;

export const MEMBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export const EVENT_CATEGORIES = {
  WEBINAR: "webinar",
  WORKSHOP: "workshop",
  COMPETITION: "competition",
  EXHIBITION: "exhibition",
} as const;

export const EVENT_TYPES = {
  ONLINE: "online",
  OFFLINE: "offline",
  HYBRID: "hybrid",
} as const;

export const INNOVATION_CATEGORIES = {
  ROBOTICS: "robotics",
  AI: "ai",
  IOT: "iot",
  PROGRAMMING: "programming",
  RESEARCH: "research",
} as const;

export const ROLES = {
  MEMBER: "member",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const NAV_PUBLIC = [
  { label: "Beranda", href: "/" },
  { label: "Peta Nasional", href: "/national-map" },
  { label: "Tentang", href: "/about" },
  { label: "Program", href: "/programs" },
  { label: "Pengurus", href: "/pengurus" },
  { label: "Informasi", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Inovasi", href: "/innovations" },
  { label: "Galeri", href: "/gallery" },
  { label: "Kontak", href: "/kontak" },
] as const;

export const NAV_DASHBOARD = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Membership", href: "/membership", icon: "CreditCard" },
  { label: "Peta Nasional", href: "/national-map", icon: "Map" },
  { label: "Direktori", href: "/members", icon: "Users" },
  { label: "Events", href: "/dashboard/events", icon: "Calendar" },
  { label: "Inovasi", href: "/dashboard/innovations", icon: "Lightbulb" },
  { label: "Akademi", href: "/academy", icon: "GraduationCap" },
  { label: "Profil", href: "/profile", icon: "User" },
] as const;

export const NAV_ADMIN = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Members", href: "/admin/members", icon: "Users" },
  { label: "Programs", href: "/admin/programs", icon: "BookOpen" },
  { label: "Events", href: "/admin/events", icon: "Calendar" },
  { label: "Inovasi", href: "/admin/innovations", icon: "Lightbulb" },
  { label: "Sertifikat", href: "/admin/certificates", icon: "Award" },
  { label: "Berita", href: "/admin/news", icon: "Newspaper" },
  { label: "Monitoring", href: "/admin/monitoring", icon: "Activity" },
] as const;
