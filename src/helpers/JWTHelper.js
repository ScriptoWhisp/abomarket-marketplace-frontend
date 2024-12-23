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

export function getIsAdminFromToken(token) {
    try {
        console.log("Decoding JWT", token);
        const decodedToken = jwtDecode(token);
        return decodedToken.roles[0].authority === 'ROLE_ADMIN'; // Access the `role` claim
    } catch (error) {
        return false;
    }
}
