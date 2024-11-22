import {jwtDecode} from 'jwt-decode';

export function getUserIdFromToken(token) {
    try {
        console.log("Decoding JWT", token);
        const decodedToken = jwtDecode(token);
        return decodedToken.userId; // Access the `userId` claim
    } catch (error) {
        return -1;
    }
}
