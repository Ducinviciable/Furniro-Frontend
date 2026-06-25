"use client";

import AdminLayout from "../layout";
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/productApi";
import { ICategories } from "@/utils/types";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getRtkErrorMessage } from "@/utils/rtkHelpers";

export default function CategoriesPage() {
  const { data, isLoading, error, refetch } = useGetAllCategoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Check if it's edit mode
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null
  );

  // States for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

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

  const categories = data?.data || [];

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "") {
      createCategory({ name: newCategoryName })
        .unwrap()
        .then(() => {
          toast.success("Category created successfully.");
          refetch();
        })
        .catch(() => {
          toast.error("Fail to create category.");
        });
      setIsModalOpen(false);
      setNewCategoryName("");
    } else {
      toast.error("Please enter a category name.");
    }
  };

  const handleEditCategory = () => {
    if (newCategoryName.trim() !== "") {
      if (editingCategoryId !== null) {
        updateCategory({ id: editingCategoryId, name: newCategoryName })
          .unwrap()
          .then(() => {
            toast.success("Category updated successfully.");
            refetch();
            setIsModalOpen(false);
            setNewCategoryName("");
            setIsEditMode(false);
          })
          .catch(() => {
            toast.error("Failed to update category.");
          });
      }
    } else {
      toast.error("Please enter a category name.");
    }
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategory(id)
      .unwrap()
      .then(() => {
        toast.success("Category deleted successfully.");
        refetch();
        setIsDeleteModalOpen(false);
      })
      .catch(() => {
        toast.error("Failed to delete category.");
      });
  };

  const openDeleteModal = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            setNewCategoryName("");
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category: ICategories) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(category.created_at || "").toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsEditMode(true);
                        setEditingCategoryId(Number(category.id));
                        setNewCategoryName(category.name);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(Number(category.id))}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add or Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Category Name"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleEditCategory : handleAddCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditMode ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Are you sure you want to delete this category?
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
