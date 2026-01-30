const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const { db_id } = event.queryStringParameters;
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  // Debugging-Header für Patrick (wird nur im Fehlerfall nützlich)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (!NOTION_TOKEN) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "NOTION_TOKEN nicht gesetzt" }) };
  }

  try {
    let response;
    if (event.httpMethod === "GET") {
      response = await fetch(`https://api.notion.com/v1/databases/${db_id}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      });
    } else if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      response = await fetch(`https://api.notion.com/v1/pages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parent: { database_id: db_id },
          properties: body.properties
        })
      });
    }

    const data = await response.json();
    return {
      statusCode: response.ok ? 200 : response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
