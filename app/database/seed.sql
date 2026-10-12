-- ==============================================================================
-- HU04 - Script de Seed Alternativo en SQL (Para ejecutar directamente en Supabase SQL Editor)
-- ==============================================================================

-- 1. Limpiar datos existentes en users
DELETE FROM users;

-- 2. Insertar usuario Admin por defecto
-- La contraseña por defecto es 'Admin1234!' encriptada con algoritmo Blowfish (bcrypt) mediante pgcrypto
INSERT INTO users (
    nombre,
    email,
    password,
    role,
    estado_activo,
    deleted_at
) VALUES (
    'Administrador Principal',
    'admin@portfolio.com',
    crypt('Admin1234!', gen_salt('bf', 10)),
    'Admin',
    TRUE,
    NULL
);

-- 3. (Opcional) Proyectos iniciales de demostración
DELETE FROM projects;
INSERT INTO projects (
    titulo,
    descripcion,
    tags_tecnologias,
    image_url,
    demo_url,
    repo_url,
    deleted_at
) VALUES (
    'Portfolio Web Fullstack',
    'Plataforma web interactiva para exhibición de proyectos y recepción de mensajes de contacto.',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Supabase'],
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    'https://portfolio-demo.com',
    'https://github.com/usuario/portfolio',
    NULL
);

-- Verificar inserción
SELECT id, nombre, email, role, estado_activo, fecha_registro, deleted_at FROM users;
