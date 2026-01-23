import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();
    const webhookUrl = import.meta.env.WEBHOOK_URL;

    if (!webhookUrl) {
        return new Response(JSON.stringify({
            message: "Server Configuration Error: Webhook URL not found"
        }), { status: 500 });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return new Response(JSON.stringify({
                message: "Success!"
            }), { status: 200 });
        } else {
            return new Response(JSON.stringify({
                message: "Failed to send data to webhook"
            }), { status: 500 });
        }
    } catch (error: any) {
        return new Response(JSON.stringify({
            message: "Error sending data: " + error.message
        }), { status: 500 });
    }
};
