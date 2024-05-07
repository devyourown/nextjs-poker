import { updateImageUrl } from "@/app/lib/data";
import { auth } from "@/auth";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
    const form = await req.formData();
    const file: File = (form.get("image") as File) || null;
    console.log(file);
    if (!file)
        return NextResponse.json(
            { error: "No files received." },
            { status: 400 }
        );

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    console.log(`Image ${filename} is saved...`);
    try {
        await writeFile(
            path.join(process.cwd(), "public/users/images/" + filename),
            buffer
        );
        const session = await auth();
        await updateImageUrl(session?.user.id!, filename);
        return NextResponse.json({ Message: "Image is saved!", status: 201 });
    } catch (error) {
        console.error("Image Upload Error : ", error);
        return NextResponse.json({
            Message: "Failed to save image.",
            status: 500,
        });
    }
}
