import { ErrorResponse, SuccessResponse } from "@lib/route-utils";

export async function POST(request: Request) {
    const payload = await request.json();

    if (!payload || !payload.accountNumber || !payload.bankCode)
        return ErrorResponse.badRequest();

    const paystackKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackKey) return ErrorResponse.internalServerError();
    try {
        const res = await (
            await fetch(
                `https://api.paystack.co/bank/resolve?account_number=${payload.accountNumber}&bank_code=${payload.bankCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${paystackKey}`
                    }
                }
            )
        ).json();
        console.log({ res });
        if (res && res.status) return SuccessResponse.ok(res.message, res.data);
    } catch (err) {
        return ErrorResponse.internalServerError();
    }
}
