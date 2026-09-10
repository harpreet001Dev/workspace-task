
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                sucess: false,
                message: "Validation error",
                errors: error.details.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            })
        }
        next();
    }
}

export default validate;