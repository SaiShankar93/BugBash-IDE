import { NextRequest, NextResponse } from "next/server";
import connect from "@/dbConfig/dbConfig";
import users from '@/models/userModel'
import bcryptjs from 'bcryptjs'

connect()

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        const user = await users.findOne({ email });

        if (user) {
            return NextResponse.json(
                {
                    message: "already registered, please login"
                },
                {
                    status: 400
                }
            )
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await new users({
            email,
            name,
            password : hashedPassword
        })
        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message : "user created successfully",
            success :true,
            savedUser,
            userName : savedUser.name,
        })
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}