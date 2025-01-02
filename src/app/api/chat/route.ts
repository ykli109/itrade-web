import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的金融投资助手，擅长解答股票、基金等投资相关问题。请用简洁专业的语言回答用户的问题。回答时使用 Markdown 格式，注意表格格式要对齐，不要有多余的空格。",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 8000,
      stream: true,
    });

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    (async () => {
      try {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            const formattedText = text
              .split("\n")
              .map((line) => line.trimStart())
              .join("\n");
            await writer.write(new TextEncoder().encode(formattedText));
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);
      } finally {
        try {
          await writer.close();
        } catch (error) {
          console.error("Error closing writer:", error);
        }
      }
    })();

    return new Response(stream.readable);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "处理请求失败，请稍后重试" },
      { status: 500 }
    );
  }
}
