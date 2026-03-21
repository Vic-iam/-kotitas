

/**
* Helper function for async error handling
*
* Returns an [Array] with two values [true] and [T] (The result of the callback promise)
* Or [false] and an instance of the [Error] thrown by the function
*
* @remarks
* For non async functions please use [pcallSync]
*
**/
export async function pcall<T>(func: () => Promise<T>): Promise<[true, T] | [false, any]> {
    try {
        const result = await func();
        return [true, result];
    } catch (error) {
        return [false, error];
    }
}


/**
* Helper function for error handling
*
* Returns an [Array] with two values [true] and [T] (The result of callback function)
* Or [false] and an instance of the [Error] thrown by the
*
* @remarks
* For  async functions please use [pcall]
*
**/
export function pcallSync<T>(func: () => T): [true, T] | [false, any] {
    try {
        const result = func();
        return [true, result]; // Successful execution
    } catch (error) {
        return [false, error]; // Catch any error
    }
}
