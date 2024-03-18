import { NextResponse } from "next/server";

export const getHashParams = () => {
    const hash = window.location.hash.substring(1);
    const paramsArray = hash.split("&");
    const params = {} as Record<string, string>;

    for (let i = 0; i < paramsArray.length; i++) {
        const [key, value] = paramsArray[i].split("=");
        params[key] = value;
    }

    return params;
};

export class ErrorResponse {
    static badRequest(message: string = "Bad Request") {
        return NextResponse.json({
            status: 400,
            message
        });
    }

    static unauthorized(message: string = "Unauthorized") {
        return NextResponse.json({
            status: 401,
            message
        });
    }

    static forbidden(message: string = "Forbidden") {
        return NextResponse.json({
            status: 403,
            message
        });
    }

    static notFound(message: string = "Not Found") {
        return NextResponse.json({
            status: 404,
            message
        });
    }

    static internalServerError(message: string = "Internal Server Error") {
        return NextResponse.json({
            status: 500,
            message
        });
    }
}

export class SuccessResponse {
    static ok<T>(message: string = "OK", data?: T): any {
        return NextResponse.json({
            status: 200,
            message,
            data
        });
    }

    static created<T>(message: string = "Created", data?: T): any {
        return NextResponse.json({
            status: 201,
            message,
            data
        });
    }
}
