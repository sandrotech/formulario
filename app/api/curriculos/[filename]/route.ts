import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request, { params }: { params: Promise<{ filename: string }> }) {
    const { filename } = await params;

    // Prevent directory traversal
    const safeFilename = path.basename(filename);

    const curPath = path.join(process.cwd(), "data", "curriculos", safeFilename);

    if (!fs.existsSync(curPath)) {
        return new NextResponse("Not Found", { status: 404 });
    }

    const file = fs.readFileSync(curPath);
    return new NextResponse(file, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${safeFilename}"`
        }
    });
}
