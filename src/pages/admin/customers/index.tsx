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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useDeleteCustomerMutation,
  useGetAllCustomerQuery,
} from "@/redux/api/customerApi";
import Loading from "@/components/Loading";
import { IUser } from "@/utils/types";
import { useState } from "react";
import toast from "react-hot-toast";
import { getRtkErrorMessage } from "@/utils/rtkHelpers";
export default function CustomersPage() {
  const { data, isLoading, error, refetch } = useGetAllCustomerQuery();

  const [deleteCustomer] = useDeleteCustomerMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setcustomerToDelete] = useState<number | null>(null);

  const handleDeleteCustomer = (id: number) => {
    deleteCustomer(id)
      .unwrap()
      .then(() => {
        toast.success("Customer deleted successfully.");
        refetch();
        setIsDeleteModalOpen(false);
      })
      .catch(() => {
        toast.error("Failed to delete customer.");
      });
  };

  const handleOpenDeleteModal = (id: number) => {
    setcustomerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setcustomerToDelete(null);
    setIsDeleteModalOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error: {getRtkErrorMessage(error)}
      </div>
    );
  }
  const customers = data?.data || [];
  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} sx={{ mb: 2 }}>
        Add Customer
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer: IUser) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Button size="small">Edit</Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleOpenDeleteModal(customer.id as number)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Are you sure you want to delete this customer?
            </h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseDeleteModal}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(customerToDelete!)}
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
