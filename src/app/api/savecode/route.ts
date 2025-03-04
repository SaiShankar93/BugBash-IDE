import connect from "@/dbConfig/dbConfig";
import SaveCode from '@/models/saveModel';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    await connect();
    const { codes, username } = await req.json();

    if (!codes || !username) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const existingUser = await SaveCode.findOne({ username });

        if (existingUser) {
            // Update the existing user's codes
            existingUser.codes = codes;
            await existingUser.save();
            return NextResponse.json({ message: 'Code updated successfully!' }, { status: 200 });
        } else {
            // Create a new document for the user
            const newCode = new SaveCode({ codes, username });
            await newCode.save();
            return NextResponse.json({ message: 'Code saved successfully!' }, { status: 201 });
        }
    } catch (error) {
        console.error('Error saving code:', error);
        return NextResponse.json({ error: 'Failed to save code' }, { status: 500 });
    }
}
