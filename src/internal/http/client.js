// @flow
/**
 * HttpClient is a custom wrapper around fetch api.
 * Exposes get, post and delete methods for JSON strings.
 */
export class HttpClient {
  /**
   * Performs GET http request.
   * @param path
   * @param _auth indicates if authentication is needed
   */
  async get(path: string, _auth = true): Promise<Response> {
    return this.#do("GET", path, null);
  }

  /**
   * do sends an HTTP request and returns an HTTP response as configured on the client.
   * @param method holds http method type
   * @param path
   * @param body serialized JSON
   */
  async #do(method: string, path: string, body: string | null): Promise<Response> {
    const request = {
      method: method,
      body: body,
    };

    request.headers = {
      "Content-Type": "application/json",
    };

    return await fetch(path, request);
  }
}
