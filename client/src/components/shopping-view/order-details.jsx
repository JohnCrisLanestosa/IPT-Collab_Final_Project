import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

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
              <span className="break-words"><strong className="text-foreground">Name:</strong> {user.userName}</span>
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
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
