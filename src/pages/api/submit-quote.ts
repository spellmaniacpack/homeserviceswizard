import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    // Log the incoming request body
    let data;
    try {
        data = await request.json();
        console.log("Received form submission:", JSON.stringify(data));
    } catch (e) {
        console.error("Failed to parse request JSON");
        return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
    }

    // Try to get the webhook URL from multiple sources
    const webhookUrl = import.meta.env.WEBHOOK_URL || process.env.WEBHOOK_URL;

    console.log("Using Webhook URL:", webhookUrl ? "FOUND (starts with " + webhookUrl.substring(0, 5) + ")" : "NOT FOUND");

    if (!webhookUrl) {
        console.error("CRITICAL: WEBHOOK_URL environment variable is missing!");
        return new Response(JSON.stringify({
            message: "Server Configuration Error: Webhook URL not found"
        }), { status: 500 });
    }

    try {
        console.log("Attempting to fetch webhook...");
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        console.log("Webhook response status:", response.status);

        if (response.ok) {
            return new Response(JSON.stringify({
                message: "Success!"
            }), { status: 200 });
        } else {
            const responseText = await response.text();
            console.error("Webhook failed. Status:", response.status, "Body:", responseText);
            return new Response(JSON.stringify({
                message: "Failed to send data to webhook: " + response.status
            }), { status: 500 });
        }
    } catch (error: any) {
        console.error("Fetch threw an error:", error);
        return new Response(JSON.stringify({
            message: "Error sending data: " + error.message
        }), { status: 500 });
    }
};
