CREATE TABLE "Events" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Events" PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT NOT NULL,
    "Image" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "Time" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "Price" TEXT NOT NULL,
    "Category" TEXT NULL,
    "Description" TEXT NOT NULL,
    "EventType" TEXT NOT NULL,
    "Lineup" TEXT NOT NULL,
    "IsFeatured" INTEGER NOT NULL
);


CREATE TABLE "Users" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "EmailVerified" INTEGER NOT NULL,
    "VerificationToken" TEXT NULL,
    "TokenExpiresAt" TEXT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NOT NULL
);


CREATE TABLE "TicketTypes" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_TicketTypes" PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Price" TEXT NOT NULL,
    "Available" INTEGER NOT NULL,
    "EventId" INTEGER NOT NULL,
    CONSTRAINT "FK_TicketTypes_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE
);


CREATE TABLE "Seats" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Seats" PRIMARY KEY AUTOINCREMENT,
    "EventId" INTEGER NOT NULL,
    "Row" TEXT NOT NULL,
    "Number" INTEGER NOT NULL,
    "Status" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Price" TEXT NOT NULL,
    "ReservedByUserId" INTEGER NULL,
    "ReservationExpiresAt" TEXT NULL,
    CONSTRAINT "FK_Seats_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Seats_Users_ReservedByUserId" FOREIGN KEY ("ReservedByUserId") REFERENCES "Users" ("Id") ON DELETE SET NULL
);


CREATE TABLE "UserTickets" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_UserTickets" PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NOT NULL,
    "EventId" INTEGER NOT NULL,
    "SeatId" INTEGER NOT NULL,
    "TicketType" TEXT NOT NULL,
    "Price" TEXT NOT NULL,
    "PurchaseDate" TEXT NOT NULL,
    "EventDate" TEXT NOT NULL,
    "QrCode" TEXT NOT NULL,
    "IsUsed" INTEGER NOT NULL,
    CONSTRAINT "FK_UserTickets_Events_EventId" FOREIGN KEY ("EventId") REFERENCES "Events" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserTickets_Seats_SeatId" FOREIGN KEY ("SeatId") REFERENCES "Seats" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserTickets_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);


CREATE INDEX "IX_Seats_EventId" ON "Seats" ("EventId");


CREATE INDEX "IX_Seats_ReservedByUserId" ON "Seats" ("ReservedByUserId");


CREATE INDEX "IX_TicketTypes_EventId" ON "TicketTypes" ("EventId");


CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");


CREATE INDEX "IX_UserTickets_EventId" ON "UserTickets" ("EventId");


CREATE INDEX "IX_UserTickets_SeatId" ON "UserTickets" ("SeatId");


CREATE INDEX "IX_UserTickets_UserId" ON "UserTickets" ("UserId");


