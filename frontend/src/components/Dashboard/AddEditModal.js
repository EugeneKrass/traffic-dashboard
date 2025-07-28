import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Modal, Button } from "../UI";
import {
  selectModalOpen,
  selectEditingEntry,
  closeModal,
  createTrafficEntry,
  updateTrafficEntry,
} from "../../redux/slices/trafficSlice";
import { VALIDATION_RULES } from "../../utils/constants";

/**
 * Modal component for adding/editing traffic entries
 * Uses react-hook-form for form management and validation
 */
export const AddEditModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectModalOpen);
  const editingEntry = useSelector(selectEditingEntry);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  // Populate form when editing
  useEffect(() => {
    if (editingEntry) {
      setValue("date", editingEntry.date);
      setValue("visits", editingEntry.visits);
    } else {
      reset();
    }
  }, [editingEntry, setValue, reset]);

  /**
   * Handle form submission
   * @param {Object} data - Form data { date, visits }
   */
  const onSubmit = async (data) => {
    try {
      const formData = {
        date: data.date,
        visits: parseInt(data.visits, 10),
      };

      if (editingEntry) {
        // Update existing entry
        await dispatch(
          updateTrafficEntry({
            id: editingEntry.id,
            data: formData,
          })
        ).unwrap();
      } else {
        // Create new entry
        await dispatch(createTrafficEntry(formData)).unwrap();
      }

      handleClose();
    } catch (error) {
      // Error handling is done in Redux slice
      console.error("Error saving entry:", error);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    reset();
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingEntry ? "Edit Traffic Entry" : "Add New Traffic Entry"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            {...register("date", VALIDATION_RULES.date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Visits Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Visits
          </label>
          <input
            type="number"
            {...register("visits", VALIDATION_RULES.visits)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter number of visits"
          />
          {errors.visits && (
            <p className="mt-1 text-sm text-red-600">{errors.visits.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingEntry ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
