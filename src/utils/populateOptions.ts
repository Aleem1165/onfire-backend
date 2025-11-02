export const getUserPopulateOption = [{
    path: "posts",
    populate: [{
        path: "likes",
        populate: {
            path: "author",
            select: "-password -otpCode -otpExpiresAt -__v -posts"
        }
    }, {
        path: "comments",
        populate: {
            path: "author",
            select: "-password -otpCode -otpExpiresAt -__v -posts"
        }
    }]
}]

export const getPostPopulateOptions = [{
    path: "author",
    select: "-password -otpCode -otpExpiresAt -__v -posts"
}, {
    path: "likes",
    populate: {
        path: "author",
        select: "-password -otpCode -otpExpiresAt -__v -posts"
    }
}, {
    path: "comments",
    populate: {
        path: "author",
        select: "-password -otpCode -otpExpiresAt -__v -posts"
    }
}];