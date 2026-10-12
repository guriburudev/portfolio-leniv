-- ==============================================================================
-- HU04 - Configuración de Base de Datos y Modelos (Portfolio)
-- Motor: Supabase (PostgreSQL)
-- Responsable: Sebastián
-- ==============================================================================

-- 1. Habilitar extensión para generación de identificadores únicos (UUID)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Función reutilizable para actualizar automáticamente la columna updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLA: users (Usuarios del sistema)
-- Campos solicitados: id, nombre, email, password, role, fecha_registro, estado_activo, deleted_at
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Almacena hash encriptado (ej. bcrypt)
    role VARCHAR(50) NOT NULL DEFAULT 'Admin' CHECK (role IN ('Admin', 'Collaborator', 'User')),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    estado_activo BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Soporte para Soft Delete
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    
    -- Control de auditoría de actualización
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índice único en el campo email (ignora usuarios soft-deleted o único global)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(LOWER(email)) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Trigger para updated_at en users
DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- TABLA: projects (Proyectos del Portfolio)
-- Campos solicitados: id, título, descripción, tags_tecnologías, image_url, demo_url, repo_url, timestamps, deleted_at
-- ==============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    tags_tecnologias TEXT[] DEFAULT '{}'::TEXT[] NOT NULL, -- Array de tecnologías: ej. ['React', 'Node.js', 'PostgreSQL']
    image_url TEXT DEFAULT NULL,
    demo_url TEXT DEFAULT NULL,
    repo_url TEXT DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Soporte para Soft Delete
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Trigger para updated_at en projects
DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- TABLA: messages (Mensajes recibidos del formulario de contacto)
-- Campos solicitados: id, sender_name, sender_email, subject, body, status, fecha_envio, deleted_at
-- ==============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' NOT NULL CHECK (status IN ('unread', 'read', 'archived')),
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Timestamps y Soft Delete
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_messages_fecha_envio ON messages(fecha_envio DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- Trigger para updated_at en messages
DROP TRIGGER IF EXISTS set_messages_updated_at ON messages;
CREATE TRIGGER set_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ==============================================================================
-- VISTAS CONVENIENTES (Opcional: consultas automáticas con soft-delete excluido)
-- ==============================================================================
CREATE OR REPLACE VIEW active_users AS 
    SELECT * FROM users WHERE deleted_at IS NULL AND estado_activo = TRUE;

CREATE OR REPLACE VIEW active_projects AS 
    SELECT * FROM projects WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_messages AS 
    SELECT * FROM messages WHERE deleted_at IS NULL;
