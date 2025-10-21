-- Creates the Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

-- Creates the Complaints table
CREATE TABLE Complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment VARCHAR(255),
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Resolved', 'Escalated') DEFAULT 'Pending',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Creates the Comments table
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    UserId INT,
    ComplaintId INT,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ComplaintId) REFERENCES Complaints(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Creates the Escalations table
-- Note: Based on escalation.model.js. The file admin.model.js appears to be a duplicate.
CREATE TABLE Escalations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escalationLevel INT DEFAULT 1,
    escalatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    ComplaintId INT,
    FOREIGN KEY (ComplaintId) REFERENCES Complaints(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Creates the TimelineEvents table
CREATE TABLE TimelineEvents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    details VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    ComplaintId INT,
    FOREIGN KEY (ComplaintId) REFERENCES Complaints(id) ON DELETE SET NULL ON UPDATE CASCADE
);