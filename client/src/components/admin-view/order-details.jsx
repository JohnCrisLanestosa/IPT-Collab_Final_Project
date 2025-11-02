import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-4 sm:gap-6 pb-4">
        <div className="grid gap-2">
          <div className="flex mt-6 items-start sm:items-center justify-between flex-wrap gap-2">
            <p className="font-medium">Order ID</p>
            <Label className="text-right break-all">{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between gap-2">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between gap-2">
            <p className="font-medium">Order Price</p>
            <Label>₱{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between gap-2">
            <p className="font-medium">Payment method</p>
            <Label className="capitalize">{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between gap-2">
            <p className="font-medium">Payment Status</p>
            <Label className="capitalize">{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between gap-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <li key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded">
                      <span className="font-medium">{item.title}</span>
                      <div className="flex gap-4 text-sm">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold">₱{item.price}</span>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-1.5 text-sm text-muted-foreground">
              <span className="break-words"><strong className="text-foreground">Customer Name:</strong> {orderDetails?.userId?.userName}</span>
              <span className="break-words"><strong className="text-foreground">Email:</strong> {orderDetails?.userId?.email}</span>
              <span className="break-words"><strong className="text-foreground">Address:</strong> {orderDetails?.addressInfo?.address}</span>
              <span className="break-words"><strong className="text-foreground">City:</strong> {orderDetails?.addressInfo?.city}</span>
              <span className="break-words"><strong className="text-foreground">Pincode:</strong> {orderDetails?.addressInfo?.pincode}</span>
              <span className="break-words"><strong className="text-foreground">Phone:</strong> {orderDetails?.addressInfo?.phone}</span>
              {orderDetails?.addressInfo?.notes && (
                <span className="break-words"><strong className="text-foreground">Notes:</strong> {orderDetails?.addressInfo?.notes}</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
