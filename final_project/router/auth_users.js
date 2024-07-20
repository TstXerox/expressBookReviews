const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// For what purpose ?!
const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    const validUsers = users.filter(user => {
        return (user.username === username && user.password === password);
    });

    return (validUsers.length > 0);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    const usernameReviewExists = books[isbn].reviews[username];
    books[isbn].reviews[username] = review;

    if (usernameReviewExists) {
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        return res.status(200).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (!isbn) {
        return res.status(400).json({ message: "ISBN is required" });
    }
    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
