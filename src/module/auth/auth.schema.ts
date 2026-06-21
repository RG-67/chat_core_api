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
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        createdAt: { type: "string" }
    }
}

const userLoginRes = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        token: { type: "string" }
    }
}

const loginCred = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" }
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
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" }
            }
        },

        500: {
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" }
            }
        }

    }

}


const userLoginSchema = {

    body: loginCred,

    response: {

        200: {
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" },
                data: userLoginRes
            }
        },

        404: {
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" }
            }
        },

        500: {
            type: "object",
            properties: {
                status: { type: "boolean" },
                message: { type: "string" }
            }
        }

    }

}


export { userRegisterSchema, userLoginSchema };