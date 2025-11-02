import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div>
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] object-cover rounded-t-lg transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </div>
        <CardContent className="p-3">
          <h2 className="text-base font-bold mb-1 mt-1 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary">
              ₱{product?.price}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center gap-2 p-3 pt-0">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="flex-1 h-9 text-sm"
          >
            Edit
          </Button>
          <Button 
            onClick={() => handleDelete(product?._id)}
            variant="destructive"
            className="flex-1 h-9 text-sm"
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
