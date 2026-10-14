import { useEffect, useState } from 'react';

// Demo de prueba: clima actual con Open-Meteo (API pública, sin API key).
const CITIES = {
  Salta: { lat: -24.78, lon: -65.41 },
  'Buenos Aires': { lat: -34.61, lon: -58.38 },
  Madrid: { lat: 40.42, lon: -3.7 },
} as const;
type City = keyof typeof CITIES;

interface Weather {
  temperature: number;
  windspeed: number;
}

export default function ExternalApiDemo() {
  const [city, setCity] = useState<City>('Salta');
  const [data, setData] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { lat, lon } = CITIES[city];
    setLoading(true);
    setError(false);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      { signal: controller.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((json) => {
        setData({
          temperature: json.current_weather.temperature,
          windspeed: json.current_weather.windspeed,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [city, retry]);

  return (
    <section
      aria-labelledby="demo-title"
      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="demo-title" className="text-lg font-semibold text-white">
          Demo: clima en vivo
        </h2>
        <label className="text-sm text-zinc-400">
          Ciudad{' '}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as City)}
            className="ml-2 rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-zinc-100"
          >
            {Object.keys(CITIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <div className="h-20 animate-pulse rounded-xl bg-white/10" role="status" aria-label="Cargando clima" />}

      {error && !loading && (
        <div role="alert" className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          <p className="font-medium">No pudimos conectar con el servicio de clima.</p>
          <p className="mt-1 text-red-200/80">El resto del proyecto sigue disponible. Probá de nuevo en unos segundos.</p>
          <button
            type="button"
            onClick={() => setRetry((n) => n + 1)}
            className="mt-3 rounded-md bg-red-400/20 px-3 py-1.5 text-red-100 hover:bg-red-400/30"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && !loading && !error && (
        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/5 p-4">
            <dt className="text-sm text-zinc-400">Temperatura</dt>
            <dd className="text-3xl font-semibold text-white">{data.temperature} °C</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-4">
            <dt className="text-sm text-zinc-400">Viento</dt>
            <dd className="text-3xl font-semibold text-white">{data.windspeed} km/h</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
