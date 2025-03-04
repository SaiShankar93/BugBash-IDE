import { NextRequest, NextResponse, userAgentFromString } from "next/server";
import connect from "@/dbConfig/dbConfig";
import users from '@/models/userModel'
import bcryptjs from 'bcryptjs'
import { error } from "console";
import jwt from 'jsonwebtoken'

connect()

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await users.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User Did not exists, please signup"
                },
                {
                    status: 400
                }
            )
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                {
                    error: "Invalid Password"
                },
                {
                    status: 400
                }
            )
        }
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '6d' })

        const response = NextResponse.json({
            message: "Login Successful",
            success : true,
            userName : user.name
        })
        response.cookies.set('token', token, {
            httpOnly : true,
        });
        return response;
    } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 })
}
}