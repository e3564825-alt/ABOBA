const port = import.meta.env.PORT || 3011;
export const API_BASE_URL = `http://localhost:${3011}/api`;
export async function fetchData(url, options = {}) {
    console.log(url, options)
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            const detail = body.detail ? `: ${body.detail}` : '';
            throw new Error(
                (body.message || `Ошибка: ${response.status} ${response.statusText}`) + detail
            );
        }
        console.log(response)
        return await response.json();
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error;
    }
}
