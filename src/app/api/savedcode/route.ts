import connect from "@/dbConfig/dbConfig";
import SaveCode from '@/models/saveModel';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    await connect();

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const userCode = await SaveCode.findOne({ username });

        if (userCode) {
            return NextResponse.json({ codes: userCode.codes }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'No code found for this user' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching code:', error);
        return NextResponse.json({ error: 'Failed to fetch code' }, { status: 500 });
    }
}
