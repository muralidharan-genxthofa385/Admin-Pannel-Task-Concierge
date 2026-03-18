import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

// Map your exact route segments to readable labels
const SEGMENT_LABELS: Record<string, string> = {
  Dashboard: 'Dashboard',
  tasks: 'Tasks',
  taskers: 'Taskers',
  customers: 'Residents',
  business: 'Business',
  approval: 'Approvals',
  user: 'Users',
  skills: 'Skills',
  skill: 'Skill',
  category: 'Categories',
  services: 'Services',
  service: 'Service',
  questions: 'Questions',
  creation: 'Create',
  Users: 'Users',
  Report: 'Reported Users',
  Payments: 'Payments',
  view: 'View',
  edit: 'Edit',
};

// Segments that should never be clickable
const NON_LINKABLE = new Set(['view', 'edit', 'creation', 'Report']);

// Check if segment is a dynamic ID
const isId = (segment: string) =>
  /^\d+$/.test(segment) || /^[a-f0-9-]{36}$/i.test(segment);

// Routes that are valid navigation targets
const VALID_ROUTES = new Set([
  '/Dashboard',
  '/tasks',
  '/taskers',
  '/customers',
  '/business/approval',
  '/business/user',
  '/skills',
  '/skill/category',
  '/services',
  '/service/category',
  '/questions',
  '/Users/Report',
  '/Payments',
]);

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/Dashboard">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = SEGMENT_LABELS[segment] ?? 
                        segment.charAt(0).toUpperCase() + segment.slice(1);
          const isClickable = !isLast && 
                              !isId(segment) && 
                              !NON_LINKABLE.has(segment) && 
                              VALID_ROUTES.has(href); // ✅ only link to real routes

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isClickable ? (
                  <BreadcrumbLink asChild>
                    <Link to={href}>{label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className='text-[var(--color-purple)] font-semibold' >{label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}