import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Paper,
  Box,
  FormControl,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetProductsByIdQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useGetAllCategoryQuery,
} from "@/redux/api/productApi";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { IProduct } from "@/utils/types";
import toast from "react-hot-toast";
import CategorySelect from "./CategorySelect";

const ProductForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Boolean(id);

  const { data, isLoading: isLoadingProduct } = useGetProductsByIdQuery(id, {
    skip: !isEditMode,
  });
  const { data: categoryDataRes, isLoading: isLoadingCategory } =
    useGetAllCategoryQuery({});
  const categoryData = categoryDataRes?.data;
  console.log(categoryData);
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateProductMutation();

  const [product, setProduct] = useState<IProduct>({
    id: 0,
    name: "",
    description: "",
    SKU: "",
    tags: [],
    categories_id: 0,
    products_details: {
      sort_description: "",
      long_description: "",
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        weight: 0,
        seat_height: 0,
        leg_height: 0,
      },
      warranty: {
        warranty_summary: "",
        warranty_service_type: "",
        covered_in_warranty: "",
        not_covered_in_warranty: "",
        domestic_warranty: "",
      },
      general: {
        model_number: "",
        sales_package: "",
        secondary_material: "",
        configuration: "",
        upholstery_material: "",
        upholstery_color: "",
      },
    },
    products_prices: {
      price: 0,
      sale_percent: 0,
    },
    products_images: {
      images: [],
    },
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (data && isEditMode) {
      setProduct(data.data);
    }
  }, [data, isEditMode]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string | undefined; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    if (!name) return;
    setProduct((prev) => {
      const nameParts = name.split(".");
      if (nameParts.length === 1) {
        return { ...prev, [name]: value };
      }

      const updateNestedState = (
        obj: Record<string, any>,
        parts: string[],
        value: unknown
      ): Record<string, any> => {
        if (parts.length === 1) {
          return { ...obj, [parts[0]]: value };
        }
        const [current, ...rest] = parts;
        return {
          ...obj,
          [current]: updateNestedState(obj[current] || {}, rest, value),
        };
      };

      return updateNestedState(prev, nameParts, value);
    });
  };

  const handleAddTag = () => {
    if (newTag && !product.tags?.includes(newTag)) {
      setProduct((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setProduct((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleSave = async () => {
    try {
      const productData = isEditMode
        ? product
        : {
            ...product,
            // products_variants: undefined,
          };

      if (isEditMode) {
        await updateProduct(productData)
          .unwrap()
          .then(() => {
            toast.success("Product updated successfully!");
          })
          .catch(() => {
            toast.error("Failed to update product");
          });
      } else {
        await createProduct(productData)
          .unwrap()
          .then(() => {
            toast.success("Product created successfully!");
          })
          .catch(() => {
            toast.error("Failed to create product");
          });
      }
      //   router.push("/admin/products");
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product");
    }
  };

  const handleDeleteImage = (image: string) => {
    setProduct((prev) => {
      const currentImages = prev.products_images?.images || [];
      return {
        ...prev,
        products_images: {
          ...prev.products_images,
          images: currentImages.filter((img) => img !== image),
        },
      };
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "funiro");
      formData.append("api_key", "671279165276347");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dmodnm4xp/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        const imageUrl = result.secure_url;

        const currentImages = product.products_images?.images || [];
        if (currentImages.length < 5) {
          setProduct((prev) => ({
            ...prev,
            products_images: {
              ...prev.products_images,
              images: [...(prev.products_images?.images || []), imageUrl],
            },
          }));
        } else {
          toast.error("You can only add up to 5 images.");
        }
      } else {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  if (isLoadingProduct && isEditMode) {
    return <Loading />;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? `Edit Product - ${product.name}` : "Create New Product"}
        </Typography>
        <Stack spacing={4}>
          {/* Basic Information */}
          <Typography variant="h6">Basic Information</Typography>

          {isEditMode ? (
            <TextField
              label="Product ID"
              variant="outlined"
              fullWidth
              name="id"
              value={product.id}
              onChange={handleChange}
              disabled
            />
          ) : null}

          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Short Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            name="products_details.sort_description"
            value={product.products_details?.sort_description}
            onChange={handleChange}
            required
          />

          <TextField
            label="Long Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            name="products_details.long_description"
            value={product.products_details?.long_description}
            onChange={handleChange}
            required
          />

          <TextField
            label="SKU"
            variant="outlined"
            fullWidth
            name="SKU"
            value={product.SKU}
            onChange={handleChange}
            required
          />

          <CategorySelect
            categories={categoryData || []}
            product={product}
            handleChange={handleChange}
          />

          {/* Tags Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="New Tag"
                variant="outlined"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                size="small"
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add Tag
              </Button>
            </Stack>
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {product.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                />
              ))}
            </Box>
          </Box>

          {isEditMode && product.products_variants && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Variants
              </Typography>

              {/* Sizes */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Sizes:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.products_variants.size.map((size, index) => (
                    <Chip key={index} label={size} />
                  ))}
                </Box>
              </Box>

              {/* Colors */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Colors:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.products_variants.color.map((color, index) => (
                    <Chip key={index} label={color} />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          <Typography variant="h6">Price</Typography>
          <Box display="flex" justifyContent="space-between">
            <Box flex={1} mr={2}>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                name="products_prices.price"
                type="number"
                value={product.products_prices?.price}
                onChange={handleChange}
              />
            </Box>
            <Box flex={1}>
              <TextField
                label="Sale Percent(%)"
                variant="outlined"
                fullWidth
                name="products_prices.sale_percent"
                type="number"
                value={product.products_prices?.sale_percent}
                onChange={handleChange}
                inputProps={{
                  min: 0,
                  max: 100,
                  step: 1,
                }}
              />
            </Box>
          </Box>

          {/* Warranty Information */}
          <Typography variant="h6">Warranty Information</Typography>
          <Stack spacing={2}>
            <TextField
              label="Warranty Summary"
              variant="outlined"
              fullWidth
              name="products_details.warranty.warranty_summary"
              value={product.products_details?.warranty.warranty_summary ?? ""}
              onChange={handleChange}
            />
            <TextField
              label="Warranty Service Type"
              variant="outlined"
              fullWidth
              name="products_details.warranty.warranty_service_type"
              value={product.products_details?.warranty.warranty_service_type}
              onChange={handleChange}
            />
            <TextField
              label="Covered in Warranty"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              name="products_details.warranty.covered_in_warranty"
              value={product.products_details?.warranty.covered_in_warranty}
              onChange={handleChange}
            />
            <TextField
              label="Not Covered in Warranty"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              name="products_details.warranty.not_covered_in_warranty"
              value={product.products_details?.warranty.not_covered_in_warranty}
              onChange={handleChange}
            />
            <TextField
              label="Domestic Warranty"
              variant="outlined"
              fullWidth
              name="products_details.warranty.domestic_warranty"
              value={product.products_details?.warranty.domestic_warranty}
              onChange={handleChange}
            />
          </Stack>

          {/* Dimensions Fields */}
          <Typography variant="h6">Dimensions</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Width"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.width"
              type="number"
              value={product.products_details?.dimensions.width}
              onChange={handleChange}
            />
            <TextField
              label="Height"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.height"
              type="number"
              value={product.products_details?.dimensions.height}
              onChange={handleChange}
            />
            <TextField
              label="Depth"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.depth"
              type="number"
              value={product.products_details?.dimensions.depth}
              onChange={handleChange}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Weight"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.weight"
              type="number"
              value={product.products_details?.dimensions.weight}
              onChange={handleChange}
            />
            <TextField
              label="Seat Height"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.seat_height"
              type="number"
              value={product.products_details?.dimensions.seat_height}
              onChange={handleChange}
            />
            <TextField
              label="Leg Height"
              variant="outlined"
              fullWidth
              name="products_details.dimensions.leg_height"
              type="number"
              value={product.products_details?.dimensions.leg_height}
              onChange={handleChange}
            />
          </Stack>

          {/* General Information */}
          <Typography variant="h6">General Information</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Sales Package"
              variant="outlined"
              fullWidth
              name="products_details.general.sales_package"
              value={product.products_details?.general.sales_package}
              onChange={handleChange}
            />
            <TextField
              label="Model Number"
              variant="outlined"
              fullWidth
              name="products_details.general.model_number"
              value={product.products_details?.general.model_number}
              onChange={handleChange}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Secondary Material"
              variant="outlined"
              fullWidth
              name="products_details.general.secondary_material"
              value={product.products_details?.general.secondary_material}
              onChange={handleChange}
            />
            <TextField
              label="Configuration"
              variant="outlined"
              fullWidth
              name="products_details.general.configuration"
              value={product.products_details?.general.configuration}
              onChange={handleChange}
            />
            <TextField
              label="Upholstery Material"
              variant="outlined"
              fullWidth
              name="products_details.general.upholstery_material"
              value={product.products_details?.general.upholstery_material}
              onChange={handleChange}
            />
          </Stack>

          <TextField
            label="Upholstery Color"
            variant="outlined"
            fullWidth
            name="products_details.general.upholstery_color"
            value={product.products_details?.general.upholstery_color}
            onChange={handleChange}
          />

          {/* Created At - Only show in edit mode */}
          {isEditMode && (
            <TextField
              label="Created At"
              variant="outlined"
              fullWidth
              value={
                product.created_at
                  ? new Date(product.created_at).toLocaleString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : ""
              }
              disabled
            />
          )}

          {/* Product Images */}
          <Typography variant="h6">Product Images</Typography>
          <Stack direction="row" spacing={2}>
            {product.products_images?.images.map(
              (image: string, index: number) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    onClick={() => handleDeleteImage(image)}
                  >
                    <DeleteIcon sx={{ color: "white" }} />
                  </IconButton>
                </Box>
              )
            )}
          </Stack>

          {/* Image Upload */}
          <FormControl fullWidth>
            <Button
              variant="contained"
              color="primary"
              component="label"
              disabled={(product.products_images?.images?.length || 0) >= 5}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </FormControl>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {isEditMode ? "Save Changes" : "Create Product"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProductForm;
