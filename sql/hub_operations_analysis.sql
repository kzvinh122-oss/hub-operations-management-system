-- Hub Operations Management System
-- SQL Analysis

-- 1. View toàn bộ dữ liệu
SELECT *
FROM hub_operations;


-- 2. Tổng số shipment
SELECT COUNT(*) AS total_shipments
FROM hub_operations;


-- 3. Tổng số kiện hàng
SELECT SUM(quantity) AS total_quantity
FROM hub_operations;


-- 4. Số shipment theo từng điểm đến
SELECT
    destination,
    COUNT(*) AS total_shipments,
    SUM(quantity) AS total_quantity
FROM hub_operations
GROUP BY destination
ORDER BY total_quantity DESC;


-- 5. Kiểm tra các shipment có lỗi
SELECT
    shipment_id,
    destination,
    quantity,
    error_type
FROM hub_operations
WHERE error_type <> 'None';


-- 6. Thống kê loại lỗi
SELECT
    error_type,
    COUNT(*) AS error_count
FROM hub_operations
WHERE error_type <> 'None'
GROUP BY error_type
ORDER BY error_count DESC;


-- 7. Tỷ lệ shipment có lỗi
SELECT
    COUNT(CASE WHEN error_type <> 'None' THEN 1 END) * 100.0
    / COUNT(*) AS error_rate_percent
FROM hub_operations;


-- 8. Sản lượng theo ngày
SELECT
    operation_date,
    COUNT(*) AS total_shipments,
    SUM(quantity) AS total_quantity
FROM hub_operations
GROUP BY operation_date
ORDER BY operation_date;


-- 9. Shipment có sản lượng lớn
SELECT
    shipment_id,
    destination,
    quantity
FROM hub_operations
WHERE quantity >= 150
ORDER BY quantity DESC;


-- 10. Top điểm đến theo sản lượng
SELECT
    destination,
    SUM(quantity) AS total_quantity
FROM hub_operations
GROUP BY destination
ORDER BY total_quantity DESC;
