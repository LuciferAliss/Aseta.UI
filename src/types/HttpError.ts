interface Response {
    data : Data;
} 

interface Data {
    detail : string;
}

export interface HttpError {
    status: number;
    response : Response
}