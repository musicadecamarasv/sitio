import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
      status: 400,
    });
  }

  const res = await fetch('https://api.github.com/repos/musicadecamarasv/sitio/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      title: `Mensaje de contacto: ${name}`,
      body: `**Nombre:** ${name}\n**Correo:** ${email}\n\n---\n\n${message}`,
      labels: ['contacto'],
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Error al enviar el mensaje' }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
