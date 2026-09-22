INSERT INTO hub_operations
(shipment_id, operation_date, inbound_time, sorting_time, outbound_time, destination, quantity, status, error_type)
VALUES
('SHP001','2026-09-01','08:05','08:25','10:15','HCM',120,'Completed','None'),
('SHP002','2026-09-01','08:20','08:45','11:00','Binh_Duong',85,'Completed','None'),
('SHP003','2026-09-01','09:10','09:40','12:05','Long_An',150,'Completed','None'),
('SHP004','2026-09-01','09:35','10:10','12:30','Tay_Ninh',95,'Completed','Wrong_Sort'),
('SHP005','2026-09-01','10:00','10:25','13:15','HCM',200,'Completed','None'),
('SHP006','2026-09-01','10:20','10:55','14:00','Dong_Nai',110,'Completed','None'),
('SHP007','2026-09-01','11:05','11:40','14:30','Binh_Duong',75,'Completed','Missing_Label'),
('SHP008','2026-09-01','11:30','12:00','15:10','HCM',180,'Completed','None'),
('SHP009','2026-09-01','12:15','12:45','16:00','Long_An',130,'Completed','None'),
('SHP010','2026-09-01','13:00','13:35','17:20','Tay_Ninh',90,'Completed','Late_Sorting'),
('SHP011','2026-09-01','13:25','14:00','17:45','Dong_Nai',105,'Completed','None'),
('SHP012','2026-09-01','14:10','14:40','18:15','HCM',160,'Completed','None'),
('SHP013','2026-09-01','14:45','15:20','18:40','Binh_Duong',125,'Completed','None'),
('SHP014','2026-09-01','15:20','16:00','19:10','Long_An',140,'Completed','Wrong_Sort'),
('SHP015','2026-09-01','16:00','16:35','20:00','HCM',220,'Completed','None');
