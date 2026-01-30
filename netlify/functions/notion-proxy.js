const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const { db_id } = event.queryStringParameters;
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  if (!NOTION_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: "NOTION_TOKEN not set in Netlify env" }) };
  }

  try {
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
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
