-- INSERT INTO cell_count_db.indicator_type_entity  
-- VALUES 
-- (1, 'admin', 'admin role', 1),
-- (2, 'Professor role', 'Professor role', 1),
-- (3, 'Student role','Student role', 1);

INSERT INTO cell_count_db.indicator_entity 
VALUES
(1, 'admin', 'admin role', 1, 1),
(2, 'Professor role', 'Professor role', 2, 2),
(3, 'Student role', 'Student role', 3, 3);

SELECT * FROM cell_count_db.indicator_entity;