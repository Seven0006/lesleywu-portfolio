-- =============================================
-- Pet Adoption Database - DBeaver Compatible Version
-- Database Name: Group6_Final_PetAdoptionDB
-- =============================================

-- Create Database
CREATE DATABASE Group6_Final_PetAdoptionDB;

USE Group6_Final_PetAdoptionDB;

-- =============================================
-- Create Tables
-- =============================================

-- Species Table
CREATE TABLE Species (
    SpeciesID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
);

-- Breed Table
CREATE TABLE Breed (
    BreedID INT PRIMARY KEY IDENTITY(1,1),
    SpeciesID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Image NVARCHAR(255),
    AverageLifespan INT,
    TypicalSize NVARCHAR(50),
    DietType NVARCHAR(100),
    CareLevel NVARCHAR(50),
    Description NVARCHAR(500),
    FOREIGN KEY (SpeciesID) REFERENCES Species(SpeciesID)
);

-- Pet Table
CREATE TABLE Pet (
    PetID INT PRIMARY KEY IDENTITY(1,1),
    BreedID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    BirthDate DATE,
    Gender NVARCHAR(20),
    Color NVARCHAR(50),
    WeightKg DECIMAL(5,2),
    CoatLength NVARCHAR(50),
    Image NVARCHAR(255),
    Description NVARCHAR(500),
    SpayNeuterStatus NVARCHAR(50),
    SpayNeuterDate DATE,
    AdoptionStatus NVARCHAR(50),
    CreateTime DATETIME DEFAULT GETDATE(),
    UpdateTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (BreedID) REFERENCES Breed(BreedID)
);

-- Vaccine Table
CREATE TABLE Vaccine (
    VaccineID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Manufaturer NVARCHAR(100),
    RecommendedAge INT,
    Notes NVARCHAR(500)
);

-- PetVaccination Table
CREATE TABLE PetVaccination (
    PetID INT NOT NULL,
    VaccineID INT NOT NULL,
    DateGiven DATE NOT NULL,
    NextDueDate DATE,
    VetName NVARCHAR(100),
    VetNo NVARCHAR(50),
    ClinicName NVARCHAR(200),
    PRIMARY KEY (PetID, VaccineID),
    FOREIGN KEY (PetID) REFERENCES Pet(PetID),
    FOREIGN KEY (VaccineID) REFERENCES Vaccine(VaccineID)
);

-- Category Table
CREATE TABLE Category (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    Type NVARCHAR(50),
    Name NVARCHAR(100) NOT NULL,
    CategoryStatus NVARCHAR(50),
    CreateTime DATETIME DEFAULT GETDATE(),
    UpdateTime DATETIME DEFAULT GETDATE()
);

-- Product Table
CREATE TABLE Product (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Image NVARCHAR(255),
    Description NVARCHAR(500),
    ProductStatus NVARCHAR(50),
    CreateTime DATETIME DEFAULT GETDATE(),
    UpdateTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

-- User Table
CREATE TABLE [User] (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Phone NVARCHAR(20),
    Email NVARCHAR(100) UNIQUE,
    Gender NVARCHAR(20),
    BirthDate DATE,
    AccountStatus NVARCHAR(50),
    CreateTime DATETIME DEFAULT GETDATE(),
    UpdateTime DATETIME DEFAULT GETDATE()
);

-- Address Table
CREATE TABLE Address (
    UserID INT PRIMARY KEY,
    AddressLineOne NVARCHAR(200),
    AddressLineTwo NVARCHAR(200),
    City NVARCHAR(100),
    State NVARCHAR(50),
    Zipcode NVARCHAR(20),
    Country NVARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Order Table
CREATE TABLE [Order] (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    OrderStatus NVARCHAR(50),
    OrderTime DATETIME DEFAULT GETDATE(),
    CheckoutTime DATETIME,
    PayMethod NVARCHAR(50),
    PayStatus NVARCHAR(50),
    Amount DECIMAL(10,2),
    Remark NVARCHAR(500),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- LineItem Table
CREATE TABLE LineItem (
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (OrderID) REFERENCES [Order](OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- ApplicationDetail Table
CREATE TABLE ApplicationDetail (
    ApplicationDetailID INT PRIMARY KEY IDENTITY(1,1),
    DwellingType NVARCHAR(50),
    RentOrOwn NVARCHAR(20),
    AdultsInHome INT,
    ChildrenInHome INT,
    ChildrenAges NVARCHAR(100),
    IsFirstPet BIT,
    OtherPetsCount INT,
    OtherPetsTypes NVARCHAR(200),
    OtherPetsAges NVARCHAR(200),
    LifestyleActivityLevel NVARCHAR(50),
    AdoptionPurpose NVARCHAR(500),
    PreparedForExpenses BIT,
    HoursOutPerDay INT,
    DesiredPetCharacter NVARCHAR(500),
    AgreeToTerms BIT,
    AdditionalComments NVARCHAR(1000)
);

-- AdoptionApplication Table
CREATE TABLE AdoptionApplication (
    UserID INT NOT NULL,
    PetID INT NOT NULL,
    ApplicationDetailID INT,
    ApplicationDate DATETIME DEFAULT GETDATE(),
    ApplicationStatus NVARCHAR(50),
    ReviewDate DATETIME,
    DecisionNote NVARCHAR(500),
    PRIMARY KEY (UserID, PetID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (PetID) REFERENCES Pet(PetID),
    FOREIGN KEY (ApplicationDetailID) REFERENCES ApplicationDetail(ApplicationDetailID)
);

-- =============================================
-- Insert Sample Data
-- =============================================

-- Insert Species (10 rows)
INSERT INTO Species (Name, Description) VALUES
('Dog', 'Domesticated carnivorous mammal'),
('Cat', 'Small carnivorous mammal'),
('Bird', 'Warm-blooded egg-laying vertebrates'),
('Rabbit', 'Small mammals with long ears'),
('Guinea Pig', 'Small rodent pets'),
('Hamster', 'Small rodent with short tail'),
('Fish', 'Aquatic vertebrate animals'),
('Turtle', 'Reptile with protective shell'),
('Ferret', 'Small domesticated carnivore'),
('Chinchilla', 'Small rodent with soft fur');

-- Insert Breed (10 rows)
INSERT INTO Breed (SpeciesID, Name, Image, AverageLifespan, TypicalSize, DietType, CareLevel, Description) VALUES
(1, 'Golden Retriever', 'golden.jpg', 12, 'Large', 'Omnivore', 'Medium', 'Friendly and intelligent dog breed'),
(1, 'German Shepherd', 'shepherd.jpg', 11, 'Large', 'Omnivore', 'Medium', 'Loyal and versatile working dog'),
(1, 'Labrador', 'lab.jpg', 12, 'Large', 'Omnivore', 'Medium', 'Friendly and outgoing breed'),
(2, 'Persian', 'persian.jpg', 15, 'Medium', 'Carnivore', 'High', 'Long-haired cat breed'),
(2, 'Siamese', 'siamese.jpg', 15, 'Medium', 'Carnivore', 'Medium', 'Vocal and social cat'),
(2, 'Maine Coon', 'mainecoon.jpg', 13, 'Large', 'Carnivore', 'Medium', 'Large domesticated cat'),
(3, 'Parakeet', 'parakeet.jpg', 10, 'Small', 'Herbivore', 'Low', 'Small colorful parrot'),
(4, 'Holland Lop', 'lop.jpg', 8, 'Small', 'Herbivore', 'Medium', 'Small rabbit with floppy ears'),
(5, 'American Guinea Pig', 'guinea.jpg', 6, 'Small', 'Herbivore', 'Low', 'Common guinea pig breed'),
(6, 'Syrian Hamster', 'hamster.jpg', 3, 'Small', 'Omnivore', 'Low', 'Popular hamster breed');

-- Insert Pet (10 rows)
INSERT INTO Pet (BreedID, Name, BirthDate, Gender, Color, WeightKg, CoatLength, Image, Description, SpayNeuterStatus, SpayNeuterDate, AdoptionStatus, CreateTime, UpdateTime) VALUES
(1, 'Max', '2020-05-15', 'Male', 'Golden', 30.5, 'Long', 'max.jpg', 'Friendly and energetic', 'Neutered', '2021-01-10', 'Available', GETDATE(), GETDATE()),
(2, 'Bella', '2019-08-20', 'Female', 'Black and Tan', 28.0, 'Medium', 'bella.jpg', 'Loyal and protective', 'Spayed', '2020-03-15', 'Available', GETDATE(), GETDATE()),
(3, 'Charlie', '2021-03-10', 'Male', 'Yellow', 32.0, 'Short', 'charlie.jpg', 'Playful and loving', 'Neutered', '2021-10-05', 'Available', GETDATE(), GETDATE()),
(4, 'Luna', '2020-11-25', 'Female', 'White', 4.5, 'Long', 'luna.jpg', 'Calm and affectionate', 'Spayed', '2021-06-20', 'Available', GETDATE(), GETDATE()),
(5, 'Milo', '2021-07-14', 'Male', 'Cream', 5.0, 'Short', 'milo.jpg', 'Vocal and curious', 'Neutered', '2022-01-08', 'Available', GETDATE(), GETDATE()),
(6, 'Simba', '2020-02-28', 'Male', 'Orange', 6.5, 'Long', 'simba.jpg', 'Gentle giant', 'Neutered', '2020-09-15', 'Available', GETDATE(), GETDATE()),
(7, 'Kiwi', '2022-01-05', 'Female', 'Green', 0.05, 'Feathered', 'kiwi.jpg', 'Chirpy and social', 'Not Applicable', NULL, 'Available', GETDATE(), GETDATE()),
(8, 'Thumper', '2021-09-18', 'Male', 'Brown', 1.8, 'Short', 'thumper.jpg', 'Energetic hopper', 'Neutered', '2022-03-10', 'Available', GETDATE(), GETDATE()),
(9, 'Peanut', '2022-05-20', 'Female', 'Tricolor', 0.9, 'Short', 'peanut.jpg', 'Sweet and gentle', 'Not Applicable', NULL, 'Available', GETDATE(), GETDATE()),
(10, 'Nibbles', '2022-08-12', 'Male', 'Golden', 0.15, 'Short', 'nibbles.jpg', 'Active at night', 'Not Applicable', NULL, 'Available', GETDATE(), GETDATE());

-- Insert Vaccine (10 rows)
INSERT INTO Vaccine (Name, Manufaturer, RecommendedAge, Notes) VALUES
('Rabies', 'Zoetis', 12, 'Required by law in most states'),
('DHPP', 'Merck', 6, 'Protects against distemper, hepatitis, parainfluenza, and parvovirus'),
('Bordetella', 'Zoetis', 8, 'Kennel cough vaccine'),
('Leptospirosis', 'Merck', 12, 'Bacterial disease vaccine'),
('Lyme Disease', 'Boehringer', 12, 'Tick-borne disease vaccine'),
('FVRCP', 'Zoetis', 6, 'Feline viral rhinotracheitis, calicivirus, and panleukopenia'),
('FeLV', 'Merck', 8, 'Feline leukemia virus vaccine'),
('Avian Polyomavirus', 'Biomune', 14, 'For birds'),
('Myxomatosis', 'Nobivac', 10, 'For rabbits'),
('Canine Influenza', 'Zoetis', 6, 'Dog flu vaccine');

-- Insert PetVaccination (10 rows)
INSERT INTO PetVaccination (PetID, VaccineID, DateGiven, NextDueDate, VetName, VetNo, ClinicName) VALUES
(1, 1, '2021-06-15', '2022-06-15', 'Dr. Smith', '555-0101', 'Happy Paws Clinic'),
(1, 2, '2020-11-20', '2021-11-20', 'Dr. Smith', '555-0101', 'Happy Paws Clinic'),
(2, 1, '2020-09-10', '2021-09-10', 'Dr. Johnson', '555-0102', 'Pet Care Center'),
(2, 2, '2020-02-15', '2021-02-15', 'Dr. Johnson', '555-0102', 'Pet Care Center'),
(3, 1, '2021-10-20', '2022-10-20', 'Dr. Williams', '555-0103', 'Animal Hospital'),
(4, 6, '2021-05-15', '2022-05-15', 'Dr. Brown', '555-0104', 'Feline Medical Center'),
(5, 6, '2021-12-10', '2022-12-10', 'Dr. Davis', '555-0105', 'Cat Clinic'),
(6, 6, '2020-08-25', '2021-08-25', 'Dr. Miller', '555-0106', 'Veterinary Associates'),
(7, 8, '2022-03-15', '2023-03-15', 'Dr. Wilson', '555-0107', 'Exotic Pet Clinic'),
(8, 9, '2022-01-20', '2023-01-20', 'Dr. Moore', '555-0108', 'Small Animal Hospital');

-- Insert Category (10 rows)
INSERT INTO Category (Type, Name, CategoryStatus, CreateTime, UpdateTime) VALUES
('Food', 'Dog Food', 'Active', GETDATE(), GETDATE()),
('Food', 'Cat Food', 'Active', GETDATE(), GETDATE()),
('Toys', 'Dog Toys', 'Active', GETDATE(), GETDATE()),
('Toys', 'Cat Toys', 'Active', GETDATE(), GETDATE()),
('Accessories', 'Collars and Leashes', 'Active', GETDATE(), GETDATE()),
('Healthcare', 'Vitamins and Supplements', 'Active', GETDATE(), GETDATE()),
('Grooming', 'Brushes and Combs', 'Active', GETDATE(), GETDATE()),
('Bedding', 'Pet Beds', 'Active', GETDATE(), GETDATE()),
('Food', 'Bird Food', 'Active', GETDATE(), GETDATE()),
('Accessories', 'Pet Carriers', 'Active', GETDATE(), GETDATE());

-- Insert Product (10 rows)
INSERT INTO Product (CategoryID, Name, Price, Image, Description, ProductStatus, CreateTime, UpdateTime) VALUES
(1, 'Premium Dog Food 20lb', 45.99, 'dogfood1.jpg', 'High-quality protein dog food', 'Active', GETDATE(), GETDATE()),
(2, 'Gourmet Cat Food 12lb', 38.99, 'catfood1.jpg', 'Grain-free cat food', 'Active', GETDATE(), GETDATE()),
(3, 'Rope Tug Toy', 12.99, 'roytoy1.jpg', 'Durable rope toy for dogs', 'Active', GETDATE(), GETDATE()),
(4, 'Feather Wand Toy', 8.99, 'cattoy1.jpg', 'Interactive cat toy', 'Active', GETDATE(), GETDATE()),
(5, 'Leather Dog Collar', 24.99, 'collar1.jpg', 'Adjustable leather collar', 'Active', GETDATE(), GETDATE()),
(6, 'Multivitamin Chews', 19.99, 'vitamins1.jpg', 'Daily vitamins for dogs', 'Active', GETDATE(), GETDATE()),
(7, 'Slicker Brush', 15.99, 'brush1.jpg', 'Professional grooming brush', 'Active', GETDATE(), GETDATE()),
(8, 'Orthopedic Dog Bed', 79.99, 'bed1.jpg', 'Memory foam pet bed', 'Active', GETDATE(), GETDATE()),
(9, 'Premium Bird Seed Mix', 22.99, 'birdseed1.jpg', 'Nutritious seed blend', 'Active', GETDATE(), GETDATE()),
(10, 'Travel Pet Carrier', 49.99, 'carrier1.jpg', 'Airline-approved carrier', 'Active', GETDATE(), GETDATE());

-- Insert User (10 rows)
INSERT INTO [User] (Username, Password, FirstName, LastName, Phone, Email, Gender, BirthDate, AccountStatus, CreateTime, UpdateTime) VALUES
('john_doe', 'hashed_password1', 'John', 'Doe', '555-1001', 'john.doe@email.com', 'Male', '1990-05-15', 'Active', GETDATE(), GETDATE()),
('jane_smith', 'hashed_password2', 'Jane', 'Smith', '555-1002', 'jane.smith@email.com', 'Female', '1988-08-22', 'Active', GETDATE(), GETDATE()),
('mike_wilson', 'hashed_password3', 'Mike', 'Wilson', '555-1003', 'mike.wilson@email.com', 'Male', '1995-03-10', 'Active', GETDATE(), GETDATE()),
('sarah_jones', 'hashed_password4', 'Sarah', 'Jones', '555-1004', 'sarah.jones@email.com', 'Female', '1992-11-30', 'Active', GETDATE(), GETDATE()),
('david_brown', 'hashed_password5', 'David', 'Brown', '555-1005', 'david.brown@email.com', 'Male', '1985-07-18', 'Active', GETDATE(), GETDATE()),
('emily_davis', 'hashed_password6', 'Emily', 'Davis', '555-1006', 'emily.davis@email.com', 'Female', '1993-04-25', 'Active', GETDATE(), GETDATE()),
('chris_miller', 'hashed_password7', 'Chris', 'Miller', '555-1007', 'chris.miller@email.com', 'Male', '1991-09-12', 'Active', GETDATE(), GETDATE()),
('lisa_garcia', 'hashed_password8', 'Lisa', 'Garcia', '555-1008', 'lisa.garcia@email.com', 'Female', '1989-12-05', 'Active', GETDATE(), GETDATE()),
('tom_martinez', 'hashed_password9', 'Tom', 'Martinez', '555-1009', 'tom.martinez@email.com', 'Male', '1994-06-20', 'Active', GETDATE(), GETDATE()),
('anna_rodriguez', 'hashed_password10', 'Anna', 'Rodriguez', '555-1010', 'anna.rodriguez@email.com', 'Female', '1987-02-14', 'Active', GETDATE(), GETDATE());

-- Insert Address (10 rows)
INSERT INTO Address (UserID, AddressLineOne, AddressLineTwo, City, State, Zipcode, Country) VALUES
(1, '123 Main St', 'Apt 4B', 'Boston', 'MA', '02101', 'USA'),
(2, '456 Oak Ave', NULL, 'Cambridge', 'MA', '02138', 'USA'),
(3, '789 Elm Street', 'Unit 2', 'Somerville', 'MA', '02143', 'USA'),
(4, '321 Pine Road', NULL, 'Brookline', 'MA', '02445', 'USA'),
(5, '654 Maple Drive', 'Floor 3', 'Newton', 'MA', '02458', 'USA'),
(6, '987 Cedar Lane', NULL, 'Waltham', 'MA', '02451', 'USA'),
(7, '147 Birch Street', 'Apt 1A', 'Medford', 'MA', '02155', 'USA'),
(8, '258 Spruce Ave', NULL, 'Arlington', 'MA', '02474', 'USA'),
(9, '369 Willow Court', 'Unit 5', 'Lexington', 'MA', '02420', 'USA'),
(10, '741 Ash Boulevard', NULL, 'Quincy', 'MA', '02169', 'USA');

-- Insert Order (10 rows)
INSERT INTO [Order] (UserID, OrderStatus, OrderTime, CheckoutTime, PayMethod, PayStatus, Amount, Remark) VALUES
(1, 'Completed', '2024-01-15 10:30:00', '2024-01-15 10:35:00', 'Credit Card', 'Paid', 58.98, 'Fast delivery please'),
(2, 'Completed', '2024-01-18 14:20:00', '2024-01-18 14:25:00', 'PayPal', 'Paid', 47.98, NULL),
(3, 'Processing', '2024-01-20 09:15:00', '2024-01-20 09:20:00', 'Credit Card', 'Paid', 79.99, 'Gift wrap requested'),
(4, 'Shipped', '2024-01-22 16:45:00', '2024-01-22 16:50:00', 'Debit Card', 'Paid', 33.97, NULL),
(5, 'Completed', '2024-01-25 11:30:00', '2024-01-25 11:35:00', 'Credit Card', 'Paid', 102.96, 'Repeat customer'),
(6, 'Processing', '2024-01-28 13:20:00', '2024-01-28 13:25:00', 'PayPal', 'Paid', 65.97, NULL),
(7, 'Completed', '2024-02-01 10:00:00', '2024-02-01 10:05:00', 'Credit Card', 'Paid', 45.99, 'Subscribe to newsletter'),
(8, 'Shipped', '2024-02-03 15:30:00', '2024-02-03 15:35:00', 'Debit Card', 'Paid', 91.98, NULL),
(9, 'Completed', '2024-02-05 12:45:00', '2024-02-05 12:50:00', 'Credit Card', 'Paid', 22.99, 'First time buyer'),
(10, 'Processing', '2024-02-08 14:15:00', '2024-02-08 14:20:00', 'PayPal', 'Paid', 129.97, 'Large order');

-- Insert LineItem (15 rows - multiple items per order)
INSERT INTO LineItem (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 1, 45.99),
(1, 3, 1, 12.99),
(2, 2, 1, 38.99),
(2, 4, 1, 8.99),
(3, 8, 1, 79.99),
(4, 5, 1, 24.99),
(4, 4, 1, 8.99),
(5, 1, 2, 45.99),
(5, 6, 1, 19.99),
(6, 7, 2, 15.99),
(6, 3, 2, 12.99),
(7, 1, 1, 45.99),
(8, 8, 1, 79.99),
(8, 3, 1, 12.99),
(9, 9, 1, 22.99);

-- Insert ApplicationDetail (10 rows)
INSERT INTO ApplicationDetail (DwellingType, RentOrOwn, AdultsInHome, ChildrenInHome, ChildrenAges, IsFirstPet, OtherPetsCount, OtherPetsTypes, OtherPetsAges, LifestyleActivityLevel, AdoptionPurpose, PreparedForExpenses, HoursOutPerDay, DesiredPetCharacter, AgreeToTerms, AdditionalComments) VALUES
('House', 'Own', 2, 0, NULL, 1, 0, NULL, NULL, 'Active', 'Companionship', 1, 4, 'Friendly and energetic', 1, 'Have a large backyard'),
('Apartment', 'Rent', 1, 0, NULL, 0, 1, 'Cat', '3 years', 'Moderate', 'Companionship', 1, 6, 'Calm and independent', 1, 'Pet-friendly building'),
('House', 'Own', 2, 2, '5, 8', 0, 1, 'Dog', '6 years', 'Very Active', 'Family Pet', 1, 3, 'Good with children', 1, 'Experienced dog owner'),
('Condo', 'Own', 1, 0, NULL, 1, 0, NULL, NULL, 'Moderate', 'Companionship', 1, 8, 'Low maintenance', 1, 'Work from home 2 days/week'),
('House', 'Own', 2, 1, '10', 0, 2, 'Cats', '2, 4 years', 'Active', 'Family Pet', 1, 5, 'Playful', 1, 'Large fenced yard'),
('Apartment', 'Rent', 2, 0, NULL, 1, 0, NULL, NULL, 'Moderate', 'Companionship', 1, 7, 'Quiet and affectionate', 1, 'First floor unit'),
('House', 'Own', 2, 3, '3, 6, 9', 1, 0, NULL, NULL, 'Very Active', 'Family Pet', 1, 4, 'Patient with kids', 1, 'Stay at home parent'),
('Townhouse', 'Own', 1, 0, NULL, 0, 1, 'Dog', '8 years', 'Moderate', 'Companionship', 1, 6, 'Friendly with other dogs', 1, 'Small backyard available'),
('Apartment', 'Rent', 2, 0, NULL, 1, 0, NULL, NULL, 'Low', 'Companionship', 1, 9, 'Independent and calm', 1, 'Building allows pets under 20lbs'),
('House', 'Own', 2, 2, '12, 14', 0, 1, 'Cat', '5 years', 'Active', 'Family Pet', 1, 5, 'Energetic', 1, 'Teenagers can help with care');

-- Insert AdoptionApplication (10 rows)
INSERT INTO AdoptionApplication (UserID, PetID, ApplicationDetailID, ApplicationDate, ApplicationStatus, ReviewDate, DecisionNote) VALUES
(1, 1, 1, '2024-01-10 09:00:00', 'Approved', '2024-01-12 14:00:00', 'Great home for Max'),
(2, 4, 2, '2024-01-15 10:30:00', 'Approved', '2024-01-17 11:00:00', 'Perfect match'),
(3, 2, 3, '2024-01-20 13:45:00', 'Pending', NULL, NULL),
(4, 7, 4, '2024-01-22 15:20:00', 'Under Review', NULL, NULL),
(5, 3, 5, '2024-01-25 11:00:00', 'Approved', '2024-01-27 16:30:00', 'Excellent family'),
(6, 5, 6, '2024-01-28 14:15:00', 'Pending', NULL, NULL),
(7, 6, 7, '2024-02-01 09:30:00', 'Approved', '2024-02-03 10:00:00', 'Approved for adoption'),
(8, 8, 8, '2024-02-03 16:45:00', 'Under Review', NULL, NULL),
(9, 9, 9, '2024-02-05 12:00:00', 'Rejected', '2024-02-07 13:00:00', 'Apartment too small'),
(10, 10, 10, '2024-02-08 10:30:00', 'Pending', NULL, NULL);

-- Verification queries
SELECT 'Species' AS TableName, COUNT(*) AS RecordCount FROM Species
UNION ALL
SELECT 'Breed', COUNT(*) FROM Breed
UNION ALL
SELECT 'Pet', COUNT(*) FROM Pet
UNION ALL
SELECT 'Vaccine', COUNT(*) FROM Vaccine
UNION ALL
SELECT 'PetVaccination', COUNT(*) FROM PetVaccination
UNION ALL
SELECT 'Category', COUNT(*) FROM Category
UNION ALL
SELECT 'Product', COUNT(*) FROM Product
UNION ALL
SELECT 'User', COUNT(*) FROM [User]
UNION ALL
SELECT 'Address', COUNT(*) FROM Address
UNION ALL
SELECT 'Order', COUNT(*) FROM [Order]
UNION ALL
SELECT 'LineItem', COUNT(*) FROM LineItem
UNION ALL
SELECT 'ApplicationDetail', COUNT(*) FROM ApplicationDetail
UNION ALL
SELECT 'AdoptionApplication', COUNT(*) FROM AdoptionApplication;


-- =============================================

USE Group6_Final_PetAdoptionDB;
GO

-- Table-level CHECK Constraints based on a function
CREATE FUNCTION dbo.fn_IsValidVaccinationDates
(
    @DateGiven   DATE,
    @NextDueDate DATE
)
RETURNS BIT
AS
BEGIN
    IF @NextDueDate IS NULL OR @NextDueDate >= @DateGiven
        RETURN 1;
    RETURN 0;
END;
GO
--table-level CHECK constraint（PetVaccination  Dare)
ALTER TABLE PetVaccination
ADD CONSTRAINT CK_PetVaccination_DateRange
CHECK (dbo.fn_IsValidVaccinationDates(DateGiven, NextDueDate) = 1);
GO


CREATE FUNCTION dbo.fn_IsValidApplicationDates
(
    @ApplicationDate DATETIME,
    @ReviewDate      DATETIME
)
RETURNS BIT
AS
BEGIN
    IF @ReviewDate IS NULL OR @ReviewDate >= @ApplicationDate
        RETURN 1;
    RETURN 0;
END;
GO
--table-level CHECK constraint（ReviewDate = NULL /ReviewDate >= ApplicationDate）
ALTER TABLE AdoptionApplication
ADD CONSTRAINT CK_AdoptionApplication_DateRange
CHECK (dbo.fn_IsValidApplicationDates(ApplicationDate, ReviewDate) = 1);
GO

-- Computed Columns based on a function
-- 1.Pet Age
CREATE FUNCTION dbo.fn_PetAgeYears (@BirthDate DATE)
RETURNS INT
AS
BEGIN
    IF @BirthDate IS NULL
        RETURN NULL;

    RETURN DATEDIFF(YEAR, @BirthDate, GETDATE());
END;
GO

ALTER TABLE Pet
ADD AgeYears AS dbo.fn_PetAgeYears(BirthDate);
GO

--2. Line Total(Quantity * UnitPrice)

CREATE FUNCTION dbo.fn_LineItemTotal
(
    @Quantity  INT,
    @UnitPrice DECIMAL(10,2)
)
RETURNS DECIMAL(18,2)
AS
BEGIN
    RETURN ISNULL(@Quantity, 0) * ISNULL(@UnitPrice, 0);
END;
GO

ALTER TABLE LineItem
ADD LineTotal AS dbo.fn_LineItemTotal(Quantity, UnitPrice);
GO


-- Views

-- 1. Adoption Pipeline
-- This view shows the adoption process by combining user, pet, species, breed,
-- application status, and application details into one report view.
CREATE VIEW v_AdoptionPipeline
AS
SELECT
    aa.UserID,
    u.FirstName,
    u.LastName,
    aa.PetID,
    p.Name AS PetName,
    s.Name AS SpeciesName,
    b.Name AS BreedName,
    aa.ApplicationStatus,
    aa.ApplicationDate,
    aa.ReviewDate,

    DATEDIFF(DAY, aa.ApplicationDate,
                 ISNULL(aa.ReviewDate, GETDATE())) AS DaysSinceApplication,
    ad.DwellingType,
    ad.LifestyleActivityLevel,
    ad.HoursOutPerDay
FROM AdoptionApplication aa
JOIN [User] u
    ON aa.UserID = u.UserID
JOIN Pet p
    ON aa.PetID = p.PetID
JOIN Breed b
    ON p.BreedID = b.BreedID
JOIN Species s
    ON b.SpeciesID = s.SpeciesID
LEFT JOIN ApplicationDetail ad
    ON aa.ApplicationDetailID = ad.ApplicationDetailID;
GO

-- 2. Product Sales by Category
-- This view summarizes product sales information including total quantity sold,
-- total sales amount, number of orders, and unique buyers by category and product.
CREATE VIEW v_ProductSalesByCategory
AS
SELECT
    c.CategoryID,
    c.Name AS CategoryName,
    p.ProductID,
    p.Name AS ProductName,
    COUNT(DISTINCT o.OrderID) AS OrdersCount,
    COUNT(DISTINCT o.UserID) AS UniqueBuyers,
    SUM(li.Quantity) AS TotalQuantity,
    SUM(li.Quantity * li.UnitPrice) AS TotalSalesAmount
FROM Category c
JOIN Product p
    ON p.CategoryID = c.CategoryID
JOIN LineItem li
    ON li.ProductID = p.ProductID
JOIN [Order] o
    ON o.OrderID = li.OrderID
GROUP BY
    c.CategoryID,
    c.Name,
    p.ProductID,
    p.Name;
GO

