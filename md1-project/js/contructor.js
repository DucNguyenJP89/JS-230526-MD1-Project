export class User {
    constructor(id, firstName, lastName, email, password, birthday, gender, joinedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.gender = gender;
        this.status = 1; //status: 0-inactive, 1-active, 9-blocked
        this.joinedAt = joinedAt;
    }
}

export class UserFeed {
    constructor(id, userId, createdAt, updatedAt, content) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.content = content;
        this.status = 1; // 1: valid - 9: invalid
    }
}

export class FeedComment {
    constructor(commentId, feedId, userId, commentText, createdAt, updatedAt) {
        this.commentId = commentId;
        this.feedId = feedId;
        this.userId = userId;
        this.commentText = commentText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = 1; // 1: valid - 9: invalid
    }
}

export class FeedLike {
    constructor(likeId, feedId, userId) {
        this.likeId = likeId;
        this.feedId = feedId;
        this.userId = userId;
    }
}