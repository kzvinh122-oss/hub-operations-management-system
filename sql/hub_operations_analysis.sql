-- =========================================================
-- Hub Operations Management System
-- SQL KPI & Operational Analysis
-- =========================================================


-- 1. VIEW TOÀN BỘ DỮ LIỆU
SELECT *
FROM hub_operations;


-- =========================================================
-- 2. KPI TỔNG QUAN
-- =========================================================

-- Tổng số shipment
SELECT
    COUNT(*) AS total_shipments
FROM hub_operations;


-- Tổng số kiện hàng
SELECT
    SUM(quantity) AS total_quantity
FROM hub_operations;


-- Số shipment hoàn thành
SELECT
    COUNT(*) AS completed_shipments
FROM hub_operations
WHERE status = 'Completed';


-- =========================================================
-- 3. KPI LỖI VẬN HÀNH
-- =========================================================

-- Tổng số shipment có lỗi
SELECT
    COUNT(*) AS error_shipments
FROM hub_operations
WHERE error_type <> 'None';


-- Tỷ lệ shipment có lỗi (%)
SELECT
    ROUND(
        COUNT(CASE WHEN error_type <> 'None' THEN 1 END)
        * 100.0 / COUNT(*),
        2
    ) AS error_rate_percent
FROM hub_operations;


-- Thống kê từng loại lỗi
SELECT
    error_type,
    COUNT(*) AS error_count
FROM hub_operations
WHERE error_type <> 'None'
GROUP BY error_type
ORDER BY error_count DESC;


-- =========================================================
-- 4. PHÂN TÍCH THEO ĐIỂM ĐẾN
-- =========================================================

-- Số shipment theo destination
SELECT
    destination,
    COUNT(*) AS total_shipments
FROM hub_operations
GROUP BY destination
ORDER BY total_shipments DESC;


-- Tổng sản lượng theo destination
SELECT
    destination,
    SUM(quantity) AS total_quantity
FROM hub_operations
GROUP BY destination
ORDER BY total_quantity DESC;


-- Shipment lỗi theo destination
SELECT
    destination,
    COUNT(*) AS error_shipments
FROM hub_operations
WHERE error_type <> 'None'
GROUP BY destination
ORDER BY error_shipments DESC;


-- =========================================================
-- 5. PHÂN TÍCH THỜI GIAN XỬ LÝ
-- =========================================================

-- Thời gian từ Inbound → Sorting
SELECT
    shipment_id,
    destination,
    ROUND(
        (TIME_TO_SEC(sorting_time)
        - TIME_TO_SEC(inbound_time)) / 60,
        2
    ) AS inbound_to_sorting_minutes
FROM hub_operations
ORDER BY inbound_to_sorting_minutes DESC;


-- Thời gian từ Sorting → Outbound
SELECT
    shipment_id,
    destination,
    ROUND(
        (TIME_TO_SEC(outbound_time)
        - TIME_TO_SEC(sorting_time)) / 60,
        2
    ) AS sorting_to_outbound_minutes
FROM hub_operations
ORDER BY sorting_to_outbound_minutes DESC;


-- Tổng thời gian xử lý Inbound → Outbound
SELECT
    shipment_id,
    destination,
    ROUND(
        (TIME_TO_SEC(outbound_time)
        - TIME_TO_SEC(inbound_time)) / 60,
        2
    ) AS total_processing_minutes
FROM hub_operations
ORDER BY total_processing_minutes DESC;


-- =========================================================
-- 6. THỜI GIAN XỬ LÝ TRUNG BÌNH
-- =========================================================

-- Average Inbound → Sorting
SELECT
    ROUND(
        AVG(
            (TIME_TO_SEC(sorting_time)
            - TIME_TO_SEC(inbound_time)) / 60
        ),
        2
    ) AS avg_inbound_to_sorting_minutes
FROM hub_operations;


-- Average Sorting → Outbound
SELECT
    ROUND(
        AVG(
            (TIME_TO_SEC(outbound_time)
            - TIME_TO_SEC(sorting_time)) / 60
        ),
        2
    ) AS avg_sorting_to_outbound_minutes
FROM hub_operations;


-- Average Total Processing Time
SELECT
    ROUND(
        AVG(
            (TIME_TO_SEC(outbound_time)
            - TIME_TO_SEC(inbound_time)) / 60
        ),
        2
    ) AS avg_total_processing_minutes
FROM hub_operations;


-- =========================================================
-- 7. SHIPMENT CÓ SẢN LƯỢNG CAO
-- =========================================================

SELECT
    shipment_id,
    destination,
    quantity,
    status
FROM hub_operations
WHERE quantity >= 150
ORDER BY quantity DESC;


-- =========================================================
-- 8. SHIPMENT CÓ THỜI GIAN XỬ LÝ DÀI
-- =========================================================

SELECT
    shipment_id,
    destination,
    ROUND(
        (TIME_TO_SEC(outbound_time)
        - TIME_TO_SEC(inbound_time)) / 60,
        2
    ) AS processing_minutes
FROM hub_operations
WHERE
    (TIME_TO_SEC(outbound_time)
    - TIME_TO_SEC(inbound_time)) / 60 >= 240
ORDER BY processing_minutes DESC;


-- =========================================================
-- 9. PHÂN TÍCH THEO NGÀY
-- =========================================================

SELECT
    operation_date,
    COUNT(*) AS total_shipments,
    SUM(quantity) AS total_quantity,
    COUNT(CASE WHEN error_type <> 'None' THEN 1 END)
        AS error_shipments
FROM hub_operations
GROUP BY operation_date
ORDER BY operation_date;


-- =========================================================
-- 10. TOP DESTINATION THEO SẢN LƯỢNG
-- =========================================================

SELECT
    destination,
    SUM(quantity) AS total_quantity
FROM hub_operations
GROUP BY destination
ORDER BY total_quantity DESC;


-- =========================================================
-- END OF HUB OPERATIONS ANALYSIS
-- =========================================================
