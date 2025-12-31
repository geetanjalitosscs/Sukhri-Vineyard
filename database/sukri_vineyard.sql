--
-- PostgreSQL database dump
--

\restrict KAWIH7SibAglF38HeUcb5Zm6yj3MFMJMWgTMS21xfb1QO8GluYdI6Xz5XRRZGCw

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-30 17:27:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17122)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16660)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id character varying(50) NOT NULL,
    vendor_id character varying(50) NOT NULL,
    applied_by_user_id uuid,
    offer text NOT NULL,
    quote_amount character varying(100) NOT NULL,
    additional_details text,
    status character varying(50) DEFAULT 'pending'::character varying,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_at timestamp without time zone,
    reviewed_by_user_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_application_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16447)
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    attendance_date date NOT NULL,
    check_in_time time without time zone,
    check_out_time time without time zone,
    status character varying(50) NOT NULL,
    method character varying(50),
    device_id character varying(50),
    zone character varying(100),
    location character varying(255),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_attendance_method CHECK ((((method)::text = ANY ((ARRAY['biometric'::character varying, 'face'::character varying, 'qr'::character varying])::text[])) OR (method IS NULL))),
    CONSTRAINT valid_attendance_status CHECK (((status)::text = ANY ((ARRAY['present'::character varying, 'absent'::character varying, 'late'::character varying, 'onLeave'::character varying, 'earlyExit'::character varying])::text[])))
);


ALTER TABLE public.attendance_records OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16475)
-- Name: co2_barrels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co2_barrels (
    id character varying(50) NOT NULL,
    qr_code character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    vineyard_id character varying(50),
    capacity_percentage integer DEFAULT 0,
    status character varying(50) DEFAULT 'ok'::character varying,
    last_filled_date date,
    next_due_date date,
    filled_by_user_id uuid,
    last_fill_time timestamp without time zone,
    sensor_reading integer,
    alert_sent boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_barrel_status CHECK (((status)::text = ANY ((ARRAY['ok'::character varying, 'overdue'::character varying, 'low'::character varying, 'critical'::character varying])::text[]))),
    CONSTRAINT valid_capacity CHECK (((capacity_percentage >= 0) AND (capacity_percentage <= 100)))
);


ALTER TABLE public.co2_barrels OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16504)
-- Name: co2_refill_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.co2_refill_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    barrel_id character varying(50) NOT NULL,
    filled_by_user_id uuid NOT NULL,
    fill_date date NOT NULL,
    fill_time timestamp without time zone NOT NULL,
    capacity_before integer,
    capacity_after integer,
    sensor_reading integer,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.co2_refill_history OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16425)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    location character varying(255),
    zone character varying(100),
    status character varying(50) DEFAULT 'active'::character varying,
    model character varying(100),
    firmware character varying(50),
    vineyard_id character varying(50),
    barrel_id character varying(50),
    last_sync timestamp without time zone,
    last_reading timestamp without time zone,
    current_value numeric(10,2),
    threshold_min numeric(10,2),
    threshold_max numeric(10,2),
    alert_enabled boolean DEFAULT true,
    live_feed_url character varying(500),
    recordings_enabled boolean DEFAULT false,
    total_scans integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_device_type CHECK (((type)::text = ANY ((ARRAY['temperature'::character varying, 'co2'::character varying, 'cctv'::character varying, 'biometric'::character varying, 'face'::character varying, 'qr'::character varying])::text[])))
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16813)
-- Name: file_uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file_uploads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_name character varying(255) NOT NULL,
    client_email character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size bigint,
    file_type character varying(100),
    uploaded_by_user_id uuid,
    upload_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    email_sent boolean DEFAULT false,
    email_sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.file_uploads OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16551)
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_items (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    current_stock numeric(10,2) DEFAULT 0,
    min_stock numeric(10,2) DEFAULT 0,
    unit character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'ok'::character varying,
    supplier character varying(255),
    last_ordered_date date,
    unit_price numeric(10,2),
    total_value numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_inventory_status CHECK (((status)::text = ANY ((ARRAY['ok'::character varying, 'low'::character varying, 'critical'::character varying, 'out_of_stock'::character varying])::text[])))
);


ALTER TABLE public.inventory_items OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16569)
-- Name: inventory_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id character varying(50) NOT NULL,
    transaction_type character varying(50) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying(50) NOT NULL,
    reference_type character varying(50),
    reference_id character varying(100),
    performed_by_user_id uuid,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_transaction_type CHECK (((transaction_type)::text = ANY ((ARRAY['in'::character varying, 'out'::character varying, 'adjustment'::character varying, 'transfer'::character varying])::text[])))
);


ALTER TABLE public.inventory_transactions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16643)
-- Name: post_requirements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_requirements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id character varying(50) NOT NULL,
    requirement text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.post_requirements OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16619)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    posted_by_user_id uuid NOT NULL,
    posted_by_name character varying(255) NOT NULL,
    posted_by_role character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'open'::character varying,
    posted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_post_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'closed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16734)
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    purchase_order_id character varying(50) NOT NULL,
    item_name character varying(255) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying(50) NOT NULL,
    unit_price numeric(10,2),
    total_price numeric(12,2),
    inventory_item_id character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16699)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id character varying(50) NOT NULL,
    vendor_id character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'pending_approval'::character varying,
    order_date date NOT NULL,
    expected_delivery_date date,
    delivery_date date,
    requested_by_user_id uuid NOT NULL,
    requested_by_name character varying(255) NOT NULL,
    requested_by_role character varying(50) NOT NULL,
    approved_by_user_id uuid,
    approved_at timestamp without time zone,
    invoice_uploaded boolean DEFAULT false,
    invoice_url character varying(500),
    dispatch_status character varying(50),
    total_amount numeric(12,2) DEFAULT 0,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dispatch_status CHECK ((((dispatch_status)::text = ANY ((ARRAY['pending'::character varying, 'dispatched'::character varying, 'in_transit'::character varying, 'delivered'::character varying])::text[])) OR (dispatch_status IS NULL))),
    CONSTRAINT valid_po_status CHECK (((status)::text = ANY ((ARRAY['pending_approval'::character varying, 'approved'::character varying, 'rejected'::character varying, 'dispatched'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16790)
-- Name: task_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    task_id character varying(50) NOT NULL,
    user_id uuid NOT NULL,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.task_comments OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16756)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    assigned_to_user_id uuid NOT NULL,
    assigned_to_name character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    priority character varying(50) DEFAULT 'medium'::character varying,
    due_date date,
    completed_at timestamp without time zone,
    barrel_id character varying(50),
    zone character varying(100),
    camera_zone character varying(100),
    location character varying(255),
    description text,
    created_by_user_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_task_priority CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))),
    CONSTRAINT valid_task_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT valid_task_type CHECK (((type)::text = ANY ((ARRAY['co2_refill'::character varying, 'cleaning'::character varying, 'monitoring'::character varying, 'maintenance'::character varying, 'other'::character varying])::text[])))
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16528)
-- Name: temperature_readings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temperature_readings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_id character varying(50) NOT NULL,
    reading_time timestamp without time zone NOT NULL,
    temperature numeric(5,2) NOT NULL,
    humidity numeric(5,2),
    status character varying(50) DEFAULT 'normal'::character varying,
    vineyard_id character varying(50),
    zone character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_temperature_status CHECK (((status)::text = ANY ((ARRAY['normal'::character varying, 'warning'::character varying, 'critical'::character varying])::text[])))
);


ALTER TABLE public.temperature_readings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    vineyard_id character varying(50),
    phone character varying(20),
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (((role)::text = ANY ((ARRAY['owner'::character varying, 'admin'::character varying, 'hr'::character varying, 'gm'::character varying, 'vendor'::character varying, 'staff'::character varying, 'cleaner'::character varying, 'caretaker'::character varying, 'gas-filler'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16594)
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    contact_email character varying(255),
    phone character varying(20),
    address text,
    rating numeric(3,2) DEFAULT 0,
    total_orders integer DEFAULT 0,
    active_orders integer DEFAULT 0,
    status character varying(50) DEFAULT 'active'::character varying,
    on_time_delivery_percentage numeric(5,2) DEFAULT 0,
    quality_score numeric(3,2) DEFAULT 0,
    average_response_time_hours integer DEFAULT 0,
    user_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rating CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT valid_vendor_status CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::text[])))
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16389)
-- Name: vineyards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vineyards (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    location character varying(255),
    area_hectares numeric(10,2),
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vineyards OWNER TO postgres;

--
-- TOC entry 5286 (class 0 OID 16660)
-- Dependencies: 232
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.applications (id, post_id, vendor_id, applied_by_user_id, offer, quote_amount, additional_details, status, applied_at, reviewed_at, reviewed_by_user_id, created_at, updated_at) FROM stdin;
6ad9bce1-2b2e-454a-b7dc-cd4329ac51aa	POST-001	V-001	550e8400-e29b-41d4-a716-446655440005	I can provide 500 kg of certified organic NPK fertilizer suitable for grape cultivation. I have all necessary certifications and can deliver within 1 week.	₹47,000	I have 500 kg available in stock. I can deliver within 1 week. I have all necessary certifications.	pending	2024-01-20 11:00:00	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
3be765a7-2647-48a3-a81c-1666c94dedc9	POST-003	V-001	550e8400-e29b-41d4-a716-446655440005	I can provide monthly CO₂ refilling services for 10 barrels. I have all safety certifications and 5 years of experience in bulk refilling operations.	₹9,000 per month	I have all safety certifications and 5 years of experience in bulk refilling operations.	accepted	2024-01-18 10:00:00	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
f8bbc92d-2aa7-4333-bfa9-6b43bd4bb59d	POST-002	V-003	\N	We provide comprehensive maintenance services for vineyard equipment. Our team has 10+ years of experience and we offer 24/7 emergency support.	₹18,000 per month	We have 10+ years of experience and offer 24/7 emergency support.	rejected	2024-01-19 15:00:00	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5277 (class 0 OID 16447)
-- Dependencies: 223
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_records (id, user_id, attendance_date, check_in_time, check_out_time, status, method, device_id, zone, location, notes, created_at, updated_at) FROM stdin;
5b922491-e813-4257-9396-5bba7f6f440f	550e8400-e29b-41d4-a716-446655440007	2024-01-17	08:15:00	17:30:00	present	biometric	BIO-001	Block A	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
cfb96340-fddf-44dd-a86c-fe12e1bcf4dc	550e8400-e29b-41d4-a716-446655440008	2024-01-17	07:45:00	\N	present	face	FACE-002	Block B	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
d6e830de-f03b-4ad6-be84-c7c179805fbc	550e8400-e29b-41d4-a716-446655440009	2024-01-17	08:30:00	\N	late	biometric	BIO-001	CO₂ Storage	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
e44ae8e2-ae63-449c-95d5-0d10bc292d23	550e8400-e29b-41d4-a716-446655440007	2024-01-16	08:00:00	17:00:00	present	biometric	BIO-001	Block A	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
4ec2a271-1ce5-4295-b6ef-75404f857d29	550e8400-e29b-41d4-a716-446655440008	2024-01-16	07:30:00	16:45:00	present	face	FACE-002	Block B	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
1ecfc43b-1f73-446c-97f1-6ed4a455bb0f	550e8400-e29b-41d4-a716-446655440009	2024-01-16	08:00:00	17:00:00	present	biometric	BIO-001	CO₂ Storage	\N	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5278 (class 0 OID 16475)
-- Dependencies: 224
-- Data for Name: co2_barrels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co2_barrels (id, qr_code, location, vineyard_id, capacity_percentage, status, last_filled_date, next_due_date, filled_by_user_id, last_fill_time, sensor_reading, alert_sent, created_at, updated_at) FROM stdin;
CO2-001	QR-CO2-001-ABC123	Block A - Row 5	sukhri	85	ok	2024-01-15	2024-01-22	550e8400-e29b-41d4-a716-446655440009	2024-01-15 10:30:00	4200	f	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-002	QR-CO2-002-DEF456	Block A - Row 8	sukhri	90	ok	2024-01-14	2024-01-21	550e8400-e29b-41d4-a716-446655440009	2024-01-14 09:15:00	4500	f	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-003	QR-CO2-003-GHI789	Block B - Row 3	sukhri	15	overdue	2024-01-10	2024-01-17	\N	\N	800	t	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-004	QR-CO2-004-JKL012	Block B - Row 7	sukhri	75	ok	2024-01-16	2024-01-23	550e8400-e29b-41d4-a716-446655440009	2024-01-16 11:00:00	3800	f	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-005	QR-CO2-005-MNO345	Block C - Row 2	sukhri	20	overdue	2024-01-09	2024-01-16	\N	\N	1000	t	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-006	QR-CO2-006-PQR678	Block C - Row 9	sukhri	88	ok	2024-01-17	2024-01-24	550e8400-e29b-41d4-a716-446655440009	2024-01-17 08:45:00	4400	f	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5279 (class 0 OID 16504)
-- Dependencies: 225
-- Data for Name: co2_refill_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.co2_refill_history (id, barrel_id, filled_by_user_id, fill_date, fill_time, capacity_before, capacity_after, sensor_reading, notes, created_at) FROM stdin;
42d951ce-4d28-4bfb-b837-09baa68ce502	CO2-001	550e8400-e29b-41d4-a716-446655440009	2024-01-15	2024-01-15 10:30:00	20	85	4200	\N	2025-12-30 15:25:35.74205
2a7c887a-4a4a-4870-bcaa-6d1d71619947	CO2-002	550e8400-e29b-41d4-a716-446655440009	2024-01-14	2024-01-14 09:15:00	15	90	4500	\N	2025-12-30 15:25:35.74205
c53de888-689e-4288-bd47-a8886bb3398d	CO2-004	550e8400-e29b-41d4-a716-446655440009	2024-01-16	2024-01-16 11:00:00	30	75	3800	\N	2025-12-30 15:25:35.74205
b58c8c51-d9e9-4176-9d4e-37b79a5e362a	CO2-006	550e8400-e29b-41d4-a716-446655440009	2024-01-17	2024-01-17 08:45:00	25	88	4400	\N	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5276 (class 0 OID 16425)
-- Dependencies: 222
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, name, type, location, zone, status, model, firmware, vineyard_id, barrel_id, last_sync, last_reading, current_value, threshold_min, threshold_max, alert_enabled, live_feed_url, recordings_enabled, total_scans, created_at, updated_at) FROM stdin;
TEMP-001	Temperature Sensor Block A	temperature	Block A - Center	Block A	active	DS18B20	v2.1.0	sukhri	\N	2024-01-17 10:00:00	2024-01-17 10:00:00	24.80	18.00	28.00	t	\N	f	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
TEMP-002	Temperature Sensor Block B	temperature	Block B - Center	Block B	active	DS18B20	v2.1.0	sukhri	\N	2024-01-17 10:00:00	2024-01-17 10:00:00	25.20	18.00	28.00	t	\N	f	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CAM-001	Camera Block A	cctv	Block A - Main Zone	Block A	active	Hikvision DS-2CD	v5.7.0	sukhri	\N	2024-01-17 10:00:00	\N	\N	\N	\N	t	/cameras/cam-001/live	t	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CAM-002	Camera Block B	cctv	Block B - Main Zone	Block B	active	Hikvision DS-2CD	v5.7.0	sukhri	\N	2024-01-17 10:00:00	\N	\N	\N	\N	t	/cameras/cam-001/live	t	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CAM-003	Camera CO₂ Storage	cctv	CO₂ Storage Area	CO₂ Storage	active	Hikvision DS-2CD	v5.7.0	sukhri	\N	2024-01-17 10:00:00	\N	\N	\N	\N	t	/cameras/cam-001/live	t	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
BIO-001	Biometric Machine 1	biometric	Main Gate	Main Gate	active	ZKTeco K40	v6.0.0	sukhri	\N	2024-01-17 08:30:00	\N	\N	\N	\N	t	\N	f	28	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
FACE-001	Face Recognition Device 1	face	Quality Control	Quality Control	active	Hikvision Face Recognition	v4.1.0	sukhri	\N	2024-01-17 08:15:00	\N	\N	\N	\N	t	\N	f	12	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
FACE-002	Face Recognition Device 2	face	Block B Entrance	Block B	active	Hikvision Face Recognition	v4.1.0	sukhri	\N	2024-01-17 07:50:00	\N	\N	\N	\N	t	\N	f	8	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
CO2-SENSOR-001	CO₂ Sensor Barrel CO2-003	co2	Block B - Row 3	Block B	active	MH-Z19	v1.5.0	sukhri	CO2-003	2024-01-17 10:00:00	2024-01-17 10:00:00	800.00	3000.00	5000.00	t	\N	f	0	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5291 (class 0 OID 16813)
-- Dependencies: 237
-- Data for Name: file_uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.file_uploads (id, client_name, client_email, file_name, file_path, file_size, file_type, uploaded_by_user_id, upload_time, email_sent, email_sent_at, created_at) FROM stdin;
fc5b930d-a238-4983-98f4-e567aea98c86	John Doe	john.doe@example.com	vineyard_report_2024.pdf	/uploads/vineyard_report_2024.pdf	2048576	application/pdf	550e8400-e29b-41d4-a716-446655440001	2024-01-17 10:00:00	t	2024-01-17 10:00:05	2025-12-30 15:25:35.74205
f26631d2-d8d2-4480-9c02-ebb2cd66d1d5	Jane Smith	jane.smith@example.com	inventory_list.xlsx	/uploads/inventory_list.xlsx	512000	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet	550e8400-e29b-41d4-a716-446655440004	2024-01-17 11:30:00	t	2024-01-17 11:30:05	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5281 (class 0 OID 16551)
-- Dependencies: 227
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_items (id, name, category, current_stock, min_stock, unit, status, supplier, last_ordered_date, unit_price, total_value, created_at, updated_at) FROM stdin;
INV-001	Fertilizer NPK 20-20-20	Fertilizer	45.00	100.00	kg	low	AgriSupply Co.	2024-01-10	450.00	20250.00	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
INV-002	Pesticide - Organic	Pesticide	25.00	50.00	liters	low	GreenTech Solutions	2024-01-12	1200.00	30000.00	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
INV-003	Pruning Shears	Tools	15.00	20.00	pieces	low	ToolMaster Inc.	2024-01-08	850.00	12750.00	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
INV-004	Irrigation Pipes	Equipment	200.00	150.00	meters	ok	Irrigation Pro	2024-01-05	120.00	24000.00	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
INV-005	Vine Support Stakes	Equipment	500.00	300.00	pieces	ok	Vineyard Supplies	2024-01-03	45.00	22500.00	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5282 (class 0 OID 16569)
-- Dependencies: 228
-- Data for Name: inventory_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transactions (id, item_id, transaction_type, quantity, unit, reference_type, reference_id, performed_by_user_id, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5285 (class 0 OID 16643)
-- Dependencies: 231
-- Data for Name: post_requirements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_requirements (id, post_id, requirement, created_at) FROM stdin;
e0d9ba78-468b-4149-ba91-f21b1bf18d5a	POST-001	500 kg organic NPK fertilizer	2025-12-30 15:25:35.74205
3c96d7d2-1be7-4e7f-bb2c-a3456eaa407a	POST-001	Certified organic certification required	2025-12-30 15:25:35.74205
47384b91-e22f-4049-be11-f9a9048f16fd	POST-001	Delivery within 2 weeks	2025-12-30 15:25:35.74205
b36bccaa-fbd5-4575-b729-65be5bd7daf3	POST-001	Suitable for grape cultivation	2025-12-30 15:25:35.74205
39745657-c071-4992-a89b-6bf01cbc97ca	POST-002	Monthly maintenance contract	2025-12-30 15:25:35.74205
b238d2de-d750-4392-8075-6320b6c26703	POST-002	Equipment: pruning machines, irrigation systems, temperature sensors	2025-12-30 15:25:35.74205
8963912a-d114-41c0-bc3e-d4f3e0eb4669	POST-002	24/7 emergency support	2025-12-30 15:25:35.74205
f6dc8751-4988-42fb-8988-b9f1651b6e33	POST-002	Experienced technicians	2025-12-30 15:25:35.74205
c6083e57-5e0a-43e8-b766-4363481acbf3	POST-003	Monthly CO₂ refilling for 10 barrels	2025-12-30 15:25:35.74205
e7dcc2e9-cbc4-4a80-8a7a-9cbd823c3098	POST-003	Safety certifications required	2025-12-30 15:25:35.74205
37f1a8b3-cbb7-475f-b569-881597ff1720	POST-003	Bulk refilling capability	2025-12-30 15:25:35.74205
74798bfa-0346-4a25-a3de-3c8b38887a04	POST-003	Long-term contract preferred	2025-12-30 15:25:35.74205
efbdeda0-1a4e-466e-bf9f-6fc9c681921c	POST-004	200 liters organic pesticide monthly	2025-12-30 15:25:35.74205
805461b2-b326-4c93-af3b-0a0f34411568	POST-004	Organic farming certified	2025-12-30 15:25:35.74205
2ceefca1-6b26-4958-84bc-c5d17fc00390	POST-004	Application guidance required	2025-12-30 15:25:35.74205
fac306d5-8e05-4fa8-a2dd-97373b6cb6a1	POST-004	Safety training for staff	2025-12-30 15:25:35.74205
a4bd66bf-05af-4b59-b8e0-3db3635fe64f	POST-005	50 sets of pruning shears	2025-12-30 15:25:35.74205
0789b907-b555-44f8-998e-dfd79a00c18e	POST-005	50 grape picking baskets	2025-12-30 15:25:35.74205
c6a4f741-ea85-483c-9e95-bdb860672567	POST-005	Quality control equipment	2025-12-30 15:25:35.74205
8e3e8471-6865-4510-ae9b-0fa0b9303a3c	POST-005	Commercial grade durability	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5284 (class 0 OID 16619)
-- Dependencies: 230
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, title, content, posted_by_user_id, posted_by_name, posted_by_role, status, posted_at, closed_at, created_at, updated_at) FROM stdin;
POST-001	Urgent Requirement: Organic Fertilizer Supply	We require 500 kg of organic NPK fertilizer for our vineyard operations. The fertilizer should be certified organic and suitable for grape cultivation. We need this delivered within 2 weeks. Please provide your best quote with delivery timeline.	550e8400-e29b-41d4-a716-446655440001	Rajesh Kumar	owner	open	2024-01-20 10:30:00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
POST-002	Equipment Maintenance Services Needed	We require a regular maintenance services for our vineyard equipment including pruning machines, irrigation systems, and temperature monitoring devices. This would be a monthly service contract. We need someone who can respond quickly to emergency repairs.	550e8400-e29b-41d4-a716-446655440002	Priya Sharma	hr	open	2024-01-19 14:15:00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
POST-003	CO₂ Refilling Service Required	We need regular CO₂ barrel refilling services. We have 10 barrels that need to be refilled monthly. The vendor should have proper safety certifications and be able to handle bulk refilling operations. We prefer a long-term contract with competitive pricing.	550e8400-e29b-41d4-a716-446655440004	Amit Patel	gm	open	2024-01-18 09:00:00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
POST-004	Pesticide and Organic Spray Solutions	We require organic pesticide solutions for pest control in our vineyard. The products should be environmentally friendly and approved for organic farming. We need approximately 200 liters per month. Vendor should provide application guidance and safety training.	550e8400-e29b-41d4-a716-446655440003	Sneha Reddy	admin	open	2024-01-17 16:45:00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
POST-005	Harvesting Tools and Equipment	We need to purchase new harvesting tools including pruning shears, grape picking baskets, and quality control equipment. The tools should be durable and suitable for commercial vineyard operations. We need 50 sets of each tool.	550e8400-e29b-41d4-a716-446655440001	Rajesh Kumar	owner	open	2024-01-16 11:20:00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5288 (class 0 OID 16734)
-- Dependencies: 234
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, purchase_order_id, item_name, quantity, unit, unit_price, total_price, inventory_item_id, created_at) FROM stdin;
be8834ff-477c-4b83-8a11-9c9b6f1a92a8	PO-2024-001	Fertilizer NPK 20-20-20	100.00	kg	450.00	45000.00	INV-001	2025-12-30 15:25:35.74205
b2d26c3d-260a-46ab-9376-ee6495713f12	PO-2024-001	Organic Compost	50.00	bags	450.00	22500.00	\N	2025-12-30 15:25:35.74205
59687494-2c71-413f-b4fb-0aee1b4ae6ab	PO-2024-002	Pesticide - Organic	30.00	liters	1200.00	36000.00	INV-002	2025-12-30 15:25:35.74205
e7c5424f-4717-4506-bc72-1919e4620bf1	PO-2024-003	Pruning Shears	10.00	pieces	850.00	8500.00	INV-003	2025-12-30 15:25:35.74205
eb4f9998-af46-470a-b209-a0988e50175f	PO-2024-003	Garden Tools Set	5.00	sets	850.00	4250.00	\N	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5287 (class 0 OID 16699)
-- Dependencies: 233
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, vendor_id, status, order_date, expected_delivery_date, delivery_date, requested_by_user_id, requested_by_name, requested_by_role, approved_by_user_id, approved_at, invoice_uploaded, invoice_url, dispatch_status, total_amount, notes, created_at, updated_at) FROM stdin;
PO-2024-001	V-001	pending_approval	2024-01-15	2024-01-20	\N	550e8400-e29b-41d4-a716-446655440004	General Manager	gm	\N	\N	f	\N	\N	67500.00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
PO-2024-002	V-002	approved	2024-01-16	2024-01-22	\N	550e8400-e29b-41d4-a716-446655440004	General Manager	gm	550e8400-e29b-41d4-a716-446655440001	2024-01-16 10:30:00	f	\N	pending	36000.00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
PO-2024-003	V-003	delivered	2024-01-10	2024-01-15	2024-01-14	550e8400-e29b-41d4-a716-446655440004	General Manager	gm	550e8400-e29b-41d4-a716-446655440001	2024-01-10 14:00:00	t	/invoices/PO-2024-003.pdf	delivered	12750.00	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5290 (class 0 OID 16790)
-- Dependencies: 236
-- Data for Name: task_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_comments (id, task_id, user_id, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5289 (class 0 OID 16756)
-- Dependencies: 235
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, title, type, assigned_to_user_id, assigned_to_name, status, priority, due_date, completed_at, barrel_id, zone, camera_zone, location, description, created_by_user_id, created_at, updated_at) FROM stdin;
TASK-001	Refill CO₂ Barrel CO2-003	co2_refill	550e8400-e29b-41d4-a716-446655440009	Mike Gas Filler	pending	high	2024-01-17	\N	CO2-003	\N	\N	Block B - Row 3	\N	550e8400-e29b-41d4-a716-446655440004	2024-01-16 08:00:00	2025-12-30 15:25:35.74205
TASK-002	Refill CO₂ Barrel CO2-005	co2_refill	550e8400-e29b-41d4-a716-446655440009	Mike Gas Filler	pending	high	2024-01-16	\N	CO2-005	\N	\N	Block C - Row 2	\N	550e8400-e29b-41d4-a716-446655440004	2024-01-15 14:30:00	2025-12-30 15:25:35.74205
TASK-003	Clean Block A - Row 1-5	cleaning	550e8400-e29b-41d4-a716-446655440007	John Cleaner	in_progress	medium	2024-01-17	\N	\N	Block A	CAM-001	Block A - Row 1-5	\N	550e8400-e29b-41d4-a716-446655440004	2024-01-17 07:00:00	2025-12-30 15:25:35.74205
TASK-004	Temperature Check - Block B	monitoring	550e8400-e29b-41d4-a716-446655440008	Sarah Caretaker	completed	low	2024-01-17	2024-01-17 09:30:00	\N	Block B	\N	Block B	\N	550e8400-e29b-41d4-a716-446655440004	2024-01-17 08:00:00	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5280 (class 0 OID 16528)
-- Dependencies: 226
-- Data for Name: temperature_readings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temperature_readings (id, device_id, reading_time, temperature, humidity, status, vineyard_id, zone, created_at) FROM stdin;
ea52183d-23ff-4e37-a137-20f4a6e65825	TEMP-001	2024-01-17 07:00:00	18.50	65.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
009177a8-0e1d-4986-a8d4-4be6c0665895	TEMP-001	2024-01-17 08:00:00	20.20	68.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
6532885a-0082-4b99-bb0c-76305d624328	TEMP-001	2024-01-17 09:00:00	22.80	70.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
a1c87f28-ae39-45a8-a9e5-a4e480d9c4a0	TEMP-001	2024-01-17 10:00:00	25.30	72.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
f0c30c84-55f1-4b3c-bf74-ea5af4aebbd4	TEMP-001	2024-01-17 11:00:00	27.10	75.00	warning	sukhri	Block A	2025-12-30 15:25:35.74205
704ce9a5-80dd-4614-baf2-7b266376d548	TEMP-001	2024-01-17 12:00:00	28.50	78.00	warning	sukhri	Block A	2025-12-30 15:25:35.74205
7ed76cca-fcc3-4c4e-917d-24ae33bc37ec	TEMP-001	2024-01-17 13:00:00	29.20	80.00	warning	sukhri	Block A	2025-12-30 15:25:35.74205
12598a24-caec-4a2f-8c5f-a5357659323f	TEMP-001	2024-01-17 14:00:00	30.10	82.00	critical	sukhri	Block A	2025-12-30 15:25:35.74205
e4868562-1acd-4ee9-96b0-bfc7594f463e	TEMP-001	2024-01-17 15:00:00	29.80	81.00	warning	sukhri	Block A	2025-12-30 15:25:35.74205
e0b1cb69-16e8-4938-9180-84290f9fcc3f	TEMP-001	2024-01-17 16:00:00	28.30	79.00	warning	sukhri	Block A	2025-12-30 15:25:35.74205
8cfe1909-558c-408e-8229-980047be7594	TEMP-001	2024-01-17 17:00:00	26.50	76.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
64b4f342-848b-486c-b408-3289e2c85731	TEMP-001	2024-01-17 18:00:00	24.20	73.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
e868e5c0-0834-462e-9379-6cf8831ea717	TEMP-001	2024-01-17 19:00:00	22.10	70.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
8f4c775d-0094-4252-a8c0-d92dda0122a4	TEMP-001	2024-01-17 20:00:00	20.50	68.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
3a52e6aa-ff3c-465b-bb07-03cf4e7e9aa3	TEMP-001	2024-01-17 21:00:00	19.20	66.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
0fb60980-970c-4940-824a-d8d9094ef125	TEMP-001	2024-01-17 22:00:00	18.80	65.00	normal	sukhri	Block A	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5275 (class 0 OID 16401)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, name, role, vineyard_id, phone, status, created_at, updated_at) FROM stdin;
550e8400-e29b-41d4-a716-446655440001	owner@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	Vineyard Owner	owner	all	+91 98765 43201	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440002	hr@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	HR Manager	hr	sukhri	+91 98765 43202	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440003	admin@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	System Admin	admin	sukhri	+91 98765 43203	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440004	gm@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	General Manager	gm	sukhri	+91 98765 43204	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440005	vendor@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	Vendor Partner	vendor	\N	+91 98765 43205	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440006	vendor@agrisupply.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	Agri Supply Vendor	vendor	\N	+91 98765 43206	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440007	cleaner@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	John Cleaner	cleaner	sukhri	+91 98765 43207	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440008	caretaker@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	Sarah Caretaker	caretaker	sukhri	+91 98765 43208	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
550e8400-e29b-41d4-a716-446655440009	gasfiller@sukrivineyard.com	$2a$10$cQjZZY9khB7RtBMfdLSXKOpNKvd1Ame4mnWO8DXcwHkpP4jCoU6Dm	Mike Gas Filler	gas-filler	sukhri	+91 98765 43209	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5283 (class 0 OID 16594)
-- Dependencies: 229
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, name, contact_email, phone, address, rating, total_orders, active_orders, status, on_time_delivery_percentage, quality_score, average_response_time_hours, user_id, created_at, updated_at) FROM stdin;
V-001	AgriSupply Co.	contact@agrisupply.com	+91 98765 43210	\N	4.50	45	3	active	92.00	4.30	24	550e8400-e29b-41d4-a716-446655440005	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
V-002	GreenTech Solutions	info@greentech.com	+91 98765 43211	\N	4.80	32	2	active	96.00	4.70	18	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
V-003	ToolMaster Inc.	sales@toolmaster.com	+91 98765 43212	\N	4.20	28	1	active	88.00	4.10	30	\N	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5274 (class 0 OID 16389)
-- Dependencies: 220
-- Data for Name: vineyards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vineyards (id, name, location, area_hectares, status, created_at, updated_at) FROM stdin;
all	All Vineyards	Multiple Locations	0.00	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
sukhri	Sukhri Vineyard	Nashik, Maharashtra	25.50	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
future1	Future Farm 1	Pune, Maharashtra	15.00	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
future2	Future Farm 2	Sangli, Maharashtra	20.00	active	2025-12-30 15:25:35.74205	2025-12-30 15:25:35.74205
\.


--
-- TOC entry 5074 (class 2606 OID 16678)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 16462)
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 16464)
-- Name: attendance_records attendance_records_user_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_user_id_attendance_date_key UNIQUE (user_id, attendance_date);


--
-- TOC entry 5045 (class 2606 OID 16491)
-- Name: co2_barrels co2_barrels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_barrels
    ADD CONSTRAINT co2_barrels_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 16493)
-- Name: co2_barrels co2_barrels_qr_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_barrels
    ADD CONSTRAINT co2_barrels_qr_code_key UNIQUE (qr_code);


--
-- TOC entry 5051 (class 2606 OID 16517)
-- Name: co2_refill_history co2_refill_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_refill_history
    ADD CONSTRAINT co2_refill_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 16441)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 5094 (class 2606 OID 16829)
-- Name: file_uploads file_uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_uploads
    ADD CONSTRAINT file_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 5061 (class 2606 OID 16568)
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5064 (class 2606 OID 16583)
-- Name: inventory_transactions inventory_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5072 (class 2606 OID 16654)
-- Name: post_requirements post_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_requirements
    ADD CONSTRAINT post_requirements_pkey PRIMARY KEY (id);


--
-- TOC entry 5070 (class 2606 OID 16637)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 5084 (class 2606 OID 16745)
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5082 (class 2606 OID 16718)
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5092 (class 2606 OID 16802)
-- Name: task_comments task_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_pkey PRIMARY KEY (id);


--
-- TOC entry 5090 (class 2606 OID 16774)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 5057 (class 2606 OID 16540)
-- Name: temperature_readings temperature_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temperature_readings
    ADD CONSTRAINT temperature_readings_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 16419)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5031 (class 2606 OID 16417)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5068 (class 2606 OID 16613)
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 16400)
-- Name: vineyards vineyards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vineyards
    ADD CONSTRAINT vineyards_pkey PRIMARY KEY (id);


--
-- TOC entry 5075 (class 1259 OID 16862)
-- Name: idx_applications_post_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_post_id ON public.applications USING btree (post_id);


--
-- TOC entry 5076 (class 1259 OID 16864)
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_status ON public.applications USING btree (status);


--
-- TOC entry 5077 (class 1259 OID 16863)
-- Name: idx_applications_vendor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_applications_vendor_id ON public.applications USING btree (vendor_id);


--
-- TOC entry 5041 (class 1259 OID 16839)
-- Name: idx_attendance_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_date ON public.attendance_records USING btree (attendance_date);


--
-- TOC entry 5042 (class 1259 OID 16840)
-- Name: idx_attendance_user_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_user_date ON public.attendance_records USING btree (user_id, attendance_date);


--
-- TOC entry 5043 (class 1259 OID 16838)
-- Name: idx_attendance_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_user_id ON public.attendance_records USING btree (user_id);


--
-- TOC entry 5048 (class 1259 OID 16842)
-- Name: idx_co2_barrels_next_due; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_co2_barrels_next_due ON public.co2_barrels USING btree (next_due_date);


--
-- TOC entry 5049 (class 1259 OID 16841)
-- Name: idx_co2_barrels_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_co2_barrels_status ON public.co2_barrels USING btree (status);


--
-- TOC entry 5052 (class 1259 OID 16843)
-- Name: idx_co2_refill_barrel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_co2_refill_barrel_id ON public.co2_refill_history USING btree (barrel_id);


--
-- TOC entry 5034 (class 1259 OID 16860)
-- Name: idx_devices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_devices_status ON public.devices USING btree (status);


--
-- TOC entry 5035 (class 1259 OID 16859)
-- Name: idx_devices_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_devices_type ON public.devices USING btree (type);


--
-- TOC entry 5036 (class 1259 OID 16861)
-- Name: idx_devices_vineyard_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_devices_vineyard_id ON public.devices USING btree (vineyard_id);


--
-- TOC entry 5095 (class 1259 OID 16865)
-- Name: idx_file_uploads_client_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_file_uploads_client_email ON public.file_uploads USING btree (client_email);


--
-- TOC entry 5096 (class 1259 OID 16866)
-- Name: idx_file_uploads_upload_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_file_uploads_upload_time ON public.file_uploads USING btree (upload_time);


--
-- TOC entry 5058 (class 1259 OID 16848)
-- Name: idx_inventory_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_category ON public.inventory_items USING btree (category);


--
-- TOC entry 5059 (class 1259 OID 16847)
-- Name: idx_inventory_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_status ON public.inventory_items USING btree (status);


--
-- TOC entry 5062 (class 1259 OID 16849)
-- Name: idx_inventory_transactions_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transactions_item_id ON public.inventory_transactions USING btree (item_id);


--
-- TOC entry 5078 (class 1259 OID 16854)
-- Name: idx_po_requested_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_requested_by ON public.purchase_orders USING btree (requested_by_user_id);


--
-- TOC entry 5079 (class 1259 OID 16853)
-- Name: idx_po_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_status ON public.purchase_orders USING btree (status);


--
-- TOC entry 5080 (class 1259 OID 16852)
-- Name: idx_po_vendor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_po_vendor_id ON public.purchase_orders USING btree (vendor_id);


--
-- TOC entry 5085 (class 1259 OID 16855)
-- Name: idx_tasks_assigned_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_assigned_to ON public.tasks USING btree (assigned_to_user_id);


--
-- TOC entry 5086 (class 1259 OID 16857)
-- Name: idx_tasks_due_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_due_date ON public.tasks USING btree (due_date);


--
-- TOC entry 5087 (class 1259 OID 16856)
-- Name: idx_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);


--
-- TOC entry 5088 (class 1259 OID 16858)
-- Name: idx_tasks_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tasks_type ON public.tasks USING btree (type);


--
-- TOC entry 5053 (class 1259 OID 16846)
-- Name: idx_temperature_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_temperature_date ON public.temperature_readings USING btree (reading_time);


--
-- TOC entry 5054 (class 1259 OID 16844)
-- Name: idx_temperature_device_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_temperature_device_id ON public.temperature_readings USING btree (device_id);


--
-- TOC entry 5055 (class 1259 OID 16845)
-- Name: idx_temperature_reading_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_temperature_reading_time ON public.temperature_readings USING btree (reading_time);


--
-- TOC entry 5025 (class 1259 OID 16835)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 5026 (class 1259 OID 16836)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5027 (class 1259 OID 16837)
-- Name: idx_users_vineyard_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_vineyard_id ON public.users USING btree (vineyard_id);


--
-- TOC entry 5065 (class 1259 OID 16850)
-- Name: idx_vendors_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendors_status ON public.vendors USING btree (status);


--
-- TOC entry 5066 (class 1259 OID 16851)
-- Name: idx_vendors_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendors_user_id ON public.vendors USING btree (user_id);


--
-- TOC entry 5112 (class 2606 OID 16689)
-- Name: applications applications_applied_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_applied_by_user_id_fkey FOREIGN KEY (applied_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5113 (class 2606 OID 16679)
-- Name: applications applications_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 5114 (class 2606 OID 16694)
-- Name: applications applications_reviewed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5115 (class 2606 OID 16684)
-- Name: applications applications_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 16470)
-- Name: attendance_records attendance_records_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE SET NULL;


--
-- TOC entry 5100 (class 2606 OID 16465)
-- Name: attendance_records attendance_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 16499)
-- Name: co2_barrels co2_barrels_filled_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_barrels
    ADD CONSTRAINT co2_barrels_filled_by_user_id_fkey FOREIGN KEY (filled_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5102 (class 2606 OID 16494)
-- Name: co2_barrels co2_barrels_vineyard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_barrels
    ADD CONSTRAINT co2_barrels_vineyard_id_fkey FOREIGN KEY (vineyard_id) REFERENCES public.vineyards(id) ON DELETE SET NULL;


--
-- TOC entry 5103 (class 2606 OID 16518)
-- Name: co2_refill_history co2_refill_history_barrel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_refill_history
    ADD CONSTRAINT co2_refill_history_barrel_id_fkey FOREIGN KEY (barrel_id) REFERENCES public.co2_barrels(id) ON DELETE CASCADE;


--
-- TOC entry 5104 (class 2606 OID 16523)
-- Name: co2_refill_history co2_refill_history_filled_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.co2_refill_history
    ADD CONSTRAINT co2_refill_history_filled_by_user_id_fkey FOREIGN KEY (filled_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5098 (class 2606 OID 16442)
-- Name: devices devices_vineyard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_vineyard_id_fkey FOREIGN KEY (vineyard_id) REFERENCES public.vineyards(id) ON DELETE SET NULL;


--
-- TOC entry 5126 (class 2606 OID 16830)
-- Name: file_uploads file_uploads_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_uploads
    ADD CONSTRAINT file_uploads_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5107 (class 2606 OID 16584)
-- Name: inventory_transactions inventory_transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.inventory_items(id) ON DELETE CASCADE;


--
-- TOC entry 5108 (class 2606 OID 16589)
-- Name: inventory_transactions inventory_transactions_performed_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transactions
    ADD CONSTRAINT inventory_transactions_performed_by_user_id_fkey FOREIGN KEY (performed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5111 (class 2606 OID 16655)
-- Name: post_requirements post_requirements_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_requirements
    ADD CONSTRAINT post_requirements_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- TOC entry 5110 (class 2606 OID 16638)
-- Name: posts posts_posted_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_posted_by_user_id_fkey FOREIGN KEY (posted_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5119 (class 2606 OID 16751)
-- Name: purchase_order_items purchase_order_items_inventory_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_items(id) ON DELETE SET NULL;


--
-- TOC entry 5120 (class 2606 OID 16746)
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- TOC entry 5116 (class 2606 OID 16729)
-- Name: purchase_orders purchase_orders_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5117 (class 2606 OID 16724)
-- Name: purchase_orders purchase_orders_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5118 (class 2606 OID 16719)
-- Name: purchase_orders purchase_orders_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5124 (class 2606 OID 16803)
-- Name: task_comments task_comments_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- TOC entry 5125 (class 2606 OID 16808)
-- Name: task_comments task_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_comments
    ADD CONSTRAINT task_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5121 (class 2606 OID 16775)
-- Name: tasks tasks_assigned_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_user_id_fkey FOREIGN KEY (assigned_to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5122 (class 2606 OID 16780)
-- Name: tasks tasks_barrel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_barrel_id_fkey FOREIGN KEY (barrel_id) REFERENCES public.co2_barrels(id) ON DELETE SET NULL;


--
-- TOC entry 5123 (class 2606 OID 16785)
-- Name: tasks tasks_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5105 (class 2606 OID 16541)
-- Name: temperature_readings temperature_readings_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temperature_readings
    ADD CONSTRAINT temperature_readings_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- TOC entry 5106 (class 2606 OID 16546)
-- Name: temperature_readings temperature_readings_vineyard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temperature_readings
    ADD CONSTRAINT temperature_readings_vineyard_id_fkey FOREIGN KEY (vineyard_id) REFERENCES public.vineyards(id) ON DELETE SET NULL;


--
-- TOC entry 5097 (class 2606 OID 16420)
-- Name: users users_vineyard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_vineyard_id_fkey FOREIGN KEY (vineyard_id) REFERENCES public.vineyards(id) ON DELETE SET NULL;


--
-- TOC entry 5109 (class 2606 OID 16614)
-- Name: vendors vendors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


-- Completed on 2025-12-30 17:27:44

--
-- PostgreSQL database dump complete
--

\unrestrict KAWIH7SibAglF38HeUcb5Zm6yj3MFMJMWgTMS21xfb1QO8GluYdI6Xz5XRRZGCw

-- Migration: Add created_by_user_id column to users table
-- This allows tracking which user created each user account

-- Add the column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by_user_id);

-- For existing users without a creator, they will have NULL which will display as "Owner" in the UI

