import React, { FC } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ICategories, IProduct } from "@/utils/types";

export interface CategorySelectProps {
  categories: ICategories[];
  product: IProduct;
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string | undefined; value: unknown }
    >
  ) => void;
}
const CategorySelect: FC<CategorySelectProps> = (props) => {
  if (!props || !props.product || !props.categories) return null;
  const { categories, product, handleChange } = props;
  return (
    <FormControl fullWidth required>
      <InputLabel id="category-id-label">Category </InputLabel>
      <Select
        labelId="category-id-label"
        id="category-id"
        value={product.categories_id || ""}
        label="Category"
        onChange={handleChange as any}
        name="categories_id"
        variant="outlined"
        type="number"
      >
        {categories.map((category: ICategories) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
