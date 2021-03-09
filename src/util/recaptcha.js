export default function () {
    const getRecaptchaToken = async (recaptchaLoaded, executeRecaptcha, action) => {
        // (optional) Wait until recaptcha has been loaded.
        await recaptchaLoaded();

        // Execute reCAPTCHA with action.
        const token = await executeRecaptcha(action);
        console.log(token);
        return token;
    };
    return {
        getRecaptchaToken,
    }
}