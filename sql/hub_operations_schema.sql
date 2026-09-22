CREATE TABLE hub_operations (
    shipment_id VARCHAR(20) PRIMARY KEY,
    operation_date DATE,
    inbound_time TIME,
    sorting_time TIME,
    outbound_time TIME,
    destination VARCHAR(50),
    quantity INT,
    status VARCHAR(20),
    error_type VARCHAR(50)
);
