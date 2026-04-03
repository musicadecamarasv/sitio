import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Correo electrónico requerido' }), {
      status: 400,
    });
  }

  const apiKey = env.MAILERLITE_API_KEY;
  const groupId = env.MAILERLITE_GROUP_ID;

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      groups: [groupId],
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    const message = data?.message || 'Error al suscribirse';
    return new Response(JSON.stringify({ error: message }), {
      status: res.status,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
