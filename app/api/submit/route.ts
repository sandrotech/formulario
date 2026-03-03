import { NextResponse } from "next/server";
import { salvarResposta } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data: any = {};

        for (const [key, value] of formData.entries()) {
            if (key !== "curriculo") {
                data[key] = value;
            }
        }

        const file = formData.get("curriculo") as File | null;
        if (file && file.size > 0 && file.name) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const curDir = path.join(process.cwd(), "data", "curriculos");
            if (!fs.existsSync(curDir)) {
                fs.mkdirSync(curDir, { recursive: true });
            }

            const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            fs.writeFileSync(path.join(curDir, filename), buffer);
            data.curriculo = filename;
        }

        await salvarResposta(data);
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("ERRO AO SALVAR:", e);
        return NextResponse.json({ error: "Erro interno ao salvar" }, { status: 500 });
    }
}
