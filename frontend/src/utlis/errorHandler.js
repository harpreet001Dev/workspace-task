
class ApiError extends Error{
    constructor(message,errors=[],statusCode=null){
        super(message)
        this.name="ApiError",
        this.errors=errors,
        this.statusCode=statusCode
    }
}



export const handleFormError = (error, setError) => {

    if (error.errors?.length) {

        error.errors.forEach((err) => {
            setError(err.field, {
                type: "server",
                message: err.message,
            });
        });

        return;
    }

    alert(error.message);
};

export default ApiError;