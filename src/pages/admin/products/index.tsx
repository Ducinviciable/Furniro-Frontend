import AdminLayout from "../layout";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/redux/api/productApi";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { IProductInShop } from "@/utils/types";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const {
    data: productsRes,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [deteleProduct] = useDeleteProductMutation();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {(error as any).message || (error as any).data?.message || "An unknown error occurred."}</div>;
  }

  const products = productsRes?.data || [];

  const currentPageProducts = products.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteModal = (productId: number) => {
    setCategoryToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = (productId: number) => {
    if (productId !== null) {
      deteleProduct(productId)
        .unwrap()
        .then(() => {
          toast.success("Product deleted successfully.");
          refetch();
        })
        .catch((error) => {
          toast.error("Failed to delete product.");
        });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <Typography
          variant="h4"
          gutterBottom
          className="font-bold text-gray-900"
        >
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => router.push("/admin/products/create")}
        >
          Add Product
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="text-sm text-gray-500">ID</TableCell>
              <TableCell className="text-sm text-gray-500">Name</TableCell>
              <TableCell className="text-sm text-gray-500">Image</TableCell>
              <TableCell className="text-sm text-gray-500">Price</TableCell>
              <TableCell className="text-sm text-gray-500">
                Sale Percent
              </TableCell>
              <TableCell className="text-sm text-gray-500">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageProducts.map((product: IProductInShop) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                  $
                  {(
                    product.price -
                    (product.price * product.sale_percent) / 100
                  ).toFixed(2)}
                </TableCell>
                <TableCell>{product.sale_percent}%</TableCell>
                <TableCell className="flex space-x-2">
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() =>
                        router.push(`/admin/products/edit/${product.id}`)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleOpenDeleteModal(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={products.length} // Tổng số sản phẩm
        page={page} // Trang hiện tại
        onPageChange={handleChangePage} // Thay đổi trang
        rowsPerPage={rowsPerPage} // Số sản phẩm mỗi trang
        onRowsPerPageChange={handleChangeRowsPerPage} // Thay đổi số sản phẩm mỗi trang
        rowsPerPageOptions={[5, 10, 25]} // Các lựa chọn số sản phẩm mỗi trang
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Are you sure you want to delete this product?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(categoryToDelete!)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
