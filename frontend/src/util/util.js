//Alternative export const getError=(error)=>{}
export function getError(error) {
  return error.response && error.response.data.customizedMessage
    ? error.response.data.customizedMessage
    : error.message;
}
