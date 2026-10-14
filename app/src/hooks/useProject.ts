import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/project';

export function useProject(id: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null) // soft delete (HU04)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setError('No pudimos cargar el proyecto. Intentá de nuevo.');
        else if (!data) setError('Este proyecto no existe o fue eliminado.');
        else setProject(data as Project);
        setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  return { project, loading, error };
}
