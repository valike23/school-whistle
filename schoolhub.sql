/* queries are formatted for readability purpose */

CREATE TABLE `school_db`.`user` ( `id` INT NOT NULL AUTO_INCREMENT COMMENT 'primary key of user table' , 
			`username` VARCHAR(100) NOT NULL COMMENT 'a unique username for every user' , 
			`email` VARCHAR(200) NULL DEFAULT NULL ,
			`phone` VARCHAR(20) NULL DEFAULT NULL , 
			`countryId` INT NULL , `stateId` INT NULL ,
			`townId` INT NULL ,
			`authorized` VARCHAR(20) NOT NULL DEFAULT 'user' ,
			`firstname` VARCHAR(30) NULL DEFAULT NULL ,
			`lastname` VARCHAR(30) NULL DEFAULT NULL ,
			`accntno` VARCHAR(30) NULL ,
			`profilepics` MEDIUMTEXT NULL ,
			`password` TEXT NOT NULL , 
			PRIMARY KEY (`id`),
			UNIQUE (`username`)) ENGINE = InnoDB;
			
			
			
/* test query to insert test data into user table  it may not be used */
INSERT INTO `user` (
			`id`, `username`, `email`, `phone`, `countryId`, `stateId`, 
			`townId`, `authorized`, `firstname`, `lastname`, `accntno`, 
			`profilepics`, `password`) 
			VALUES (NULL, 'valike23', NULL, '08175420053',
			'1', '1', '1', 'user', 'valentine', 'emmanuel',
			NULL, NULL, 'ludboyar');	

/* query for question in database witout linkin foreign key constraits */
CREATE TABLE `school_db`.`question` (
	`id` INT NOT NULL AUTO_INCREMENT COMMENT 'primary key of te question table' ,
	`quiz` VARCHAR(100) NOT NULL COMMENT 'question , each question should be unique' , 
	`opt1` VARCHAR(60) NOT NULL COMMENT 'option to quiz' , 
	`opt2` VARCHAR(60) NOT NULL COMMENT 'option to quiz' , 
	`opt3` VARCHAR(60) NOT NULL COMMENT 'option to quiz' , 
	`opt4` VARCHAR(60) NOT NULL COMMENT 'option to quiz' , 
	`image` MEDIUMTEXT NULL DEFAULT NULL COMMENT 'images are optional and rarely used' , 
	`ans` VARCHAR(60) NOT NULL COMMENT 'answer to tr question must the same with one of the options' , 
	`topicID` INT NULL ,
	`sujectID` INT NULL ,
	`levelID` INT NULL , PRIMARY KEY (`id`),
	UNIQUE (`quiz`)) ENGINE = InnoDB;	
 
 /* option for a one to many relation wit question currently a test prototype */
 CREATE TABLE `school_db`.`options` ( 
	`id` INT NOT NULL AUTO_INCREMENT ,
	`name` VARCHAR(50) NOT NULL ,
	`color` VARCHAR(10) NOT NULL , 
	PRIMARY KEY (`id`)) ENGINE = InnoDB;
	
	/* alter table to add forien key */
	ALTER TABLE 
			`options` ADD `questionId` INT NOT NULL AFTER `color`;


			/* new table query */
	CREATE TABLE `school_db`.`news`
	 ( `id` INT NOT NULL AUTO_INCREMENT , 
	 `title` TEXT NOT NULL ,
	  `content` LONGTEXT NOT NULL ,
	   `image` MEDIUMTEXT NULL ,
	    PRIMARY KEY (`id`)) ENGINE = InnoDB;

		/*create comment table */

		CREATE TABLE `school_db`.`comment` (
			 `id` INT NOT NULL AUTO_INCREMENT ,
			  `comment` MEDIUMTEXT NOT NULL , 
			  `newsId` INT NULL COMMENT 'the news that owns the comment. should ne null if it is a reply' ,
			   `commentId` INT NULL COMMENT 'if current comment is a reply. then id of the original comment' ,
			    `username` VARCHAR(105) NOT NULL COMMENT 'user who made the comment i.e commentator' ,
				 `likes` INT NOT NULL DEFAULT '0' ,
				  `dislikes` INT NOT NULL DEFAULT '0' ,
				   `DOP` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Time whencomment was originally made.' ,
				    `DOE` DATETIME NULL COMMENT 'time of last update' ,
					 PRIMARY KEY (`id`)) ENGINE = InnoDB;


/* to update views and increment it by 1.... also work on likes and dislikes  */
UPDATE news set views = views + 1 where id = newsId
UPDATE news set views = views + 1 where id = newsId


/* many to many relationship for comment and user table */
CREATE TABLE user_comment (
	 user_id INT NOT NULL, 
	 comment_id INT NOT NULL,
	  PRIMARY KEY( user_id, comment_id), 
	  FOREIGN KEY( user_id) REFERENCES user(id), 
	  FOREIGN KEY( comment_id) REFERENCES comment(id) )
/* alter tha above table to add like and dislike column */
ALTER TABLE `user_comment` ADD `likes` INT NULL DEFAULT NULL AFTER `comment_id`,
 ADD `dislikes` INT NULL DEFAULT NULL AFTER `likes`;

/* category table */
CREATE TABLE `school_db`.`category`
 ( `id` INT NOT NULL AUTO_INCREMENT ,
  `category` VARCHAR(30) NOT NULL ,
   `description` VARCHAR(200) NOT NULL , 
   PRIMARY KEY (`id`)) ENGINE = InnoDB;
			
			
			