import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

function LottieLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: any;
    if (containerRef.current) {
      import('lottie-web').then((lottieModule) => {
        const lottiePlayer = lottieModule.default || lottieModule;
        anim = lottiePlayer.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: defaultLoadingAnimation,
        });
      }).catch(() => {
        // Fallback silencioso
      });
    }

    return () => {
      if (anim) anim.destroy();
    };
  }, []);

  return <div ref={containerRef} className="size-5" />;
}

// Schema con validación estricta de seguridad
const contactSchema = z.object({
  sender_name: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre excede el límite permitido'),
  sender_email: z
    .string()
    .trim()
    .email('Debe ingresar un correo electrónico válido')
    .max(100, 'El correo excede el límite permitido'),
  subject: z.enum(['Consulta General', 'Cotización de Proyectos', 'Asesoría Técnica'], {
    errorMap: () => ({ message: 'Seleccione un tipo de consulta válido' }),
  }),
  body: z
    .string()
    .trim()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje excede los 2000 caracteres'),
})

type ContactFormData = z.infer<typeof contactSchema>

// Animación Lottie fallback integrada
const defaultLoadingAnimation = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 60,
  w: 60,
  h: 60,
  nm: 'Loader',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Spinner',
      sr: 1,
      ks: {
        o: { k: 100 },
        r: {
          k: [
            { t: 0, s: [0] },
            { t: 60, s: [360] },
          ],
        },
        p: { k: [30, 30, 0] },
        a: { k: [0, 0, 0] },
        s: { k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              d: 1,
              s: { k: [40, 40] },
              p: { k: [0, 0] },
              nm: 'Path',
            },
            {
              ty: 'st',
              c: { k: [1, 0.35, 0.1, 1] },
              o: { k: 100 },
              w: { k: 4 },
              lc: 2,
              nm: 'Stroke',
            },
            {
              ty: 'tm',
              s: { k: 0 },
              e: { k: 70 },
              o: { k: 0 },
              m: 1,
              nm: 'Trim',
            },
          ],
          nm: 'Circle',
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setServerError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resJson = await response.json()

      if (!response.ok) {
        throw new Error(resJson.error || 'Ocurrió un error al enviar el formulario')
      }

      setSuccess(true)
      reset()
    } catch (err: any) {
      setServerError(err.message || 'Error de conexión con el servidor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-default bg-surface p-6 shadow-lg lg:col-span-7">
      <div className="mb-6 border-b border-subtle pb-3">
        <h3 className="font-display text-sm font-bold text-text-primary">
          Enviar Mensaje Directo
        </h3>
        <p className="font-mono text-[11px] text-text-tertiary">
          Cotización de proyectos, consultas generales o asesoría técnica
        </p>
      </div>

      {success && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-accent/30 bg-accent-surface p-4 text-xs text-text-primary"
        >
          <p className="font-mono font-semibold text-accent">✓ Mensaje enviado correctamente</p>
          <p className="mt-1 text-text-secondary">
            Nos pondremos en contacto contigo a la brevedad vía correo electrónico.
          </p>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-500"
        >
          <p className="font-mono font-semibold">✕ Error en el envío</p>
          <p className="mt-1">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block font-mono text-[11px] font-semibold text-text-secondary">
            Nombre completo
          </label>
          <input
            {...register('sender_name')}
            placeholder="Ej: Ada Lovelace"
            className="w-full rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          {errors.sender_name && (
            <p className="mt-1 font-mono text-[10px] text-red-500">{errors.sender_name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-mono text-[11px] font-semibold text-text-secondary">
            Correo electrónico
          </label>
          <input
            {...register('sender_email')}
            type="email"
            placeholder="ada@ejemplo.com"
            className="w-full rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          {errors.sender_email && (
            <p className="mt-1 font-mono text-[10px] text-red-500">{errors.sender_email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-mono text-[11px] font-semibold text-text-secondary">
            Asunto / Tipo de solicitud
          </label>
          <select
            {...register('subject')}
            defaultValue=""
            className="w-full rounded-lg border border-default bg-elevated px-3 py-2 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
          >
            <option value="" disabled>
              Seleccione una opción...
            </option>
            <option value="Consulta General">Consulta General</option>
            <option value="Cotización de Proyectos">Cotización de Proyectos</option>
            <option value="Asesoría Técnica">Asesoría Técnica</option>
          </select>
          {errors.subject && (
            <p className="mt-1 font-mono text-[10px] text-red-500">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-mono text-[11px] font-semibold text-text-secondary">
            Mensaje
          </label>
          <textarea
            {...register('body')}
            rows={4}
            placeholder="Describa el alcance de su proyecto o consulta..."
            className="w-full resize-none rounded-lg border border-default bg-elevated px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          {errors.body && (
            <p className="mt-1 font-mono text-[10px] text-red-500">{errors.body.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <LottieLoader />
              <span>Enviando...</span>
            </div>
          ) : (
            <span>Enviar mensaje →</span>
          )}
        </button>
      </form>
    </div>
  )
}