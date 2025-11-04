export const getUserPopulateOption = [{
    path: "posts",
    populate: [{
        path: "likes",
        populate: {
            path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
        }
    }, {
        path: "comments",
        populate: {
            path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
        }
    }]
}, {
    path: "eventsCreated", select: "-createdBy"
}, {
    path: "eventsJoined",
    populate: [{
        path: "createdBy", select: '-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated'
    }, {
        path: "participants", select: '-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated'
    }]
}]

export const getPostPopulateOptions = [{
    path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
}, {
    path: "likes",
    populate: {
        path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
    }
}, {
    path: "comments",
    populate: {
        path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
    }
}, {
    path: 'sharedFrom', select: "-sharedBy",
    populate: [{
        path: 'author', select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
    }, {
        path: 'likes',
        populate: {
            path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
        }
    }, {
        path: 'comments',
        populate: {
            path: "author", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
        }
    }]
}, {
    path: "sharedBy", select: "-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated"
}];

export const getEventPopulateOption = [{
    path: "createdBy", select: '-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated'
}, {
    path: "participants", select: '-password -otpCode -otpExpiresAt -__v -posts -eventsJoined -eventsCreated'
}]