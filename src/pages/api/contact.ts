import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
        status: 400,
      });
    }

    const token = env.GITHUB_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'GITHUB_TOKEN not configured' }), {
        status: 500,
      });
    }

    const res = await fetch('https://api.github.com/repos/musicadecamarasv/sitio/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'musicadecamarasv-contact-form',
      },
      body: JSON.stringify({
        title: `Mensaje de contacto: ${name}`,
        body: `**Nombre:** ${name}\n**Correo:** ${email}\n\n---\n\n${message}`,
        labels: ['contacto'],
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify({ error: 'Error al enviar el mensaje', debug: data }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', debug: String(err) }), {
      status: 500,
    });
  }
};
