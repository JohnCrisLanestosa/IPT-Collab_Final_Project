import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { categoryOptionsMap } from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 ease-in-out border-2 hover:border-secondary/50">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[200px] object-cover rounded-t-lg transition-transform duration-500 ease-in-out hover:scale-110"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-3">
          <h2 className="text-base font-bold mb-1 line-clamp-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary">
              ₱{product?.price}
            </span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-3 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed h-9 text-sm">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full h-9 text-sm"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
