CREATE TABLE signup_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullName VARCHAR(100)  NULL DEFAULT NULL,
  mobileNumber VARCHAR(10)  NULL DEFAULT NULL,
  gender ENUM('male', 'female', 'trans')  NULL DEFAULT NULL,
  password TEXT  NULL DEFAULT NULL,
  confirmPassword TEXT  NULL DEFAULT NULL,
  hallname VARCHAR(100)  NULL DEFAULT NULL,
  hallType ENUM('nonac', 'ac')  NULL DEFAULT NULL,
  hallCapacity VARCHAR(100)  NULL DEFAULT NULL,
  parkingArea VARCHAR(100)  NULL DEFAULT NULL,
  hallAddress TEXT  NULL DEFAULT NULL,
  pincode VARCHAR(6)  NULL DEFAULT NULL,
  signed_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE `signup_details` ADD `status` ENUM('pending','inactive','active','closed') NOT NULL DEFAULT 'pending' AFTER `pincode`;

ALTER TABLE `signup_details` ADD `state` VARCHAR(512) NULL DEFAULT NULL AFTER `hallAddress`, ADD `district` VARCHAR(512) NULL DEFAULT NULL AFTER `state`, ADD `mandal` VARCHAR(512) NULL DEFAULT NULL AFTER `district`;