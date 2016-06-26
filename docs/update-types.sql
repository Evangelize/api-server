ALTER TABLE `classes` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `classMeetingDays` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisionClassAttendance` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisionClasses` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisionClassTeachers` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisionConfigs` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisions` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `divisionYears` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `notes` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `people` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `students` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `teachers` CHANGE `id` `id` BINARY(16) NOT NULL;

ALTER TABLE `classMeetingDays` CHANGE `divisionConfigId` `divisionConfigId` BINARY(16) NOT NULL;
ALTER TABLE `divisionClassAttendance` CHANGE `divisionClassId` `divisionClassId` BINARY(16) NOT NULL;
ALTER TABLE `divisionClasses` CHANGE `classId` `classId` BINARY(16) NOT NULL;
ALTER TABLE `divisionClasses` CHANGE `divisionId` `divisionId` BINARY(16) NOT NULL;
ALTER TABLE `divisionClassTeachers` CHANGE `divisionClassId` `divisionClassId` BINARY(16) NOT NULL;
ALTER TABLE `divisionClassTeachers` CHANGE `peopleId` `peopleId` BINARY(16) NOT NULL;
ALTER TABLE `divisions` CHANGE `divisionConfigId` `divisionConfigId` BINARY(16) NOT NULL;
ALTER TABLE `divisions` CHANGE `divisionYear` `divisionYear` BINARY(16) NOT NULL;
ALTER TABLE `divisionYears` CHANGE `divisionConfigId` `divisionConfigId` BINARY(16) NOT NULL;
ALTER TABLE `students` CHANGE `peopleId` `peopleId` BINARY(16) NOT NULL;
ALTER TABLE `teachers` CHANGE `peopleId` `peopleId` BINARY(16) NOT NULL;
ALTER TABLE `revisions` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `revisions` CHANGE `documentId` `documentId` BINARY(16) NOT NULL;
ALTER TABLE `revisionChanges` CHANGE `id` `id` BINARY(16) NOT NULL;
ALTER TABLE `revisionChanges` CHANGE `revisionId` `revisionId` BINARY(16) NOT NULL;
ALTER TABLE `users` CHANGE `peopleId` `peopleId` BINARY(16) NOT NULL;

UPDATE divisionClassAttendance
SET attendanceDate = attendanceDate + INTERVAL 7 HOUR;

ALTER TABLE `congregateClasses`.`divisionClassAttendance` ADD UNIQUE `divClassAttendanceUnique` (`divisionClassId`, `day`, `attendanceDate`);
