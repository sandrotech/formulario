import { NextResponse } from "next/server";
import { lerRespostas } from "@/lib/db";
import bcrypt from "bcryptjs";

// Hash the password so it's not exposed in plaintext. Corresponds to 'Cometa@123'
const SENHA_HASH = "$2b$10$BHTZROStlXak7.H5v4uGYulMahFI7oR7eeoDWMMBwRT7xmk/vm1qq";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.senha || !bcrypt.compareSync(body.senha, SENHA_HASH)) {
            return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
        }

        const respostas = await lerRespostas();
        return NextResponse.json(respostas);
    } catch {
        return NextResponse.json({ error: "Ocorreu um erro no servidor" }, { status: 500 });
    }
}
