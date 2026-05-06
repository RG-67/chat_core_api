const userDetails = {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
        name: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" }
    }
}

const userRegSuccessRes = {
    type: "object",
    properties: {
        name: { type: "string" },
        email: { type: "string" },
        createdAt: { type: "string" }
    }
}

const userRegFailedRes = {
    type: "object",
    properties: {
        status: { type: "boolean" },
        message: { type: "string" }
    }
}


const userRegisterSchema = {

    body: userDetails,

    response: {

        201: {
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" },
                data: userRegSuccessRes
            }
        },

        400: {
            userRegFailedRes
        },

        500: {
            userRegFailedRes
        }

    }

}


export { userRegisterSchema };