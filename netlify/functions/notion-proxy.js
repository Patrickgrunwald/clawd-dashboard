const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const { db_id } = event.queryStringParameters;
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  if (!NOTION_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "NOTION_TOKEN not set" }) };
  }

  try {
    // GET -> Datenbank abfragen
    if (event.httpMethod === "GET") {
      const response = await fetch(`https://api.notion.com/v1/databases/${db_id}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }

    // POST -> Neue Seite (Task) erstellen
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      const response = await fetch(`https://api.notion.com/v1/pages`, {
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
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
