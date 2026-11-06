-- ============================================================================
-- HU08 · Panel de gestión de usuarios registrados
-- Ejecutar UNA VEZ en Supabase > SQL Editor (es re-ejecutable: usa "or replace").
-- Reemplaza al "endpoint" GET /api/admin/users y al endpoint de bloqueo:
--   · GET  /api/admin/users  ->  supabase.rpc('admin_list_users')
--   · POST bloquear/eliminar ->  supabase.rpc('admin_set_user_status', {...})
-- ============================================================================

-- 1) Helpers de seguridad ----------------------------------------------------

-- ¿El usuario de la sesión actual es admin y su cuenta sigue activa?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
      and u.estado_activo = true
      and u.deleted_at is null
  );
$$;

-- ¿La cuenta de la sesión actual sigue activa? (para usar dentro de políticas RLS)
-- Un JWT ya emitido sigue siendo "válido" hasta que expira (1 h por defecto);
-- con esta función, una cuenta bloqueada deja de pasar las políticas igualmente.
create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.estado_activo = true
      and u.deleted_at is null
  );
$$;

-- 2) Endpoint de listado: solo usuarios con rol estándar ('user') ------------

create or replace function public.admin_list_users()
returns table (
  id uuid,
  nombre varchar,
  email varchar,
  fecha_registro timestamptz,
  estado_activo boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  return query
    select u.id, u.nombre, u.email, u.fecha_registro, u.estado_activo
    from public.users u
    where u.role = 'user'
      and u.deleted_at is null
    order by u.fecha_registro desc;
end;
$$;

-- 3) Endpoint de acción: bloquear / desbloquear / eliminar (soft-delete) -----

create or replace function public.admin_set_user_status(p_user_id uuid, p_action text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text;
begin
  if not public.is_admin() then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  if p_action not in ('block', 'unblock', 'delete') then
    raise exception 'Acción inválida' using errcode = '22023';
  end if;

  select u.role into v_role
  from public.users u
  where u.id = p_user_id and u.deleted_at is null;

  if v_role is null then
    raise exception 'Usuario no encontrado' using errcode = 'P0002';
  end if;

  -- Un admin solo puede gestionar usuarios estándar (no a sí mismo ni a otros admin/operator)
  if v_role <> 'user' then
    raise exception 'Solo se pueden gestionar usuarios con rol estándar' using errcode = '42501';
  end if;

  if p_action = 'unblock' then
    update public.users
       set estado_activo = true, updated_at = now()
     where id = p_user_id;

    update auth.users set banned_until = null where id = p_user_id;
    return;
  end if;

  -- block / delete
  update public.users
     set estado_activo = false,
         deleted_at = case when p_action = 'delete' then now() else deleted_at end,
         updated_at = now()
   where id = p_user_id;

  -- Impide nuevo login y renovación de token ("User is banned" en Supabase Auth)
  update auth.users
     set banned_until = now() + interval '100 years'
   where id = p_user_id;

  -- Invalida las sesiones existentes: el refresh token deja de servir
  delete from auth.refresh_tokens where user_id = p_user_id::text;
  delete from auth.sessions where user_id = p_user_id;
end;
$$;

-- 4) Permisos: solo usuarios autenticados pueden invocarlas -------------------
-- (igualmente cada función verifica is_admin() adentro)

revoke all on function public.is_admin() from public, anon;
revoke all on function public.is_active_user() from public, anon;
revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_set_user_status(uuid, text) from public, anon;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_active_user() to authenticated;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_set_user_status(uuid, text) to authenticated;