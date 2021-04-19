import {
	CognitoUserPool,
	CognitoUserAttribute,
    AuthenticationDetails,
	CognitoUser,
} from 'amazon-cognito-identity-js';

const poolRegion = "us-east-1";
const poolIdentityId = "us-east-1:bafd62ce-7b79-46dc-948d-67b683ea1deb";
const poolData = {
    UserPoolId : "us-east-1_0Qe9L22av",
    ClientId : "27kei534fja4jis9v57sl3p9h4"
};

function getUserPool() {
    return new CognitoUserPool(poolData);
}

function getCognitoUser(email) {
    return new CognitoUser({Username: email, Pool: getUserPool()});
}

function getAuthenticationDetials(email, password) {
    return new AuthenticationDetails({Username: email, Password: password});
}

export function verify(email, code) {
    return new Promise((resolve) => {
        getCognitoUser(email).confirmRegistration(code, true, (err, result) => {
            if (err) {
                return resolve({ statusCode: 422, response: err });
            }
            return resolve({ statusCode: 400, response: result });
        });
    });
}

export function signIn(email, password) {
    return new Promise((resolve) => {
        var user = getCognitoUser(email)
        user.authenticateUser(getAuthenticationDetials(email, password), {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                };
                return resolve({ statusCode: 200, response: token});
            },
            newPasswordRequired: (userAttr, requiredAttr) => {
                delete userAttr.email_verified;
                return resolve({ statusCode: 419, response: {user: user, userAttr: userAttr}});
            },
            onFailure: (err) => {
                return resolve({ statusCode: 400, response: err.message || JSON.stringify(err)});
            },
        });
    });
}

export function resetPassword(session, new_password, userAttr) {
    return new Promise((resolve) => {
        session.completeNewPasswordChallenge(new_password, userAttr, {
            onSuccess: (result) => {
                const token = {
                    accessToken: result.getAccessToken().getJwtToken(),
                    idToken: result.getIdToken().getJwtToken(),
                    refreshToken: result.getRefreshToken().getToken(),
                };
                return resolve({statusCode: 200, response: token})
            },
            onFailure: (err) => {
                return resolve({statusCode: 400, response: err.message || JSON.stringify(err)});
            }
        });
    });
}

export function getLoggedInUser() {
    var user = getUserPool().getCurrentUser();
    return user;
}

export function getSession(user){
    return user.getSession((err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        return response;
    });
}