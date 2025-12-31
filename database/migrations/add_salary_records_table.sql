-- =====================================================
-- Migration: Add salary_records table
-- =====================================================
-- This table stores salary records for staff members
-- Created: 2025-12-30
-- =====================================================

-- Create salary_records table
CREATE TABLE IF NOT EXISTS public.salary_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    month character varying(7) NOT NULL,
    base_salary numeric(12,2) NOT NULL,
    allowances numeric(12,2) DEFAULT 0,
    deductions numeric(12,2) DEFAULT 0,
    net_salary numeric(12,2) NOT NULL,
    recorded_by_user_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT salary_records_pkey PRIMARY KEY (id),
    CONSTRAINT salary_records_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT salary_records_recorded_by_user_id_fkey FOREIGN KEY (recorded_by_user_id) 
        REFERENCES public.users(id) ON DELETE SET NULL,
    CONSTRAINT valid_month_format CHECK (month ~ '^\d{4}-\d{2}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_salary_records_user_id ON public.salary_records(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_records_month ON public.salary_records(month);
CREATE INDEX IF NOT EXISTS idx_salary_records_recorded_by ON public.salary_records(recorded_by_user_id);
CREATE INDEX IF NOT EXISTS idx_salary_records_user_month ON public.salary_records(user_id, month);

-- Add comment to table
COMMENT ON TABLE public.salary_records IS 'Stores salary records for staff members with base salary, allowances, deductions, and net salary calculations';

-- Add comments to columns
COMMENT ON COLUMN public.salary_records.month IS 'Month in YYYY-MM format (e.g., 2024-01)';
COMMENT ON COLUMN public.salary_records.net_salary IS 'Calculated as base_salary + allowances - deductions';
COMMENT ON COLUMN public.salary_records.recorded_by_user_id IS 'User who recorded this salary entry (typically HR or Admin)';

ALTER TABLE public.salary_records OWNER TO postgres;

