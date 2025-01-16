import { useEffect, useState } from "react";
import { api } from "./api/axios";

type Client = {
    _id: string;
    name: string;
    phone: string;
    address: string;
    email: string;
    ice: string;
};

type OrderLine = {
    _id: string;
    price: number;
    discount_amount: number;
    quantity: number;
    product_variant_id: {
        _id: string;
        name: string;
    };
};

type Order = {
    _id: string;
    ref: string;
    order_number: number;
    discount_amount: number;
    total_amount: number;
    createdAt: string;
    client_id: Client;
    orderline_ids: OrderLine[];
};

type Setting = {
    logo: string;
    footer_message: string;
};

type ApiResponse = {
    order: Order;
    setting: Setting;
};

export default function Test() {
    const [order, setOrder] = useState<ApiResponse | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.post<ApiResponse>("order/print-invoice/6788ce27c6986cb1a001aaa5"); // Adjust the endpoint as needed
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };
        fetchOrder();
    }, []);

    useEffect(() => {
        if (order) console.log(order);
    }, [order]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>INVOICE</h1>
                {order.setting.logo && (
                    <img src={order.setting.logo} alt="Logo" style={{ height: "50px" }} />
                )}
            </header>

            <p>Invoice Number: {order.order.ref}</p>
            <p>Date: {new Date(order.order.createdAt).toLocaleDateString()}</p>

            <section>
                <h2>Client Details</h2>
                <p>Name: {order.order.client_id.name}</p>
                <p>Phone: {order.order.client_id.phone}</p>
                <p>Address: {order.order.client_id.address}</p>
                <p>ICE: {order.order.client_id.ice}</p>
            </section>

            <section>
                <h2>Order Details</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Item</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Quantity</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Price</th>
                            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.order.orderline_ids.map((line) => (
                            <tr key={line._id}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {line.product_variant_id.name}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{line.quantity}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{line.price} MAD</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {line.quantity * line.price} MAD
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section style={{ marginTop: "20px" }}>
                <p>
                    <strong>Total Amount:</strong> {order.order.total_amount} MAD
                </p>
            </section>

            <footer style={{ marginTop: "20px", textAlign: "center" }}>
                <p>{order.setting.footer_message}</p>
            </footer>
        </div>
    );
}
